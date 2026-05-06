import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { OrderCreateSchema } from '@/lib/validators';
import { calculateShipping } from '@/lib/shipping';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado', code: 401 }, { status: 401 });

    await connectDB();
    const { searchParams } = req.nextUrl;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    if (status) filter.fulfillmentStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: 'Error del servidor', code: 500 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = OrderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten(), code: 400 }, { status: 400 });
    }

    const { customer, items, paymentMethod, stripeSessionId } = parsed.data;

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = calculateShipping(customer.address.department, subtotal);
    const total = subtotal + shipping;

    await connectDB();
    const order = await Order.create({
      customer,
      items,
      subtotal,
      shipping,
      total,
      currency: 'HNL',
      paymentMethod,
      paymentStatus: 'pending',
      fulfillmentStatus: 'pending',
      stripeSessionId,
      whatsappSent: false,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: 'Error al crear orden', code: 500 }, { status: 500 });
  }
}
