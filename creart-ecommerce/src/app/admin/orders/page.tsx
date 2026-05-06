import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { AdminShell } from '@/components/admin/AdminShell';
import { OrdersClient } from './OrdersClient';

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();

  return (
    <AdminShell>
      <OrdersClient orders={JSON.parse(JSON.stringify(orders))} />
    </AdminShell>
  );
}
