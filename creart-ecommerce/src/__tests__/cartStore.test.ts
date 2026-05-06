import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cartStore';

const ITEM = {
  productId: 'prod-001',
  slug: 'test-shirt',
  sku: 'TST-01',
  name: 'Test Shirt',
  price: 480,
  quantity: 1,
  image: '',
  variant: { size: 'M' },
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('cartStore', () => {
  it('starts empty', () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('adds an item', () => {
    useCartStore.getState().add(ITEM);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('increments quantity for duplicate item+variant', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().add({ ...ITEM, quantity: 2 });
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('treats different sizes as different items', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().add({ ...ITEM, variant: { size: 'L' } });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('removes an item', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().remove(ITEM.productId, ITEM.variant);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates quantity', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().update(ITEM.productId, ITEM.variant, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('removes item when quantity updated to 0', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().update(ITEM.productId, ITEM.variant, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('computes subtotal correctly', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().add({ ...ITEM, productId: 'prod-002', sku: 'MG-01', quantity: 2, price: 280, variant: {} });
    expect(useCartStore.getState().subtotal()).toBe(480 + 280 * 2);
  });

  it('clears all items', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('counts total units', () => {
    useCartStore.getState().add(ITEM);
    useCartStore.getState().add({ ...ITEM, productId: 'prod-002', sku: 'MG-01', quantity: 3, variant: {} });
    expect(useCartStore.getState().count()).toBe(4);
  });
});
