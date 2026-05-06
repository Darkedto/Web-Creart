import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { OrderStatusUpdateSchema } from '@/lib/validators';

interface Params { params: { id: string } }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const order = await Order.findById(params.id).lean();
    if (!order) return NextResponse.json({ error: 'Orden no encontrada', code: 404 }, { status: 404 });

    // Permit public access only if email matches query param (customer self-lookup)
    const session = await getServerSession(authOptions);
    const emailParam = req.nextUrl.searchParams.get('email');
    if (!session && order.customer.email !== emailParam) {
      return NextResponse.json({ error: 'No autorizado', code: 401 }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Error del servidor', code: 500 }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado', code: 401 }, { status: 401 });

    const body = await req.json();
    const parsed = OrderStatusUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten(), code: 400 }, { status: 400 });

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );
    if (!order) return NextResponse.json({ error: 'Orden no encontrada', code: 404 }, { status: 404 });

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar orden', code: 500 }, { status: 500 });
  }
}
