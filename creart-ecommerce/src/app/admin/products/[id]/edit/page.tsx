import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) notFound();

  return (
    <AdminShell>
      <div style={{ padding: 32, maxWidth: 900 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#6b6557', letterSpacing: '0.1em', marginBottom: 6 }}>/ EDITAR</div>
          <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 40, color: '#ffd23f', lineHeight: 0.9 }}>EDITAR PRODUCTO</h1>
          <p style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#6b6557', marginTop: 8 }}>{product.sku} — {product.name.es}</p>
        </div>
        <ProductForm initial={JSON.parse(JSON.stringify(product))} />
      </div>
    </AdminShell>
  );
}
