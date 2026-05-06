import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import Stripe from 'stripe';

// Stripe requires the raw body — disable body parsing
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Configuración de webhook faltante' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe webhook] Firma inválida:', err);
    return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await connectDB();
        await Order.findByIdAndUpdate(orderId, {
          $set: {
            paymentStatus: 'paid',
            fulfillmentStatus: 'in_production',
            stripeSessionId: session.id,
          },
        });
        console.log(`[Webhook] Orden ${orderId} marcada como pagada`);
      } catch (err) {
        console.error('[Webhook] Error actualizando orden:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
