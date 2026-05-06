'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['shirts', 'mugs', '3d', 'packs'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const TAGS_OPTIONS = ['hit', 'new', 'set', 'drop'];

interface VariantForm {
  size: string;
  color: string;
  stock: number;
}

interface ProductFormData {
  slug: string;
  sku: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  category: string;
  price: string;
  compareAtPrice: string;
  images: string;
  tags: string[];
  active: boolean;
  customizable: boolean;
  variants: VariantForm[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ProductFormData>({
    slug: initial?.slug ?? '',
    sku: initial?.sku ?? '',
    nameEs: initial?.name?.es ?? '',
    nameEn: initial?.name?.en ?? '',
    descEs: initial?.description?.es ?? '',
    descEn: initial?.description?.en ?? '',
    category: initial?.category ?? 'shirts',
    price: initial?.price?.toString() ?? '',
    compareAtPrice: initial?.compareAtPrice?.toString() ?? '',
    images: initial?.images?.join('\n') ?? '',
    tags: initial?.tags ?? [],
    active: initial?.active ?? true,
    customizable: initial?.customizable ?? true,
    variants: initial?.variants?.length
      ? initial.variants.map((v: VariantForm) => ({ size: v.size ?? '', color: v.color ?? '', stock: v.stock }))
      : [{ size: 'M', color: '', stock: 10 }],
  });

  const set = (k: keyof ProductFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function toggleTag(tag: string) {
    set('tags', form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag]);
  }

  function addVariant() {
    set('variants', [...form.variants, { size: '', color: '', stock: 0 }]);
  }
  function removeVariant(i: number) {
    set('variants', form.variants.filter((_, idx) => idx !== i));
  }
  function updateVariant(i: number, k: keyof VariantForm, v: string | number) {
    set('variants', form.variants.map((v2, idx) => (idx === i ? { ...v2, [k]: v } : v2)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        slug: form.slug.trim().toLowerCase(),
        sku: form.sku.trim().toUpperCase(),
        name: { es: form.nameEs, en: form.nameEn },
        description: { es: form.descEs, en: form.descEn },
        category: form.category,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        images: form.images.split('\n').map((u) => u.trim()).filter(Boolean),
        tags: form.tags,
        active: form.active,
        customizable: form.customizable,
        variants: form.variants.map((v) => ({
          size: v.size || undefined,
          color: v.color || undefined,
          stock: Number(v.stock),
        })),
      };

      const url = initial ? `/api/products/${initial._id}` : '/api/products';
      const method = initial ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data.error));
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#0f0f0f', color: '#eee5d3',
    border: '1px solid #333', fontFamily: 'var(--fmono)', fontSize: 13, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--fmono)', fontSize: 11, color: '#6b6557',
    letterSpacing: '0.08em', marginBottom: 6,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>SLUG *</label>
          <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>SKU *</label>
          <input style={inputStyle} value={form.sku} onChange={(e) => set('sku', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>NOMBRE ES *</label>
          <input style={inputStyle} value={form.nameEs} onChange={(e) => set('nameEs', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>NOMBRE EN *</label>
          <input style={inputStyle} value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} required />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>DESCRIPCIÓN ES *</label>
          <textarea style={{ ...inputStyle, height: 70, resize: 'vertical' }} value={form.descEs} onChange={(e) => set('descEs', e.target.value)} required />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>DESCRIPCIÓN EN *</label>
          <textarea style={{ ...inputStyle, height: 70, resize: 'vertical' }} value={form.descEn} onChange={(e) => set('descEn', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>CATEGORÍA</label>
          <select style={{ ...inputStyle, appearance: 'none' }} value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>PRECIO (HNL) *</label>
          <input type="number" step="1" style={inputStyle} value={form.price} onChange={(e) => set('price', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>PRECIO TACHADO</label>
          <input type="number" step="1" style={inputStyle} value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>IMÁGENES (una URL por línea)</label>
          <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.images} onChange={(e) => set('images', e.target.value)} placeholder="https://res.cloudinary.com/..." />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}>TAGS</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {TAGS_OPTIONS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => toggleTag(t)}
              style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, padding: '6px 14px', border: '1.5px solid #333', background: form.tags.includes(t) ? '#ffd23f' : 'transparent', color: form.tags.includes(t) ? '#0f0f0f' : '#6b6557', cursor: 'pointer', letterSpacing: '0.06em' }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: 'flex', gap: 24 }}>
        {([['active', 'ACTIVO'], ['customizable', 'PERSONALIZABLE']] as const).map(([k, l]) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--fmono)', fontSize: 12, color: '#6b6557', cursor: 'pointer' }}>
            <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} style={{ accentColor: '#ffd23f' }} />
            {l}
          </label>
        ))}
      </div>

      {/* Variants */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <label style={labelStyle}>VARIANTES (TALLA / COLOR / STOCK)</label>
          <button type="button" onClick={addVariant} style={{ fontFamily: 'var(--fdisp2)', fontSize: 11, color: '#ffd23f', border: '1px solid #ffd23f', padding: '4px 10px', background: 'transparent', cursor: 'pointer' }}>+ AGREGAR</button>
        </div>
        {form.variants.map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 40px', gap: 8, marginBottom: 8 }}>
            <select style={{ ...inputStyle, appearance: 'none' }} value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)}>
              <option value="">Sin talla</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input style={inputStyle} placeholder="Color (ej: Negro)" value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} />
            <input type="number" min="0" style={inputStyle} value={v.stock} onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)} />
            <button type="button" onClick={() => removeVariant(i)} style={{ background: 'none', border: '1px solid #e63946', color: '#e63946', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        ))}
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: '#e63946', border: '1px solid #e63946', padding: '10px 14px' }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? '#333' : '#ffd23f', color: '#0f0f0f', border: '2px solid #ffd23f', padding: '12px 28px', fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.06em', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '4px 4px 0 #e63946' }}
        >
          {loading ? 'GUARDANDO...' : initial ? 'ACTUALIZAR' : 'CREAR PRODUCTO'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: 'transparent', color: '#6b6557', border: '1px solid #333', padding: '12px 20px', fontFamily: 'var(--fdisp2)', fontSize: 14, cursor: 'pointer' }}
        >
          CANCELAR
        </button>
      </div>
    </form>
  );
}
