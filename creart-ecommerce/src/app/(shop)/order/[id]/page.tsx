import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { waUrl, orderWhatsappMessage } from '@/lib/wa';
import { formatPrice } from '@/lib/shipping';
import { Marquee } from '@/components/ui/Marquee';
import { IconWA, IconCheck } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Confirmación de Orden — Creart Personalizados',
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Contra entrega',
  transfer: 'Transferencia bancaria',
  stripe: 'Tarjeta (Stripe)',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  in_production: 'En producción',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export default async function OrderPage({ params }: { params: { id: string } }) {
  await connectDB();
  const order = await Order.findById(params.id).lean();
  if (!order) notFound();

  const waMsg = orderWhatsappMessage({
    orderNumber: order.orderNumber,
    customer: { name: order.customer.name, address: order.customer.address },
    items: order.items.map((i) => ({ quantity: i.quantity, name: i.name, variant: i.variant, price: i.price })),
    total: order.total,
    paymentMethod: order.paymentMethod,
  });

  const isCodOrTransfer = order.paymentMethod === 'cod' || order.paymentMethod === 'transfer';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Marquee text="¡GRACIAS POR TU PEDIDO! · CUSTOM DROPS · MADE IN HONDURAS · " bg="var(--green)" color="var(--bg)" />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, background: 'var(--green)', border: '3px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)', borderRadius: '50%', marginBottom: 20 }}>
            <IconCheck size={32} />
          </div>
          <h1 style={{ fontFamily: 'var(--fdisp)', fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: 8 }}>
            ¡ORDEN CONFIRMADA!
          </h1>
          <p style={{ fontFamily: 'var(--fmono)', fontSize: 16, color: 'var(--muted)', letterSpacing: '0.06em' }}>
            #{order.orderNumber}
          </p>
        </div>

        {/* Order card */}
        <div style={{ background: 'var(--paper)', border: '3px solid var(--ink)', boxShadow: '8px 8px 0 var(--ink)', padding: 28, marginBottom: 24 }}>
          {/* Status badges */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--ink)', color: 'var(--yellow)', fontFamily: 'var(--fdisp2)', fontSize: 12, padding: '4px 12px', letterSpacing: '0.06em' }}>
              {PAYMENT_LABELS[order.paymentMethod]}
            </div>
            <div style={{ background: order.paymentStatus === 'paid' ? 'var(--green)' : 'var(--muted)', color: 'var(--bg)', fontFamily: 'var(--fdisp2)', fontSize: 12, padding: '4px 12px', letterSpacing: '0.06em' }}>
              PAGO: {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </div>
            <div style={{ background: 'var(--blue)', color: 'var(--bg)', fontFamily: 'var(--fdisp2)', fontSize: 12, padding: '4px 12px', letterSpacing: '0.06em' }}>
              {STATUS_LABELS[order.fulfillmentStatus]}
            </div>
          </div>

          {/* Customer info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 6 }}>CLIENTE</p>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 15 }}>{order.customer.name}</p>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: 'var(--muted)' }}>{order.customer.email}</p>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 12, color: 'var(--muted)' }}>{order.customer.phone}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 6 }}>DIRECCIÓN DE ENTREGA</p>
              <p style={{ fontFamily: 'var(--fmono)', fontSize: 12, lineHeight: 1.7 }}>
                {order.customer.address.street}<br />
                {order.customer.address.city}, {order.customer.address.department}<br />
                {order.customer.address.country}
              </p>
            </div>
          </div>

          {/* Items */}
          <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 20, marginBottom: 20 }}>
            <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 12 }}>PRODUCTOS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 14 }}>{item.name}</p>
                    <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)' }}>
                      {item.quantity}x · {item.sku}{item.variant?.size ? ` · ${item.variant.size}` : ''}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 15, whiteSpace: 'nowrap' }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--fmono)', fontSize: 12 }}>SUBTOTAL</span>
              <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 14 }}>{formatPrice(order.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--fmono)', fontSize: 12 }}>ENVÍO</span>
              <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 14 }}>{order.shipping === 0 ? 'GRATIS' : formatPrice(order.shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--fdisp)', fontSize: 20 }}>TOTAL</span>
              <span style={{ fontFamily: 'var(--fdisp)', fontSize: 28, color: 'var(--red)' }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment instructions */}
        {isCodOrTransfer && (
          <div style={{ background: 'var(--yellow)', border: '3px solid var(--ink)', boxShadow: '5px 5px 0 var(--ink)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--fdisp)', fontSize: 22, marginBottom: 12, textTransform: 'uppercase' }}>
              {order.paymentMethod === 'cod' ? '¿Qué sigue?' : 'Instrucciones de pago'}
            </h3>
            {order.paymentMethod === 'cod' && (
              <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                Tu pedido está registrado. El equipo de Creart se va a contactar para confirmar la fecha de entrega. <strong>Pagás cuando recibís.</strong>
              </p>
            )}
            {order.paymentMethod === 'transfer' && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 15, lineHeight: 1.7 }}>Mandá tu comprobante de transferencia por WhatsApp para confirmar tu pedido.</p>
                <div style={{ fontFamily: 'var(--fmono)', fontSize: 13, background: 'var(--ink)', color: 'var(--yellow)', padding: '10px 14px', marginTop: 10, lineHeight: 1.8 }}>
                  Banco Atlántida<br />
                  Cta. 123-456-789-0<br />
                  A nombre de: Creart Personalizados
                </div>
              </div>
            )}
            <a
              href={waUrl(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--ink)', color: 'var(--yellow)', padding: '14px 22px', fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.06em', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--red)', textDecoration: 'none' }}
            >
              <IconWA size={16} /> CONFIRMAR POR WHATSAPP
            </a>
          </div>
        )}

        {order.paymentMethod === 'stripe' && order.paymentStatus === 'paid' && (
          <div style={{ background: 'var(--green)', border: '3px solid var(--ink)', boxShadow: '5px 5px 0 var(--ink)', padding: 24, marginBottom: 24 }}>
            <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 15, color: 'var(--bg)', letterSpacing: '0.04em' }}>
              ✓ PAGO RECIBIDO — Tu pedido está en producción.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/catalog" style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '14px 28px', fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.06em', border: '2px solid var(--ink)', boxShadow: '4px 4px 0 var(--red)', textDecoration: 'none' }}>
            SEGUIR COMPRANDO
          </Link>
          <Link href="/" style={{ background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.06em', border: '2px solid var(--ink)', textDecoration: 'none' }}>
            INICIO
          </Link>
        </div>
      </div>
    </div>
  );
}
