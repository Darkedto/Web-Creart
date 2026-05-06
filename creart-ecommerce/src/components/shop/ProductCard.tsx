'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/models/Product';
import { Sticker } from '@/components/ui/Sticker';
import { TapeStrip } from '@/components/ui/TapeStrip';
import { IconStar, IconMug, Icon3D, IconBox, IconWA } from '@/components/ui/Icons';
import { waUrl } from '@/lib/wa';
import { formatPrice } from '@/lib/shipping';

type Lang = 'es' | 'en';

interface ProductCardProps {
  product: {
    _id: string;
    slug: string;
    sku: string;
    name: { es: string; en: string };
    description: { es: string; en: string };
    category: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    tags: string[];
    customizable: boolean;
    variants: Array<{ size?: string; color?: string; stock: number }>;
  };
  lang?: Lang;
  idx?: number;
}

const TAG_COLORS: Record<string, string> = {
  hit: 'var(--red)',
  new: 'var(--yellow)',
  set: 'var(--blue)',
  drop: 'var(--orange)',
};

const TAG_LABELS: Record<string, Record<Lang, string>> = {
  hit: { es: 'HIT', en: 'HIT' },
  new: { es: 'NEW', en: 'NEW' },
  set: { es: 'SET', en: 'SET' },
  drop: { es: 'DROP', en: 'DROP' },
};

const TILTS = [-1, 1, -0.5, 1.5, -1.2, 0.8, 1, -1.4];

export function ProductCard({ product, lang = 'es', idx = 0 }: ProductCardProps) {
  const [hov, setHov] = useState(false);
  const tilt = TILTS[idx % TILTS.length];

  const name = product.name[lang];
  const desc = product.description[lang];
  const tag = product.tags[0];

  const waMsg =
    lang === 'es'
      ? `¡Yo! Quiero la ${name} (${formatPrice(product.price)}, ${product.sku}). ¿Me ayudás?`
      : `Yo! I want the ${name} (${formatPrice(product.price)}, ${product.sku}). Can you help?`;

  const CategoryIcon = () => {
    if (product.category === 'mugs') return <IconMug size={60} color="var(--bg)" />;
    if (product.category === '3d') return <Icon3D size={60} color="var(--bg)" />;
    return <IconBox size={60} color="var(--bg)" />;
  };

  const hasImage = product.images.length > 0 && product.images[0];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--paper)',
        border: '3px solid var(--ink)',
        boxShadow: hov ? '8px 8px 0 var(--ink)' : '5px 5px 0 var(--ink)',
        transform: hov
          ? `rotate(${tilt}deg) translate(-2px,-2px)`
          : `rotate(${tilt}deg)`,
        transition: 'all 0.18s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tape strip */}
      <TapeStrip color="var(--yellow)" width={70} rotate="-8deg" style={{ top: -9, left: 14, opacity: 0.9 }} />

      {/* Tag badge */}
      {tag && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            right: -10,
            zIndex: 5,
            animation: 'stamp 0.5s ease both',
            animationDelay: `${idx * 0.05}s`,
          }}
        >
          <Sticker color={TAG_COLORS[tag]} rotate="-8deg" size={13}>
            {TAG_LABELS[tag]?.[lang] ?? tag.toUpperCase()}
          </Sticker>
        </div>
      )}

      {/* Image / placeholder */}
      <Link href={`/product/${product.slug}`} style={{ display: 'block' }}>
        <div
          style={{
            background: 'var(--bg)',
            borderBottom: '3px solid var(--ink)',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={name}
              fill
              style={{
                objectFit: 'cover',
                mixBlendMode: 'multiply',
                filter: hov ? 'contrast(1.05)' : 'none',
                transition: 'filter 0.2s',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `repeating-linear-gradient(45deg, var(--bg) 0 18px, rgba(29,78,137,0.13) 18px 36px)`,
              }}
            >
              <div
                style={{
                  background: 'var(--blue)',
                  border: '3px solid var(--ink)',
                  padding: 24,
                  boxShadow: '4px 4px 0 var(--ink)',
                }}
              >
                <CategoryIcon />
              </div>
            </div>
          )}

          {/* SKU corner */}
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              left: 8,
              fontFamily: 'var(--fmono)',
              fontSize: 10,
              fontWeight: 700,
              background: 'var(--ink)',
              color: 'var(--bg)',
              padding: '2px 6px',
              letterSpacing: '0.05em',
            }}
          >
            {product.sku}
          </div>

          {product.compareAtPrice && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'var(--red)',
                color: 'var(--bg)',
                fontFamily: 'var(--fdisp2)',
                fontSize: 11,
                padding: '2px 6px',
                border: '1px solid var(--ink)',
              }}
            >
              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: '14px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
          <Link href={`/product/${product.slug}`}>
            <h3
              style={{
                fontFamily: 'var(--fdisp)',
                fontSize: 20,
                lineHeight: 1,
                fontWeight: 400,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                flex: 1,
              }}
            >
              {name}
            </h3>
          </Link>
          <div
            style={{
              background: 'var(--ink)',
              color: 'var(--yellow)',
              fontFamily: 'var(--fdisp2)',
              fontSize: 13,
              padding: '4px 8px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {formatPrice(product.price)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map((i) => <IconStar key={i} size={11} />)}
        </div>

        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14, flex: 1 }}>
          {desc}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href={`/product/${product.slug}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: hov ? 'var(--red)' : 'var(--ink)',
              color: 'var(--bg)',
              border: '2px solid var(--ink)',
              padding: '10px 14px',
              fontFamily: 'var(--fdisp2)',
              fontSize: 12,
              letterSpacing: '0.06em',
              transition: 'background 0.15s',
              textDecoration: 'none',
            }}
          >
            VER
          </Link>
          <a
            href={waUrl(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'transparent',
              color: 'var(--ink)',
              border: '2px solid var(--ink)',
              padding: '10px 10px',
              transition: 'background 0.15s',
            }}
            title="Pedir por WhatsApp"
          >
            <IconWA size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
