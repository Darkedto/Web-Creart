import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { ProductUpdateSchema } from '@/lib/validators';

interface Params { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const product = await Product.findOne({ $or: [{ _id: params.id }, { slug: params.id }], active: true }).lean();
    if (!product) return NextResponse.json({ error: 'Producto no encontrado', code: 404 }, { status: 404 });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Error del servidor', code: 500 }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado', code: 401 }, { status: 401 });

    const body = await req.json();
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten(), code: 400 }, { status: 400 });

    await connectDB();
    const product = await Product.findByIdAndUpdate(params.id, { $set: parsed.data }, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: 'Producto no encontrado', code: 404 }, { status: 404 });

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar', code: 500 }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado', code: 401 }, { status: 401 });

    await connectDB();
    // Soft delete — marca como inactivo en lugar de borrar
    const product = await Product.findByIdAndUpdate(params.id, { active: false }, { new: true });
    if (!product) return NextResponse.json({ error: 'Producto no encontrado', code: 404 }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar', code: 500 }, { status: 500 });
  }
}
