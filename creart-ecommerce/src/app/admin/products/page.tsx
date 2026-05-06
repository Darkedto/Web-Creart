import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductsClient } from './ProductsClient';

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <AdminShell>
      <ProductsClient products={JSON.parse(JSON.stringify(products))} />
    </AdminShell>
  );
}
