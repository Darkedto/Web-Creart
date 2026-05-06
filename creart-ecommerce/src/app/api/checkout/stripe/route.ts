import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'orderId requerido', code: 400 }, { status: 400 });

    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: 'Orden no encontrada', code: 404 }, { status: 404 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: order.customer.email,
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'hnl',
          product_data: {
            name: item.name,
            description: [item.variant?.size, item.variant?.color].filter(Boolean).join(' / ') || undefined,
            metadata: { sku: item.sku },
          },
          unit_amount: Math.round(item.price * 100), // Stripe uses smallest currency unit
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(order.shipping * 100), currency: 'hnl' },
            display_name: order.shipping === 0 ? 'Envío gratis' : `Envío — L. ${order.shipping}`,
          },
        },
      ],
      metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
      success_url: `${appUrl}/order/${order._id}?stripe=success`,
      cancel_url: `${appUrl}/checkout?cancelled=true`,
    });

    // Save stripe session ID to order
    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[POST /api/checkout/stripe]', err);
    return NextResponse.json({ error: 'Error al crear sesión de pago', code: 500 }, { status: 500 });
  }
}
