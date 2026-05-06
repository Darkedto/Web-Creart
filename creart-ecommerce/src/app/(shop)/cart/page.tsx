'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { IconTrash } from '@/components/ui/Icons';
import { formatPrice } from '@/lib/shipping';
import { Marquee } from '@/components/ui/Marquee';

export default function CartPage() {
  const { items, remove, update, subtotal, clear } = useCartStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Marquee text="CARRITO · CUSTOM DROPS · DTF · SUBLIMACIÓN · " />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, color: 'var(--red)', letterSpacing: '0.1em', marginBottom: 6 }}>/ CARRITO</div>
            <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(48px, 8vw, 80px)', lineHeight: 0.9, textTransform: 'uppercase' }}>
              TU ORDEN
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: 'var(--red)', letterSpacing: '0.06em', borderBottom: '1px solid var(--red)', paddingBottom: 2 }}
            >
              VACIAR CARRITO
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '3px dashed var(--muted)' }}>
            <p style={{ fontFamily: 'var(--fdisp)', fontSize: 36, color: 'var(--muted)', marginBottom: 12 }}>VACÍO</p>
            <p style={{ fontFamily: 'var(--fmono)', fontSize: 13, color: 'var(--muted)', marginBottom: 32 }}>
              Todavía no agregaste nada. ¿Qué esperás?
            </p>
            <Link href="/catalog" style={{ background: 'var(--ink)', color: 'var(--yellow)', padding: '14px 28px', fontFamily: 'var(--fdisp)', fontSize: 20, border: '3px solid var(--ink)', boxShadow: '5px 5px 0 var(--red)', textDecoration: 'none' }}>
              VER CATÁLOGO
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
            {/* Item list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item, i) => (
                <div key={i} style={{ background: 'var(--paper)', border: '3px solid var(--ink)', boxShadow: '5px 5px 0 var(--ink)', padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 96, height: 96, border: '2px solid var(--ink)', flexShrink: 0, position: 'relative', background: 'var(--bg)' }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--muted)', opacity: 0.15 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link href={`/product/${item.slug}`}>
                      <h3 style={{ fontFamily: 'var(--fdisp)', fontSize: 22, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.01em', marginBottom: 6 }}>
                        {item.name}
                      </h3>
                    </Link>
                    <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>SKU: {item.sku}</p>
                    {item.variant.size && <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)' }}>Talla: {item.variant.size}</p>}
                    {item.customDesignNotes && <p style={{ fontSize: 12, color: 'var(--ink2)', marginTop: 6, fontStyle: 'italic' }}>&ldquo;{item.customDesignNotes}&rdquo;</p>}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--ink)' }}>
                        <button onClick={() => update(item.productId, item.variant, item.quantity - 1)} style={{ width: 40, height: 40, background: 'var(--bg)', fontFamily: 'var(--fdisp2)', fontSize: 18, borderRight: '1px solid var(--ink)' }}>−</button>
                        <span style={{ width: 44, textAlign: 'center', fontFamily: 'var(--fmono)', fontSize: 14 }}>{item.quantity}</span>
                        <button onClick={() => update(item.productId, item.variant, item.quantity + 1)} style={{ width: 40, height: 40, background: 'var(--bg)', fontFamily: 'var(--fdisp2)', fontSize: 18, borderLeft: '1px solid var(--ink)' }}>+</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontFamily: 'var(--fdisp)', fontSize: 22 }}>{formatPrice(item.price * item.quantity)}</span>
                        <button onClick={() => remove(item.productId, item.variant)} style={{ color: 'var(--red)', padding: 4 }}>
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--paper)', border: '3px solid var(--ink)', boxShadow: '8px 8px 0 var(--ink)', padding: 28, position: 'sticky', top: 90 }}>
              <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 26, marginBottom: 20, letterSpacing: '0.01em' }}>RESUMEN</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--fmono)', fontSize: 13 }}>SUBTOTAL</span>
                <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 16 }}>{formatPrice(subtotal())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 20, borderBottom: '2px solid var(--ink)' }}>
                <span style={{ fontFamily: 'var(--fmono)', fontSize: 13, color: 'var(--muted)' }}>ENVÍO</span>
                <span style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: 'var(--muted)' }}>Calculado al checkout</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--fdisp)', fontSize: 20 }}>TOTAL</span>
                <span style={{ fontFamily: 'var(--fdisp)', fontSize: 28, color: 'var(--red)' }}>{formatPrice(subtotal())}</span>
              </div>
              <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)', color: 'var(--yellow)', padding: '18px 24px', fontFamily: 'var(--fdisp)', fontSize: 22, letterSpacing: '0.04em', border: '3px solid var(--ink)', boxShadow: '5px 5px 0 var(--red)', textDecoration: 'none' }}>
                PAGAR AHORA
              </Link>
              <p style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)' }}>
                Envío gratis en pedidos &gt; L. 1,500
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
