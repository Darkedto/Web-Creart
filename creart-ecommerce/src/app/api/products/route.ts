import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { ProductCreateSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { active: true };

    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    if (category && category !== 'all') filter.category = category;
    if (tag) filter.tags = tag;
    if (q) {
      filter.$or = [
        { 'name.es': { $regex: q, $options: 'i' } },
        { 'name.en': { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ products });
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'Error al obtener productos', code: 500 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autorizado', code: 401 }, { status: 401 });

    const body = await req.json();
    const parsed = ProductCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten(), code: 400 }, { status: 400 });
    }

    await connectDB();
    const product = await Product.create(parsed.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/products]', err);
    return NextResponse.json({ error: 'Error al crear producto', code: 500 }, { status: 500 });
  }
}
