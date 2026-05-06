'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/shop/ProductCard';
import { Marquee } from '@/components/ui/Marquee';
import { Sticker } from '@/components/ui/Sticker';

const CATS = [
  { k: 'all', label: 'TODO' },
  { k: 'shirts', label: 'CAMISAS' },
  { k: 'mugs', label: 'TAZAS' },
  { k: '3d', label: '3D' },
  { k: 'packs', label: 'PACKS' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CatalogClient({ products, initialCategory, initialSearch }: { products: any[]; initialCategory: string; initialSearch: string }) {
  const router = useRouter();
  const [cat, setCat] = useState(initialCategory);
  const [q, setQ] = useState(initialSearch);

  const filtered = useMemo(() => {
    let list = products;
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (q) {
      const lq = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.es.toLowerCase().includes(lq) ||
          p.name.en.toLowerCase().includes(lq) ||
          p.sku.toLowerCase().includes(lq)
      );
    }
    return list;
  }, [products, cat, q]);

  function applyFilter(newCat: string) {
    setCat(newCat);
    const params = new URLSearchParams();
    if (newCat !== 'all') params.set('category', newCat);
    if (q) params.set('q', q);
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Marquee text="CUSTOM DROPS · DTF · SUBLIMACIÓN · IMPRESIÓN 3D · MADE IN HONDURAS · " />

      <section style={{ padding: '60px 24px', background: 'var(--paper)', minHeight: 'calc(100vh - 52px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, fontWeight: 700, color: 'var(--red)', marginBottom: 6, letterSpacing: '0.1em' }}>/ DROPS</div>
              <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                CATÁLOGO
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 540, marginTop: 12 }}>
                Camisas, tazas y figuras 3D. Todos personalizables. Mandá tu diseño o nosotros lo creamos.
              </p>
            </div>
            <Sticker color="var(--yellow)" rotate="-5deg" size={14} style={{ padding: '8px 14px' }}>
              {filtered.length} PIEZAS
            </Sticker>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="search"
              placeholder="Buscar producto, SKU..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: '100%', maxWidth: 400, padding: '10px 16px', border: '2px solid var(--ink)', background: 'var(--bg)', fontFamily: 'var(--fbody)', fontSize: 14, boxShadow: '3px 3px 0 var(--ink)', outline: 'none' }}
            />
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {CATS.map((f) => (
              <button
                key={f.k}
                onClick={() => applyFilter(f.k)}
                style={{
                  fontFamily: 'var(--fdisp2)', fontSize: 13, letterSpacing: '0.06em',
                  padding: '8px 16px', cursor: 'pointer',
                  background: cat === f.k ? 'var(--ink)' : 'transparent',
                  color: cat === f.k ? 'var(--yellow)' : 'var(--ink)',
                  border: '2.5px solid var(--ink)',
                  boxShadow: cat === f.k ? '3px 3px 0 var(--red)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'var(--fdisp)', fontSize: 32, color: 'var(--muted)' }}>SIN RESULTADOS</p>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>Probá con otro filtro o buscá algo diferente</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32, paddingTop: 18, paddingBottom: 18 }}>
              {filtered.map((p, i) => (
                <ProductCard key={p._id} product={p} idx={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
