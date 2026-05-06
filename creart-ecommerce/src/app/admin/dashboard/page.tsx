import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { AdminShell } from '@/components/admin/AdminShell';
import { formatPrice } from '@/lib/shipping';

async function getStats() {
  await connectDB();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayOrders, monthOrders, totalOrders, activeProducts] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: startOfDay } }),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments(),
    Product.countDocuments({ active: true }),
  ]);

  const monthRevenueAgg = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const monthRevenue = monthRevenueAgg[0]?.total ?? 0;

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();

  return { todayOrders, monthOrders, totalOrders, activeProducts, monthRevenue, recentOrders: JSON.parse(JSON.stringify(recentOrders)) };
}

const FULFILLMENT_COLORS: Record<string, string> = {
  pending: '#f77f00',
  in_production: '#1d4e89',
  shipped: '#7c3aed',
  delivered: '#2a9d3f',
  cancelled: '#e63946',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const { todayOrders, monthOrders, totalOrders, activeProducts, monthRevenue, recentOrders } = await getStats();

  return (
    <AdminShell>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#6b6557', letterSpacing: '0.1em', marginBottom: 6 }}>/ PANEL</div>
          <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 48, color: '#ffd23f', lineHeight: 0.9 }}>DASHBOARD</h1>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'ÓRDENES HOY', value: todayOrders, color: '#ffd23f' },
            { label: 'ÓRDENES MES', value: monthOrders, color: '#ffd23f' },
            { label: 'TOTAL ÓRDENES', value: totalOrders, color: '#ffd23f' },
            { label: 'VENTAS MES', value: formatPrice(monthRevenue), color: '#2a9d3f' },
            { label: 'PRODUCTOS ACTIVOS', value: activeProducts, color: '#1d4e89' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#1a1a1a', border: `2px solid ${s.color}`, padding: '20px 24px', boxShadow: `4px 4px 0 ${s.color}` }}>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557', letterSpacing: '0.1em', marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--fdisp)', fontSize: 36, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 28, color: '#eee5d3', marginBottom: 16 }}>ÓRDENES RECIENTES</h2>
          <div style={{ background: '#1a1a1a', border: '2px solid #333', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ffd23f' }}>
                  {['Número', 'Cliente', 'Total', 'Pago', 'Estado', 'Fecha', ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--fmono)', fontSize: 12, color: '#ffd23f' }}>{o.orderNumber}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--fbody)', fontSize: 13 }}>{o.customer.name}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--fdisp2)', fontSize: 13 }}>{formatPrice(o.total)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 11, background: o.paymentStatus === 'paid' ? '#2a9d3f' : '#6b6557', color: '#fff', padding: '3px 8px', letterSpacing: '0.04em' }}>
                        {o.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 11, background: FULFILLMENT_COLORS[o.fulfillmentStatus] ?? '#333', color: '#fff', padding: '3px 8px', letterSpacing: '0.04em' }}>
                        {o.fulfillmentStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>
                      {new Date(o.createdAt).toLocaleDateString('es-HN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <a href={`/admin/orders?id=${o._id}`} style={{ fontFamily: 'var(--fdisp2)', fontSize: 11, color: '#ffd23f', letterSpacing: '0.04em', textDecoration: 'none' }}>
                        VER →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
