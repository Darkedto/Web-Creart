'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Credenciales inválidas');
    } else {
      router.push('/admin/dashboard');
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--yellow)',
    background: 'transparent',
    color: 'var(--bg)',
    fontFamily: 'var(--fmono)',
    fontSize: 14,
    outline: 'none',
    letterSpacing: '0.04em',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: 8 }}>
            CREART PERSONALIZADOS
          </div>
          <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 48, color: 'var(--yellow)', letterSpacing: '-0.01em', lineHeight: 0.9 }}>
            ADMIN
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--fdisp2)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--fdisp2)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: 'var(--red)', textAlign: 'center', padding: '8px 0', border: '1px solid var(--red)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'var(--muted)' : 'var(--yellow)',
              color: 'var(--ink)',
              border: '2px solid var(--yellow)',
              padding: '14px 24px',
              fontFamily: 'var(--fdisp)', fontSize: 20,
              letterSpacing: '0.04em',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '4px 4px 0 var(--red)',
              marginTop: 8,
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'ENTRANDO...' : 'INGRESAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
