const FREE_SHIPPING_THRESHOLD = 1500; // HNL

export function calculateShipping(
  department: string,
  subtotal: number
): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;

  const tgu = ['Francisco Morazán', 'Cortés', 'Tegucigalpa', 'San Pedro Sula'];
  const isMainCity = tgu.some((d) =>
    department.toLowerCase().includes(d.toLowerCase())
  );

  return isMainCity ? 80 : 150;
}

export function formatPrice(amount: number): string {
  return `L. ${amount.toLocaleString('es-HN')}`;
}
