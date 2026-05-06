'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { IconClose, IconTrash } from '@/components/ui/Icons';
import { formatPrice } from '@/lib/shipping';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, update, subtotal } = useCartStore();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 300,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 440,
          background: 'var(--bg)',
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '3px solid var(--ink)',
          boxShadow: '-8px 0 0 var(--ink)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid var(--ink)',
          }}
        >
          <span style={{ fontFamily: 'var(--fdisp)', fontSize: 24, color: 'var(--bg)', letterSpacing: '0.02em' }}>
            CARRITO
          </span>
          <button
            onClick={onClose}
            style={{ color: 'var(--bg)', padding: 4 }}
          >
            <IconClose size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 16, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                TU CARRITO ESTÁ VACÍO
              </p>
              <Link
                href="/catalog"
                onClick={onClose}
                style={{
                  display: 'inline-block',
                  marginTop: 24,
                  background: 'var(--ink)',
                  color: 'var(--bg)',
                  padding: '12px 24px',
                  fontFamily: 'var(--fdisp2)',
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  border: '2px solid var(--ink)',
                  boxShadow: '4px 4px 0 var(--red)',
                }}
              >
                VER CATÁLOGO
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--paper)',
                    border: '2px solid var(--ink)',
                    boxShadow: '3px 3px 0 var(--ink)',
                    padding: 14,
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Thumb */}
                  <div style={{ width: 72, height: 72, border: '2px solid var(--ink)', flexShrink: 0, position: 'relative', background: 'var(--bg)' }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--muted)', opacity: 0.2 }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--fdisp)', fontSize: 16, lineHeight: 1, letterSpacing: '0.01em', marginBottom: 4 }}>
                      {item.name}
                    </p>
                    {item.variant.size && (
                      <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)' }}>
                        Talla: {item.variant.size}
                      </p>
                    )}
                    {item.variant.color && (
                      <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)' }}>
                        Color: {item.variant.color}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '2px solid var(--ink)' }}>
                        <button
                          onClick={() => update(item.productId, item.variant, item.quantity - 1)}
                          style={{
                            width: 32, height: 32,
                            background: 'var(--bg)',
                            fontFamily: 'var(--fdisp2)',
                            fontSize: 16,
                            borderRight: '1px solid var(--ink)',
                          }}
                        >−</button>
                        <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--fmono)', fontSize: 13 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => update(item.productId, item.variant, item.quantity + 1)}
                          style={{
                            width: 32, height: 32,
                            background: 'var(--bg)',
                            fontFamily: 'var(--fdisp2)',
                            fontSize: 16,
                            borderLeft: '1px solid var(--ink)',
                          }}
                        >+</button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 15 }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => remove(item.productId, item.variant)}
                          style={{ color: 'var(--red)', padding: 4 }}
                          title="Eliminar"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: 24,
              borderTop: '3px solid var(--ink)',
              background: 'var(--paper)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.04em' }}>SUBTOTAL</span>
              <span style={{ fontFamily: 'var(--fdisp)', fontSize: 22 }}>{formatPrice(subtotal())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--ink)',
                color: 'var(--yellow)',
                padding: '16px 24px',
                fontFamily: 'var(--fdisp)',
                fontSize: 20,
                letterSpacing: '0.04em',
                border: '3px solid var(--ink)',
                boxShadow: '5px 5px 0 var(--red)',
                textDecoration: 'none',
              }}
            >
              PAGAR AHORA
            </Link>
            <p style={{ textAlign: 'center', marginTop: 10, fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)' }}>
              + envío calculado en el checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
