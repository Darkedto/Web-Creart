import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Creart Personalizados',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>{children}</div>;
}
