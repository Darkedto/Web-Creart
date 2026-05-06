'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { calculateShipping, formatPrice } from '@/lib/shipping';
import { waUrl, orderWhatsappMessage } from '@/lib/wa';
import { Button } from '@/components/ui/Button';

const HN_DEPARTMENTS = [
  'Francisco Morazán', 'Cortés', 'Atlántida', 'Colón', 'Comayagua',
  'Copán', 'El Paraíso', 'Gracias a Dios', 'Intibucá', 'Islas de la Bahía',
  'La Paz', 'Lempira', 'Ocotepeque', 'Olancho', 'Santa Bárbara',
  'Valle', 'Yoro',
];

type PaymentMethod = 'stripe' | 'cod' | 'transfer';

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  department: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

const INITIAL: FormData = {
  name: '', email: '', phone: '', street: '', city: '',
  department: 'Francisco Morazán', notes: '', paymentMethod: 'cod',
};

export function CheckoutForm() {
  const { items, subtotal, clear } = useCartStore();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const shipping = calculateShipping(form.department, subtotal());
  const total = subtotal() + shipping;

  const set = (field: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Requerido';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email inválido';
    if (form.phone.length < 8) e.phone = 'Mínimo 8 dígitos';
    if (!form.street.trim()) e.street = 'Requerido';
    if (!form.city.trim()) e.city = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const orderPayload = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: { street: form.street, city: form.city, department: form.department, country: 'Honduras', notes: form.notes },
        },
        items: items.map((i) => ({
          productId: i.productId,
          sku: i.sku,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          variant: i.variant,
          customDesignNotes: i.customDesignNotes,
        })),
        paymentMethod: form.paymentMethod,
        shipping,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al crear orden');

      const order = data.order;

      if (form.paymentMethod === 'stripe') {
        // Create Stripe checkout session
        const stripeRes = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order._id }),
        });
        const stripeData = await stripeRes.json();
        if (!stripeRes.ok) throw new Error(stripeData.error ?? 'Error en Stripe');
        window.location.href = stripeData.url;
        return;
      }

      // COD or Transfer — open WhatsApp
      const msg = orderWhatsappMessage({
        orderNumber: order.orderNumber,
        customer: { name: form.name, address: { street: form.street, city: form.city, department: form.department } },
        items: items.map((i) => ({ quantity: i.quantity, name: i.name, variant: i.variant, price: i.price })),
        total,
        paymentMethod: form.paymentMethod,
      });

      clear();
      window.open(waUrl(msg), '_blank');
      window.location.href = `/order/${order._id}`;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid var(--ink)',
    background: 'var(--bg)',
    fontFamily: 'var(--fbody)',
    fontSize: 15,
    outline: 'none',
    boxShadow: '2px 2px 0 var(--ink)',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--fdisp2)',
    fontSize: 12,
    letterSpacing: '0.06em',
    marginBottom: 6,
  };
  const errStyle: React.CSSProperties = {
    color: 'var(--red)',
    fontFamily: 'var(--fmono)',
    fontSize: 11,
    marginTop: 4,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
      {/* Left: form fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 28, letterSpacing: '0.01em', marginBottom: 20 }}>
            DATOS DE ENTREGA
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>NOMBRE COMPLETO *</label>
              <input style={inputStyle} value={form.name} onChange={(e) => set('name', e.target.value)} />
              {errors.name && <p style={errStyle}>{errors.name}</p>}
            </div>
            <div>
              <label style={labelStyle}>EMAIL *</label>
              <input type="email" style={inputStyle} value={form.email} onChange={(e) => set('email', e.target.value)} />
              {errors.email && <p style={errStyle}>{errors.email}</p>}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>WHATSAPP / TELÉFONO *</label>
              <input type="tel" style={inputStyle} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+504..." />
              {errors.phone && <p style={errStyle}>{errors.phone}</p>}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>DIRECCIÓN *</label>
              <input style={inputStyle} value={form.street} onChange={(e) => set('street', e.target.value)} placeholder="Calle, colonia, número..." />
              {errors.street && <p style={errStyle}>{errors.street}</p>}
            </div>
            <div>
              <label style={labelStyle}>CIUDAD *</label>
              <input style={inputStyle} value={form.city} onChange={(e) => set('city', e.target.value)} />
              {errors.city && <p style={errStyle}>{errors.city}</p>}
            </div>
            <div>
              <label style={labelStyle}>DEPARTAMENTO *</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={form.department} onChange={(e) => set('department', e.target.value)}>
                {HN_DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>NOTAS DE ENTREGA</label>
              <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Instrucciones especiales, punto de referencia..." />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div>
          <h2 style={{ fontFamily: 'var(--fdisp)', fontSize: 28, letterSpacing: '0.01em', marginBottom: 20 }}>
            MÉTODO DE PAGO
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { value: 'cod', label: 'Contra entrega', desc: 'Pagás cuando recibís tu pedido en casa.' },
              { value: 'transfer', label: 'Transferencia bancaria', desc: 'Te enviamos los datos por WhatsApp. Mandá comprobante.' },
              { value: 'stripe', label: 'Tarjeta (Visa / Mastercard)', desc: 'Pago seguro con Stripe. Redirige al checkout.' },
            ].map((method) => (
              <label
                key={method.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: 16,
                  border: `2px solid ${form.paymentMethod === method.value ? 'var(--ink)' : 'var(--muted)'}`,
                  background: form.paymentMethod === method.value ? 'var(--paper)' : 'var(--bg)',
                  boxShadow: form.paymentMethod === method.value ? '3px 3px 0 var(--ink)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={form.paymentMethod === method.value as PaymentMethod}
                  onChange={() => set('paymentMethod', method.value)}
                  style={{ marginTop: 3, accentColor: 'var(--ink)' }}
                />
                <div>
                  <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 14, letterSpacing: '0.04em' }}>{method.label.toUpperCase()}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{method.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right: order summary */}
      <div
        style={{
          background: 'var(--paper)',
          border: '3px solid var(--ink)',
          boxShadow: '6px 6px 0 var(--ink)',
          padding: 24,
          position: 'sticky',
          top: 90,
        }}
      >
        <h3 style={{ fontFamily: 'var(--fdisp)', fontSize: 22, marginBottom: 16 }}>TU ORDEN</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 13 }}>{item.name}</p>
                <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--muted)' }}>
                  {item.quantity}x{item.variant.size ? ` • ${item.variant.size}` : ''}
                </p>
              </div>
              <p style={{ fontFamily: 'var(--fdisp2)', fontSize: 14, whiteSpace: 'nowrap' }}>
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--fmono)', fontSize: 12 }}>SUBTOTAL</span>
            <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 14 }}>{formatPrice(subtotal())}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--fmono)', fontSize: 12 }}>ENVÍO</span>
            <span style={{ fontFamily: 'var(--fdisp2)', fontSize: 14 }}>
              {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 12, borderTop: '2px solid var(--ink)' }}>
            <span style={{ fontFamily: 'var(--fdisp)', fontSize: 18 }}>TOTAL</span>
            <span style={{ fontFamily: 'var(--fdisp)', fontSize: 24, color: 'var(--red)' }}>{formatPrice(total)}</span>
          </div>
        </div>

        {shipping === 0 && (
          <p style={{ fontFamily: 'var(--fmono)', fontSize: 11, color: 'var(--green)', marginTop: 8 }}>
            🎉 ¡Envío gratis! Pedido mayor a L. 1,500
          </p>
        )}

        <button
          type="submit"
          disabled={loading || items.length === 0}
          style={{
            width: '100%',
            marginTop: 20,
            background: loading ? 'var(--muted)' : 'var(--ink)',
            color: 'var(--yellow)',
            border: '3px solid var(--ink)',
            padding: '18px 24px',
            fontFamily: 'var(--fdisp)',
            fontSize: 22,
            letterSpacing: '0.04em',
            boxShadow: '5px 5px 0 var(--red)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'PROCESANDO...' : form.paymentMethod === 'stripe' ? 'PAGAR CON TARJETA' : 'CONFIRMAR PEDIDO'}
        </button>

        <p style={{ fontFamily: 'var(--fmono)', fontSize: 10, color: 'var(--muted)', marginTop: 12, textAlign: 'center' }}>
          Al confirmar aceptás nuestros términos de servicio.
        </p>
      </div>
    </form>
  );
}
