'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ProductCard } from '@/components/shop/ProductCard';
import { Sticker } from '@/components/ui/Sticker';
import { IconStar, IconWA, IconCart } from '@/components/ui/Icons';
import { waUrl } from '@/lib/wa';
import { formatPrice } from '@/lib/shipping';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

const TAG_COLORS: Record<string, string> = { hit: 'var(--red)', new: 'var(--yellow)', set: 'var(--blue)', drop: 'var(--orange)' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductDetailClient({ product, related }: { product: any; related: any[] }) {
  const { add } = useCartStore();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.category === 'shirts' ? 'M' : null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  const availableVariants = product.variants as Array<{ size?: string; color?: string; stock: number }>;
  const stockForSize = (size: string) =>
    availableVariants.find((v) => v.size === size)?.stock ?? 0;

  const hasShirtSizes = product.category === 'shirts' && availableVariants.some((v) => v.size);
  const inStock = hasShirtSizes
    ? selectedSize ? stockForSize(selectedSize) > 0 : false
    : availableVariants.reduce((sum, v) => sum + v.stock, 0) > 0;

  function handleAddToCart() {
    add({
      productId: product._id,
      slug: product.slug,
      sku: product.sku,
      name: product.name.es,
      price: product.price,
      quantity: qty,
      image: product.images[0] ?? '',
      variant: { size: selectedSize ?? undefined },
      customDesignNotes: notes || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waMsg = `¡Yo! Quiero la ${product.name.es} (${formatPrice(product.price)}, ${product.sku})${selectedSize ? ` talla ${selectedSize}` : ''}. ¿Me ayudás?`;

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: 'var(--muted)', marginBottom: 32, letterSpacing: '0.06em' }}>
          <Link href="/" style={{ color: 'inherit' }}>INICIO</Link>
          {' / '}
          <Link href="/catalog" style={{ color: 'inherit' }}>CATÁLOGO</Link>
          {' / '}
          <span style={{ color: 'var(--ink)' }}>{product.name.es.toUpperCase()}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start', marginBottom: 80 }}>
          {/* Gallery */}
          <div>
            <div style={{ background: 'var(--paper)', border: '3px solid var(--ink)', boxShadow: '8px 8px 0 var(--ink)', position: 'relative', aspectRatio: '1/1', overflow: 'hidden', marginBottom: 12 }}>
              {product.images[activeImg] ? (
                <Image src={product.images[activeImg]} alt={product.name.es} fill style={{ objectFit: 'cover', mixBlendMode: 'multiply' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--fdisp)', fontSize: 64, color: 'var(--muted)', opacity: 0.3 }}>CREART</span>
                </div>
              )}
              {product.tags[0] && (
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <Sticker color={TAG_COLORS[product.tags[0]] ?? 'var(--yellow)'} rotate="-4deg" size={13}>
                    {product.tags[0].toUpperCase()}
                  </Sticker>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: 'var(--fmono)', fontSize: 10, background: 'var(--ink)', color: 'var(--bg)', padding: '2px 6px' }}>
                {product.sku}
              </div>
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{ width: 72, height: 72, border: `2px solid ${activeImg === i ? 'var(--ink)' : 'var(--muted)'}`, padding: 0, background: 'var(--paper)', position: 'relative', overflow: 'hidden', boxShadow: activeImg === i ? '2px 2px 0 var(--ink)' : 'none' }}
                  >
                    <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          <div>
            <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 12 }}>
              {product.name.es}
            </h1>
            <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((i) => <IconStar key={i} size={14} />)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--fdisp)', fontSize: 42, color: 'var(--red)' }}>{formatPrice(product.price)}</div>
              {product.compareAtPrice && (
                <div style={{ fontFamily: 'var(--fdisp2)', fontSize: 20, color: 'var(--muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.compareAtPrice)}
                </div>
              )}
            </div>

            <p style={{ fontSize: 15, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 28, maxWidth: 460 }}>
              {product.description.es}
            </p>

            {/* Size selector */}
            {hasShirtSizes && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, letterSpacing: '0.06em', marginBottom: 10 }}>TALLA</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SIZES.map((size) => {
                    const stock = stockForSize(size);
                    const isSelected = selectedSize === size;
                    const available = stock > 0;
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        style={{
                          width: 50, height: 50,
                          border: `2px solid ${isSelected ? 'var(--ink)' : available ? 'var(--ink)' : 'var(--muted)'}`,
                          background: isSelected ? 'var(--ink)' : 'var(--bg)',
                          color: isSelected ? 'var(--yellow)' : available ? 'var(--ink)' : 'var(--muted)',
                          fontFamily: 'var(--fdisp2)', fontSize: 13,
                          boxShadow: isSelected ? '3px 3px 0 var(--red)' : 'none',
                          cursor: available ? 'pointer' : 'not-allowed',
                          transition: 'all 0.15s',
                          textDecoration: !available ? 'line-through' : 'none',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, letterSpacing: '0.06em', marginBottom: 10 }}>CANTIDAD</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '2px solid var(--ink)', width: 'fit-content' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, background: 'var(--bg)', fontFamily: 'var(--fdisp2)', fontSize: 20, borderRight: '1px solid var(--ink)' }}>−</button>
                <span style={{ width: 52, textAlign: 'center', fontFamily: 'var(--fmono)', fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 44, background: 'var(--bg)', fontFamily: 'var(--fdisp2)', fontSize: 20, borderLeft: '1px solid var(--ink)' }}>+</button>
              </div>
            </div>

            {/* Custom design notes */}
            {product.customizable && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, letterSpacing: '0.06em', marginBottom: 10 }}>NOTAS PARA EL DISEÑO CUSTOM (opcional)</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Con mi nombre 'JUAN', colores rojo y negro, sin fondo..."
                  style={{ width: '100%', maxWidth: 400, padding: '10px 14px', border: '2px solid var(--ink)', background: 'var(--bg)', fontFamily: 'var(--fbody)', fontSize: 13, height: 80, resize: 'vertical', boxShadow: '2px 2px 0 var(--ink)', outline: 'none' }}
                />
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                disabled={!inStock || (hasShirtSizes && !selectedSize)}
                style={{
                  flex: 1, minWidth: 200,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: added ? 'var(--green)' : inStock ? 'var(--ink)' : 'var(--muted)',
                  color: 'var(--bg)',
                  border: '3px solid var(--ink)',
                  padding: '16px 24px',
                  fontFamily: 'var(--fdisp)', fontSize: 20,
                  boxShadow: inStock ? '5px 5px 0 var(--red)' : 'none',
                  cursor: inStock ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}
              >
                <IconCart size={20} />
                {added ? '¡AGREGADO!' : inStock ? 'AGREGAR' : 'SIN STOCK'}
              </button>

              <a
                href={waUrl(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: 'var(--yellow)', color: 'var(--ink)',
                  border: '3px solid var(--ink)', padding: '16px 20px',
                  fontFamily: 'var(--fdisp)', fontSize: 18,
                  boxShadow: '5px 5px 0 var(--ink)',
                  transition: 'all 0.15s', textDecoration: 'none',
                }}
              >
                <IconWA size={18} /> WA
              </a>
            </div>

            {inStock && (
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--green)', marginTop: 10 }}>✓ En stock</p>
            )}

            {/* Category badge */}
            <div style={{ marginTop: 28, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>CATEGORÍA:</span>
              <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, background: 'var(--ink)', color: 'var(--bg)', padding: '3px 8px', letterSpacing: '0.04em' }}>
                {product.category.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div style={{ borderTop: '3px solid var(--ink)', paddingTop: 48, marginBottom: 32 }}>
              <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, color: 'var(--red)', marginBottom: 6, letterSpacing: '0.1em' }}>/ TAMBIÉN TE PUEDE GUSTAR</div>
              <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 0.9, textTransform: 'uppercase' }}>
                MÁS DROPS
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 28, paddingBottom: 60 }}>
              {related.map((p, i) => <ProductCard key={p._id} product={p} idx={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
