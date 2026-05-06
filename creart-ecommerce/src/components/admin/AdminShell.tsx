'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Órdenes' },
  { href: '/admin/products', label: 'Productos' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ redirect: false });
    router.push('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111', color: '#eee5d3' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#0f0f0f', borderRight: '2px solid #ffd23f', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,210,63,0.2)' }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 10, color: '#6b6557', letterSpacing: '0.1em', marginBottom: 4 }}>CREART</div>
          <div style={{ fontFamily: 'var(--fdisp)', fontSize: 24, color: '#ffd23f', lineHeight: 1 }}>ADMIN</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  fontFamily: 'var(--fdisp2)',
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  color: active ? '#ffd23f' : '#6b6557',
                  background: active ? 'rgba(255,210,63,0.08)' : 'transparent',
                  borderLeft: active ? '3px solid #ffd23f' : '3px solid transparent',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
              >
                {n.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '0 20px', borderTop: '1px solid rgba(255,210,63,0.2)', paddingTop: 16 }}>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width: '100%',
              fontFamily: 'var(--fdisp2)',
              fontSize: 12,
              color: '#e63946',
              letterSpacing: '0.06em',
              padding: '8px 0',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {signingOut ? 'SALIENDO...' : 'CERRAR SESIÓN'}
          </button>
          <Link
            href="/"
            target="_blank"
            style={{ display: 'block', fontFamily: 'var(--fmono)', fontSize: 10, color: '#6b6557', letterSpacing: '0.05em', marginTop: 8, textDecoration: 'none' }}
          >
            ↗ VER TIENDA
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
