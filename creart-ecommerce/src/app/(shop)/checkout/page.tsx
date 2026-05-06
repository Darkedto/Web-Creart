import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/shop/CheckoutForm';
import { Marquee } from '@/components/ui/Marquee';

export const metadata: Metadata = {
  title: 'Checkout — Creart Personalizados',
};

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Marquee text="CHECKOUT · PAGO SEGURO · DTF · SUBLIMACIÓN · 3D · MADE IN HONDURAS · " />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, color: 'var(--red)', letterSpacing: '0.1em', marginBottom: 6 }}>/ CHECKOUT</div>
          <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(48px, 7vw, 80px)', lineHeight: 0.9, textTransform: 'uppercase' }}>
            FINALIZAR ORDEN
          </h1>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
