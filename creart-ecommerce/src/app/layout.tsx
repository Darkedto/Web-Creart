import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Creart Personalizados — Street Custom Print | Honduras',
  description:
    'Camisas DTF, tazas sublimadas y figuras 3D personalizadas. Hecho en Tegucigalpa, Honduras. Tu diseño, tu cultura, tu estilo.',
  keywords: ['camisas personalizadas honduras', 'DTF honduras', 'tazas sublimadas', 'impresión 3D', 'creart'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Creart Personalizados',
    description: 'Impresión personalizada en Honduras. DTF, Sublimación, 3D.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
