import Link from 'next/link';
import { Marquee } from '@/components/ui/Marquee';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Marquee text="404 · NO ENCONTRADO · 404 · NO FOUND · " bg="var(--red)" color="var(--bg)" />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(80px, 20vw, 180px)', lineHeight: 0.85, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          404
        </h1>
        <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 22, marginTop: 16, marginBottom: 12, letterSpacing: '0.02em' }}>
          PÁGINA NO ENCONTRADA
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 40 }}>
          Esta página no existe o fue movida.
        </p>
        <Link href="/" style={{ background: 'var(--ink)', color: 'var(--yellow)', padding: '16px 32px', fontFamily: 'var(--fdisp)', fontSize: 20, border: '3px solid var(--ink)', boxShadow: '5px 5px 0 var(--red)', textDecoration: 'none' }}>
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}
