import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <AdminShell>
      <div style={{ padding: 32, maxWidth: 900 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#6b6557', letterSpacing: '0.1em', marginBottom: 6 }}>/ NUEVO</div>
          <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 40, color: '#ffd23f', lineHeight: 0.9 }}>NUEVO PRODUCTO</h1>
        </div>
        <ProductForm />
      </div>
    </AdminShell>
  );
}
