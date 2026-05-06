import { describe, it, expect } from 'vitest';
import { waUrl, orderWhatsappMessage } from '@/lib/wa';

describe('waUrl', () => {
  it('builds a WhatsApp URL with default message', () => {
    const url = waUrl();
    expect(url).toContain('wa.me/');
    expect(url).toContain('text=');
  });

  it('encodes custom message', () => {
    const url = waUrl('Hola! Quiero 2x SL-01 talla M');
    expect(url).toContain(encodeURIComponent('Hola!'));
  });
});

describe('orderWhatsappMessage', () => {
  const ORDER = {
    orderNumber: 'CR-2026-0001',
    customer: {
      name: 'María García',
      address: { street: 'Col. Kennedy Casa 5', city: 'Tegucigalpa', department: 'Francisco Morazán' },
    },
    items: [
      { quantity: 2, name: 'Solo Leveling Text Art', variant: { size: 'M' }, price: 450 },
      { quantity: 1, name: 'Taza Custom', variant: {}, price: 280 },
    ],
    total: 1180,
    paymentMethod: 'cod',
  };

  it('includes order number', () => {
    const msg = orderWhatsappMessage(ORDER);
    expect(msg).toContain('CR-2026-0001');
  });

  it('includes customer name', () => {
    const msg = orderWhatsappMessage(ORDER);
    expect(msg).toContain('María García');
  });

  it('includes total', () => {
    const msg = orderWhatsappMessage(ORDER);
    expect(msg).toContain('1180');
  });

  it('includes product lines', () => {
    const msg = orderWhatsappMessage(ORDER);
    expect(msg).toContain('Solo Leveling Text Art');
    expect(msg).toContain('Taza Custom');
  });

  it('shows cod as Contra entrega', () => {
    const msg = orderWhatsappMessage(ORDER);
    expect(msg).toContain('Contra entrega');
  });
});
