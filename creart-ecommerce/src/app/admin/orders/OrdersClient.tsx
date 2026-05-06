'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { waUrl, orderWhatsappMessage } from '@/lib/wa';
import { formatPrice } from '@/lib/shipping';
import { IconWA } from '@/components/ui/Icons';

const FULFILLMENT_OPTIONS = ['pending', 'in_production', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['pending', 'paid', 'failed', 'refunded'];

const FULFILLMENT_COLORS: Record<string, string> = {
  pending: '#f77f00',
  in_production: '#1d4e89',
  shipped: '#7c3aed',
  delivered: '#2a9d3f',
  cancelled: '#e63946',
};

const FULFILLMENT_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  in_production: 'En producción',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OrdersClient({ orders }: { orders: any[] }) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState(false);

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.fulfillmentStatus === filterStatus);

  async function updateOrder(id: string, data: Record<string, string>) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.refresh();
        if (selected?._id === id) {
          const updated = await res.json();
          setSelected(updated.order);
        }
      }
    } finally {
      setUpdating(false);
    }
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--fmono)',
    fontSize: 11,
    color: '#6b6557',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#6b6557', letterSpacing: '0.1em', marginBottom: 6 }}>/ ADMIN</div>
        <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 48, color: '#ffd23f', lineHeight: 0.9 }}>ÓRDENES</h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...FULFILLMENT_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              fontFamily: 'var(--fdisp2)',
              fontSize: 12,
              letterSpacing: '0.06em',
              padding: '6px 14px',
              background: filterStatus === s ? '#ffd23f' : 'transparent',
              color: filterStatus === s ? '#0f0f0f' : '#6b6557',
              border: `1.5px solid ${filterStatus === s ? '#ffd23f' : '#333'}`,
              cursor: 'pointer',
            }}
          >
            {s === 'all' ? 'TODAS' : FULFILLMENT_LABELS[s]?.toUpperCase() ?? s.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 24 }}>
        {/* Table */}
        <div style={{ background: '#1a1a1a', border: '2px solid #333', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ffd23f' }}>
                {['Número', 'Cliente', 'Total', 'Método', 'Pago', 'Estado', 'Fecha'].map((h) => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o._id}
                  onClick={() => setSelected(selected?._id === o._id ? null : o)}
                  style={{ borderBottom: '1px solid #222', cursor: 'pointer', background: selected?._id === o._id ? '#1f1f1f' : 'transparent', transition: 'background 0.15s' }}
                >
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fmono)', fontSize: 12, color: '#ffd23f' }}>{o.orderNumber}</td>
                  <td style={{ padding: '11px 14px', fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.customer.name}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fdisp2)', fontSize: 13 }}>{formatPrice(o.total)}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>{o.paymentMethod.toUpperCase()}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ background: o.paymentStatus === 'paid' ? '#2a9d3f' : '#6b6557', color: '#fff', fontFamily: 'var(--fdisp2)', fontSize: 10, padding: '2px 6px', letterSpacing: '0.04em' }}>
                      {o.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ background: FULFILLMENT_COLORS[o.fulfillmentStatus] ?? '#333', color: '#fff', fontFamily: 'var(--fdisp2)', fontSize: 10, padding: '2px 6px', letterSpacing: '0.04em' }}>
                      {FULFILLMENT_LABELS[o.fulfillmentStatus]?.toUpperCase() ?? o.fulfillmentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>
                    {new Date(o.createdAt).toLocaleDateString('es-HN')}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--fmono)', fontSize: 13, color: '#6b6557' }}>Sin órdenes</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: '#1a1a1a', border: '2px solid #ffd23f', padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 160px)', alignSelf: 'start', position: 'sticky', top: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#ffd23f', letterSpacing: '0.06em' }}>{selected.orderNumber}</span>
              <button onClick={() => setSelected(null)} style={{ color: '#6b6557', fontFamily: 'var(--fmono)', fontSize: 12 }}>✕</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>CLIENTE</label>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 14 }}>{selected.customer.name}</p>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>{selected.customer.email}</p>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>{selected.customer.phone}</p>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557', marginTop: 4 }}>
                {selected.customer.address.street}, {selected.customer.address.city}, {selected.customer.address.department}
              </p>
            </div>

            <div style={{ marginBottom: 20, borderTop: '1px solid #333', paddingTop: 16 }}>
              <label style={labelStyle}>PRODUCTOS</label>
              {selected.items.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12 }}>{item.name}</p>
                    <p style={{ fontFamily: 'var(--fmono)', fontSize: 10, color: '#6b6557' }}>{item.quantity}x · {item.sku}{item.variant?.size ? ` · ${item.variant.size}` : ''}</p>
                  </div>
                  <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12 }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #333', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>TOTAL</span>
                <span style={{ fontFamily: 'var(--fdisp)', fontSize: 18, color: '#ffd23f' }}>{formatPrice(selected.total)}</span>
              </div>
            </div>

            {/* Status controls */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>ESTADO DE FULFILLMENT</label>
              <select
                value={selected.fulfillmentStatus}
                onChange={(e) => updateOrder(selected._id, { fulfillmentStatus: e.target.value })}
                disabled={updating}
                style={{ width: '100%', padding: '8px 12px', background: '#0f0f0f', color: '#eee5d3', border: '1px solid #ffd23f', fontFamily: 'var(--fmono)', fontSize: 12 }}
              >
                {FULFILLMENT_OPTIONS.map((s) => <option key={s} value={s}>{FULFILLMENT_LABELS[s]?.toUpperCase()}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>ESTADO DE PAGO</label>
              <select
                value={selected.paymentStatus}
                onChange={(e) => updateOrder(selected._id, { paymentStatus: e.target.value })}
                disabled={updating}
                style={{ width: '100%', padding: '8px 12px', background: '#0f0f0f', color: '#eee5d3', border: '1px solid #ffd23f', fontFamily: 'var(--fmono)', fontSize: 12 }}
              >
                {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </div>

            <a
              href={waUrl(orderWhatsappMessage({
                orderNumber: selected.orderNumber,
                customer: { name: selected.customer.name, address: selected.customer.address },
                items: selected.items.map((i: any) => ({ quantity: i.quantity, name: i.name, variant: i.variant, price: i.price })),
                total: selected.total,
                paymentMethod: selected.paymentMethod,
              }))}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#ffd23f', color: '#0f0f0f', padding: '12px 16px', fontFamily: 'var(--fdisp2)', fontSize: 13, letterSpacing: '0.06em', border: '2px solid #ffd23f', textDecoration: 'none', boxShadow: '3px 3px 0 #e63946' }}
            >
              <IconWA size={14} /> ABRIR WHATSAPP
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
