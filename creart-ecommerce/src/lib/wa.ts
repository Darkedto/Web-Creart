const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '50431969913';

export function waUrl(message?: string): string {
  const text = message ?? '¡Hola Creart! Quiero hacer un pedido custom 🎨';
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function orderWhatsappMessage(order: {
  orderNumber: string;
  customer: { name: string; address: { street: string; city: string; department: string } };
  items: Array<{ quantity: number; name: string; variant?: { size?: string; color?: string }; price: number }>;
  total: number;
  paymentMethod: string;
}): string {
  const methodLabel: Record<string, string> = {
    cod: 'Contra entrega',
    transfer: 'Transferencia bancaria',
    stripe: 'Tarjeta (Stripe)',
  };

  const itemLines = order.items
    .map((i) => {
      const variant = [i.variant?.size, i.variant?.color].filter(Boolean).join(' / ');
      return `• ${i.quantity}x ${i.name}${variant ? ` (${variant})` : ''} — L. ${i.price * i.quantity}`;
    })
    .join('\n');

  const { street, city, department } = order.customer.address;

  return `¡Hola Creart! 🎨
Nueva orden: ${order.orderNumber}
Cliente: ${order.customer.name}
Total: L. ${order.total}
Método: ${methodLabel[order.paymentMethod] ?? order.paymentMethod}
Productos:
${itemLines}
Dirección: ${street}, ${city}, ${department}`;
}
