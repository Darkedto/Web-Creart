import { describe, it, expect } from 'vitest';
import {
  ProductCreateSchema,
  OrderCreateSchema,
  CustomerSchema,
} from '@/lib/validators';

const VALID_PRODUCT = {
  slug: 'test-shirt',
  sku: 'TST-01',
  name: { es: 'Camisa Test', en: 'Test Shirt' },
  description: { es: 'Descripción larga aquí', en: 'Long description here' },
  category: 'shirts' as const,
  price: 480,
  images: ['https://example.com/img.jpg'],
  variants: [{ size: 'M' as const, stock: 10 }],
  tags: ['hit' as const],
  active: true,
  customizable: true,
};

const VALID_CUSTOMER = {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '+50412345678',
  address: {
    street: 'Colonia Kennedy, Bloque 5, Casa 12',
    city: 'Tegucigalpa',
    department: 'Francisco Morazán',
    country: 'Honduras',
  },
};

describe('ProductCreateSchema', () => {
  it('accepts a valid product', () => {
    const result = ProductCreateSchema.safeParse(VALID_PRODUCT);
    expect(result.success).toBe(true);
  });

  it('rejects invalid slug with uppercase', () => {
    const result = ProductCreateSchema.safeParse({ ...VALID_PRODUCT, slug: 'Test-Shirt' });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = ProductCreateSchema.safeParse({ ...VALID_PRODUCT, price: -10 });
    expect(result.success).toBe(false);
  });

  it('requires at least one image', () => {
    const result = ProductCreateSchema.safeParse({ ...VALID_PRODUCT, images: [] });
    expect(result.success).toBe(false);
  });

  it('requires at least one variant', () => {
    const result = ProductCreateSchema.safeParse({ ...VALID_PRODUCT, variants: [] });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = ProductCreateSchema.safeParse({ ...VALID_PRODUCT, category: 'hats' });
    expect(result.success).toBe(false);
  });
});

describe('CustomerSchema', () => {
  it('accepts valid customer data', () => {
    const result = CustomerSchema.safeParse(VALID_CUSTOMER);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = CustomerSchema.safeParse({ ...VALID_CUSTOMER, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects short phone', () => {
    const result = CustomerSchema.safeParse({ ...VALID_CUSTOMER, phone: '1234' });
    expect(result.success).toBe(false);
  });
});

describe('OrderCreateSchema', () => {
  it('accepts a valid order', () => {
    const result = OrderCreateSchema.safeParse({
      customer: VALID_CUSTOMER,
      items: [{
        productId: 'abc123',
        sku: 'SL-01',
        name: 'Solo Leveling',
        price: 450,
        quantity: 2,
        variant: { size: 'M' },
      }],
      paymentMethod: 'cod',
      shipping: 80,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty items array', () => {
    const result = OrderCreateSchema.safeParse({
      customer: VALID_CUSTOMER,
      items: [],
      paymentMethod: 'cod',
      shipping: 80,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid payment method', () => {
    const result = OrderCreateSchema.safeParse({
      customer: VALID_CUSTOMER,
      items: [{ productId: 'x', sku: 'X', name: 'X', price: 100, quantity: 1, variant: {} }],
      paymentMethod: 'bitcoin',
      shipping: 80,
    });
    expect(result.success).toBe(false);
  });
});
