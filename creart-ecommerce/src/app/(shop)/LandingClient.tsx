'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/shop/ProductCard';
import { Marquee } from '@/components/ui/Marquee';
import { Sticker } from '@/components/ui/Sticker';
import { TapeStrip } from '@/components/ui/TapeStrip';
import { IconWA, IconArrow } from '@/components/ui/Icons';
import { waUrl } from '@/lib/wa';

const MARQUEE_ES = 'CUSTOM DROPS · DTF · SUBLIMACIÓN · IMPRESIÓN 3D · MADE IN HONDURAS · NO LIMITS · SI LO PODÉS IMAGINAR LO PODEMOS CREAR · ';
const MARQUEE_EN = 'CUSTOM DROPS · DTF · SUBLIMATION · 3D PRINTING · MADE IN HONDURAS · NO LIMITS · IF YOU CAN IMAGINE IT WE CAN CREATE IT · ';

const STEPS_ES = [
  { n: '01', t: 'TIRÁ EL MENSAJE', d: 'WhatsApp directo. Sin formularios. Mandá tu idea, foto o referencia.' },
  { n: '02', t: 'TE PASAMOS PREVIEW', d: 'Diseño digital para aprobar antes de imprimir. Cero sorpresas.' },
  { n: '03', t: 'IMPRESIÓN EXPRESS', d: '24 a 48 horas. DTF, sublimación o 3D según el producto.' },
  { n: '04', t: 'A TU PUERTA', d: 'Envíos a todo Honduras. Recibís en casa o lo retirás en TGU.' },
];

const STEPS_EN = [
  { n: '01', t: 'DROP THE MESSAGE', d: 'Direct WhatsApp. No forms. Send your idea, photo or reference.' },
  { n: '02', t: 'WE SEND PREVIEW', d: 'Digital design to approve before printing. Zero surprises.' },
  { n: '03', t: 'EXPRESS PRINTING', d: '24 to 48 hours. DTF, sublimation or 3D depending on the product.' },
  { n: '04', t: 'TO YOUR DOOR', d: 'Shipping across Honduras. Get it at home or pick up in TGU.' },
];

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
}

export function LandingClient({ products }: Props) {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const steps = lang === 'es' ? STEPS_ES : STEPS_EN;

  return (
    <div>
      {/* ── HERO ── */}
      <section
        id="hero"
        style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 90, paddingBottom: 0, background: 'var(--bg)' }}
      >
        {/* Halftone corners */}
        <div style={{ position: 'absolute', top: 80, right: 0, width: 300, height: 300, opacity: 0.15, pointerEvents: 'none', background: 'radial-gradient(circle at center, var(--ink) 1.5px, transparent 2px) 0 0/14px 14px' }} />
        <div style={{ position: 'absolute', bottom: 60, left: 0, width: 240, height: 240, opacity: 0.2, pointerEvents: 'none', background: 'radial-gradient(circle at center, var(--red) 1.5px, transparent 2px) 0 0/14px 14px' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 32px', position: 'relative' }}>
          {/* Place badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, marginTop: 8 }}>
            <div style={{ fontFamily: 'var(--fmono)', fontSize: 11, fontWeight: 700, background: 'var(--ink)', color: 'var(--yellow)', padding: '5px 10px', letterSpacing: '0.12em' }}>
              TGU · HONDURAS · 504
            </div>
            <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
            <Sticker color="var(--red)" rotate="3deg" size={11}>EST. 2024</Sticker>
          </div>

          {/* Title */}
          <div style={{ position: 'relative', marginBottom: 30 }}>
            <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(72px, 14vw, 220px)', lineHeight: 0.85, letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--ink)', animation: 'slideUp 0.6s ease both' }}>
              CREART
              <br />
              <span style={{ color: 'var(--bg)', WebkitTextStroke: '3px var(--ink)', textShadow: '8px 8px 0 var(--red)' }}>
                {lang === 'es' ? 'PERSONALIZADOS' : 'PERSONALIZED'}
              </span>
            </h1>
            <div style={{ position: 'absolute', top: -20, right: '8%', zIndex: 3, animation: 'shake 3s ease-in-out infinite' }}>
              <div style={{ background: 'var(--yellow)', border: '3px solid var(--ink)', padding: '10px 14px', boxShadow: '4px 4px 0 var(--ink)', fontFamily: 'var(--fmark)', fontSize: 18, transform: 'rotate(-6deg)' }}>
                {lang === 'es' ? <>¡SI LO IMAGINÁS,<br />LO IMPRIMIMOS!</> : <>IF YOU CAN DREAM IT,<br />WE CAN PRINT IT!</>}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'center', marginBottom: 48 }}>
            <div>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 'clamp(18px, 2.2vw, 26px)', lineHeight: 1.2, marginBottom: 8 }}>
                {lang === 'es' ? 'Camisas DTF · Tazas · 3D printing.' : 'DTF Shirts · Mugs · 3D printing.'}
              </p>
              <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, lineHeight: 1.5 }}>
                {lang === 'es' ? 'Tu diseño, tu cultura, tu estilo. Nosotros lo imprimimos.' : 'Your design, your culture, your style. We print it.'}
              </p>
              <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
                <a href={waUrl()} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ink)', color: 'var(--bg)', padding: '16px 28px', border: '3px solid var(--ink)', fontFamily: 'var(--fdisp2)', fontSize: 15, letterSpacing: '0.06em', textDecoration: 'none', boxShadow: '5px 5px 0 var(--red)', transition: 'all 0.15s' }}>
                  <IconWA size={16} /> {lang === 'es' ? 'MANDÁ TU IDEA' : 'SEND YOUR IDEA'}
                </a>
                <Link href="/catalog" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', color: 'var(--ink)', padding: '16px 28px', border: '3px solid var(--ink)', fontFamily: 'var(--fdisp2)', fontSize: 15, letterSpacing: '0.06em', transition: 'all 0.15s', textDecoration: 'none' }}>
                  {lang === 'es' ? 'VER CATÁLOGO' : 'SEE CATALOG'} <IconArrow size={16} />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
              {[
                { n: '500+', l: lang === 'es' ? 'PEDIDOS' : 'ORDERS', c: 'var(--yellow)', r: '-2deg', tc: 'var(--ink)' },
                { n: '48H', l: 'EXPRESS', c: 'var(--red)', r: '1.5deg', tc: 'var(--bg)' },
                { n: '100%', l: 'CUSTOM', c: 'var(--blue)', r: '-1deg', tc: 'var(--bg)' },
              ].map((s, i) => (
                <div key={i} style={{ background: s.c, color: s.tc, border: '3px solid var(--ink)', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 18, transform: `rotate(${s.r})`, boxShadow: '5px 5px 0 var(--ink)', marginLeft: i === 1 ? 24 : i === 2 ? -10 : 0 }}>
                  <div style={{ fontFamily: 'var(--fbowl)', fontSize: 38, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: 'var(--fdisp2)', fontSize: 13, letterSpacing: '0.1em', flex: 1, textAlign: 'right' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Marquee text={lang === 'es' ? MARQUEE_ES : MARQUEE_EN} />
      </section>

      {/* ── FEATURED DROPS ── */}
      {products.length > 0 && (
        <section id="catalog" style={{ padding: '80px 24px', background: 'var(--paper)', position: 'relative', borderBottom: '3px solid var(--ink)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, fontWeight: 700, color: 'var(--red)', marginBottom: 6, letterSpacing: '0.1em' }}>/ DROPS</div>
                <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  {lang === 'es' ? 'CATÁLOGO' : 'CATALOG'}
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 540, marginTop: 12 }}>
                  {lang === 'es' ? 'Camisas, tazas y figuras 3D. Todos personalizables.' : 'Shirts, mugs and 3D figures. All customizable.'}
                </p>
              </div>
              <Link href="/catalog" style={{ fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.06em', padding: '10px 20px', background: 'var(--ink)', color: 'var(--yellow)', border: '2px solid var(--ink)', boxShadow: '3px 3px 0 var(--red)', textDecoration: 'none' }}>
                {lang === 'es' ? 'VER TODO' : 'SEE ALL'}
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32, paddingTop: 18, paddingBottom: 18 }}>
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} lang={lang} idx={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS ── */}
      <section id="process" style={{ padding: '80px 24px', background: 'var(--ink)', color: 'var(--bg)', position: 'relative', overflow: 'hidden', borderBottom: '3px solid var(--ink)' }}>
        <div style={{ position: 'absolute', top: 40, left: 0, width: 200, height: 200, opacity: 0.5, pointerEvents: 'none', background: 'radial-gradient(circle at center, var(--yellow) 1.5px, transparent 2px) 0 0/14px 14px' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, fontWeight: 700, color: 'var(--yellow)', marginBottom: 6, letterSpacing: '0.1em' }}>/ PROCESO</div>
          <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: 48 }}>
            {lang === 'es' ? 'CÓMO FUNCIONA' : 'HOW IT WORKS'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg)', color: 'var(--ink)', border: '3px solid var(--bg)', padding: '24px 22px', position: 'relative', transform: `rotate(${[-1, 0.8, -0.5, 1.2][i]}deg)`, boxShadow: '6px 6px 0 var(--red)' }}>
                <div style={{ position: 'absolute', top: -18, left: 14, background: 'var(--yellow)', color: 'var(--ink)', border: '3px solid var(--ink)', fontFamily: 'var(--fbowl)', fontSize: 18, padding: '4px 12px', boxShadow: '2px 2px 0 var(--ink)', transform: 'rotate(-3deg)' }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--fdisp)', fontSize: 24, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.01em', marginTop: 8, marginBottom: 10 }}>{s.t}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee text={lang === 'es' ? MARQUEE_ES : MARQUEE_EN} bg="var(--red)" color="var(--bg)" height={56} />

      {/* ── CREW ── */}
      <section id="crew" style={{ padding: '80px 24px', background: 'var(--bg)', borderBottom: '3px solid var(--ink)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'var(--paper)', border: '3px solid var(--ink)', padding: 24, transform: 'rotate(-2deg)', boxShadow: '10px 10px 0 var(--red)', position: 'relative' }}>
              <TapeStrip color="var(--yellow)" width={100} rotate="-12deg" style={{ top: -12, left: 30 }} />
              <TapeStrip color="var(--blue)" width={80} rotate="8deg" style={{ bottom: -12, right: 24 }} />
              <div style={{ background: 'var(--ink)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--fdisp)', fontSize: 48, color: 'var(--yellow)', letterSpacing: '-0.02em' }}>CREART</span>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '50%', right: -30, zIndex: 3, transform: 'translateY(-50%) rotate(8deg)', animation: 'float 4s ease-in-out infinite' }}>
              <div style={{ background: 'var(--yellow)', border: '3px solid var(--ink)', width: 90, height: 90, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 var(--ink)', fontFamily: 'var(--fdisp2)', fontSize: 11, textAlign: 'center', lineHeight: 1.1, padding: 8, letterSpacing: '0.04em' }}>
                100%<br />HONDURAS<br />🇭🇳
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, fontWeight: 700, color: 'var(--red)', marginBottom: 6, letterSpacing: '0.1em' }}>/ CREW</div>
            <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: 20 }}>
              {lang === 'es' ? 'HECHO EN CASA' : 'HOMEMADE'}
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
              {lang === 'es'
                ? 'Somos un crew chiquito en Tegucigalpa que vive de imprimir lo que la gente sueña. Anime, gaming, regalos, branding de negocio — todo se puede.'
                : "We're a small crew in Tegucigalpa living off printing what people dream up. Anime, gaming, gifts, business branding — anything goes."}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(lang === 'es'
                ? ['CALIDAD GARANTIZADA', 'PRECIOS DE BARRIO', 'ENTREGA RÁPIDA', 'ATENCIÓN 1A1']
                : ['GUARANTEED QUALITY', 'HOOD PRICES', 'FAST DELIVERY', '1ON1 SERVICE']
              ).map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: ['var(--red)', 'var(--yellow)', 'var(--blue)', 'var(--green)'][i], border: '2px solid var(--ink)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fbowl)', fontSize: 14, color: i === 1 ? 'var(--ink)' : 'var(--bg)', transform: `rotate(${[-3, 2, -2, 3][i]}deg)` }}>✓</div>
                  <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.04em' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '80px 24px', background: 'var(--yellow)', color: 'var(--ink)', position: 'relative', overflow: 'hidden', borderBottom: '3px solid var(--ink)' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, opacity: 0.15, pointerEvents: 'none', background: 'repeating-linear-gradient(-45deg, var(--ink) 0 12px, transparent 12px 24px)' }} />
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, fontWeight: 700, marginBottom: 6, letterSpacing: '0.1em' }}>/ CONTACTO</div>
          <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(48px, 9vw, 110px)', lineHeight: 0.85, textTransform: 'uppercase', marginBottom: 20 }}>
            {lang === 'es' ? 'TIRANOS UN MENSAJE' : 'DROP US A MESSAGE'}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 36 }}>
            {lang === 'es' ? 'Respondemos en minutos. Sin bots, sin formularios. Pura conversa.' : 'We reply in minutes. No bots, no forms. Just conversation.'}
          </p>
          <a href={waUrl()} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--ink)', color: 'var(--yellow)', padding: '20px 36px', border: '4px solid var(--ink)', fontFamily: 'var(--fdisp)', fontSize: 24, letterSpacing: '0.04em', textDecoration: 'none', boxShadow: '8px 8px 0 var(--red)', transition: 'all 0.15s' }}>
            <IconWA size={26} />
            {lang === 'es' ? 'PEDIR POR WHATSAPP' : 'ORDER ON WHATSAPP'}
          </a>
          <div style={{ marginTop: 24, display: 'inline-block', fontFamily: 'var(--fmono)', fontSize: 14, fontWeight: 700, background: 'var(--ink)', color: 'var(--bg)', padding: '6px 14px', letterSpacing: '0.1em', transform: 'rotate(-1deg)' }}>
            +504 3196-9913
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: 'var(--fmono)', fontSize: 11, letterSpacing: '0.05em' }}>© 2026 Creart Personalizados · TGU · Honduras</span>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <a href={waUrl()} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--fdisp2)', fontSize: 12, color: 'var(--yellow)', letterSpacing: '0.06em' }}>
            <IconWA size={14} /> WHATSAPP
          </a>
          <button onClick={() => setLang(l => l === 'es' ? 'en' : 'es')} style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em' }}>
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </footer>
    </div>
  );
}
