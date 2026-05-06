'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/shipping';

const TAG_COLORS: Record<string, string> = { hit: '#e63946', new: '#ffd23f', set: '#1d4e89', drop: '#f77f00' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductsClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('¿Desactivar este producto?')) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setDeleting(null);
    router.refresh();
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#6b6557', letterSpacing: '0.1em', marginBottom: 6 }}>/ ADMIN</div>
          <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 48, color: '#ffd23f', lineHeight: 0.9 }}>PRODUCTOS</h1>
        </div>
        <Link
          href="/admin/products/new"
          style={{ background: '#ffd23f', color: '#0f0f0f', border: '2px solid #ffd23f', padding: '12px 24px', fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.06em', textDecoration: 'none', boxShadow: '4px 4px 0 #e63946' }}
        >
          + NUEVO PRODUCTO
        </Link>
      </div>

      <div style={{ background: '#1a1a1a', border: '2px solid #333', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ffd23f' }}>
              {['SKU', 'Nombre', 'Categoría', 'Precio', 'Tags', 'Stock', 'Activo', ''].map((h) => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557', letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.variants.reduce((s: number, v: { stock: number }) => s + v.stock, 0);
              return (
                <tr key={p._id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>{p.sku}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fdisp2)', fontSize: 13, maxWidth: 200 }}>{p.name.es}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557' }}>{p.category}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fdisp2)', fontSize: 13, color: '#ffd23f' }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.tags.map((t: string) => (
                        <span key={t} style={{ background: TAG_COLORS[t] ?? '#333', color: '#fff', fontFamily: 'var(--fdisp2)', fontSize: 10, padding: '2px 6px', letterSpacing: '0.04em' }}>
                          {t.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--fmono)', fontSize: 12, color: totalStock === 0 ? '#e63946' : '#2a9d3f' }}>{totalStock}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: p.active ? '#2a9d3f' : '#e63946' }}>
                      {p.active ? '✓' : '✗'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link href={`/admin/products/${p._id}/edit`} style={{ fontFamily: 'var(--fdisp2)', fontSize: 11, color: '#ffd23f', letterSpacing: '0.04em', textDecoration: 'none' }}>EDITAR</Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        style={{ fontFamily: 'var(--fdisp2)', fontSize: 11, color: '#e63946', letterSpacing: '0.04em', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {deleting === p._id ? '...' : 'DESACTIVAR'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--fmono)', fontSize: 13, color: '#6b6557' }}>Sin productos. Creá el primero.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
