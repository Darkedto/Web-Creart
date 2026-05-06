import { describe, it, expect } from 'vitest';
import { calculateShipping, formatPrice } from '@/lib/shipping';

describe('calculateShipping', () => {
  it('returns 0 for orders above threshold', () => {
    expect(calculateShipping('Francisco Morazán', 1500)).toBe(0);
    expect(calculateShipping('Olancho', 2000)).toBe(0);
  });

  it('returns L.80 for Tegucigalpa / Francisco Morazán', () => {
    expect(calculateShipping('Francisco Morazán', 400)).toBe(80);
  });

  it('returns L.80 for Cortés / San Pedro Sula', () => {
    expect(calculateShipping('Cortés', 400)).toBe(80);
  });

  it('returns L.150 for other departments', () => {
    expect(calculateShipping('Olancho', 400)).toBe(150);
    expect(calculateShipping('Choluteca', 400)).toBe(150);
  });
});

describe('formatPrice', () => {
  it('formats numbers as Lempiras', () => {
    expect(formatPrice(280)).toBe('L. 280');
    expect(formatPrice(1500)).toBe('L. 1,500');
  });
});
