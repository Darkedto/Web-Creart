'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { IconWA, IconCart, IconMenu, IconClose } from '@/components/ui/Icons';
import { waUrl } from '@/lib/wa';

const NAV_LINKS = [
  { href: '/', label: 'Inicio', labelEn: 'Home' },
  { href: '/catalog', label: 'Catálogo', labelEn: 'Catalog' },
  { href: '/#process', label: 'Proceso', labelEn: 'Process' },
  { href: '/#crew', label: 'Crew', labelEn: 'Crew' },
  { href: '/#contact', label: 'Contacto', labelEn: 'Contact' },
];

interface NavBarProps {
  lang?: 'es' | 'en';
  onLangToggle?: () => void;
}

export function NavBar({ lang = 'es', onLangToggle }: NavBarProps) {
  const count = useCartStore((s) => s.count());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: 'var(--ink)',
        borderBottom: '3px solid var(--ink)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            background: 'var(--yellow)',
            padding: '4px 6px',
            border: '2px solid var(--bg)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image
            src="/assets/logo.png"
            alt="Creart"
            width={24}
            height={24}
            style={{ height: 24, width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <span
          style={{
            fontFamily: 'var(--fdisp)',
            fontSize: 22,
            color: 'var(--bg)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          CREART
        </span>
      </Link>

      {/* Desktop links */}
      <div
        className="hidden md:flex"
        style={{ gap: 2, marginLeft: 'auto', alignItems: 'center' }}
      >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              fontFamily: 'var(--fdisp2)',
              fontSize: 12,
              padding: '8px 12px',
              letterSpacing: '0.08em',
              color: 'var(--bg)',
            }}
            className="hover:text-yellow transition-colors"
          >
            {lang === 'es' ? l.label.toUpperCase() : l.labelEn.toUpperCase()}
          </Link>
        ))}

        {onLangToggle && (
          <button
            onClick={onLangToggle}
            style={{
              marginLeft: 6,
              background: 'var(--bg)',
              color: 'var(--ink)',
              border: '2px solid var(--bg)',
              padding: '4px 10px',
              fontFamily: 'var(--fdisp2)',
              fontSize: 11,
              letterSpacing: '0.05em',
            }}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        )}

        {/* Cart */}
        <Link
          href="/cart"
          style={{
            marginLeft: 6,
            background: 'transparent',
            color: 'var(--bg)',
            border: '2px solid var(--bg)',
            padding: '7px 14px',
            fontFamily: 'var(--fdisp2)',
            fontSize: 12,
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            position: 'relative',
          }}
        >
          <IconCart size={16} />
          {count > 0 && (
            <span
              style={{
                background: 'var(--red)',
                color: 'var(--bg)',
                borderRadius: 0,
                fontSize: 10,
                fontFamily: 'var(--fdisp2)',
                padding: '1px 5px',
                border: '1px solid var(--bg)',
              }}
            >
              {count}
            </span>
          )}
        </Link>

        {/* WhatsApp CTA */}
        <a
          href={waUrl()}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: 6,
            background: 'var(--yellow)',
            color: 'var(--ink)',
            border: '2px solid var(--bg)',
            padding: '7px 14px',
            fontFamily: 'var(--fdisp2)',
            fontSize: 12,
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '2px 2px 0 var(--bg)',
          }}
        >
          <IconWA size={13} />
          PEDIDOS
        </a>
      </div>

      {/* Mobile: cart + hamburger */}
      <div className="flex md:hidden" style={{ marginLeft: 'auto', gap: 8, alignItems: 'center' }}>
        <Link href="/cart" style={{ color: 'var(--bg)', position: 'relative', padding: 4 }}>
          <IconCart size={20} />
          {count > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                background: 'var(--red)',
                color: 'var(--bg)',
                fontSize: 9,
                fontFamily: 'var(--fdisp2)',
                padding: '0 4px',
                border: '1px solid var(--bg)',
              }}
            >
              {count}
            </span>
          )}
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          style={{ color: 'var(--bg)', padding: 4 }}
        >
          {mobileOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 55,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--ink)',
            zIndex: 199,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--fdisp)',
                fontSize: 36,
                color: 'var(--bg)',
                letterSpacing: '0.02em',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {lang === 'es' ? l.label.toUpperCase() : l.labelEn.toUpperCase()}
            </Link>
          ))}
          <a
            href={waUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: 24,
              background: 'var(--yellow)',
              color: 'var(--ink)',
              border: '3px solid var(--bg)',
              padding: '16px 24px',
              fontFamily: 'var(--fdisp2)',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '4px 4px 0 var(--bg)',
            }}
          >
            <IconWA size={18} /> PEDIDO POR WHATSAPP
          </a>
        </div>
      )}
    </nav>
  );
}
