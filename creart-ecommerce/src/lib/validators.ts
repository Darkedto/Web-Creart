import { z } from 'zod';

// ── Product ──────────────────────────────────────────────────────────────────

export const VariantSchema = z.object({
  size: z.enum(['S', 'M', 'L', 'XL', 'XXL']).optional(),
  color: z.string().optional(),
  stock: z.number().int().min(0),
});

export const ProductCreateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  sku: z.string().min(2).toUpperCase(),
  name: z.object({ es: z.string().min(2), en: z.string().min(2) }),
  description: z.object({ es: z.string().min(5), en: z.string().min(5) }),
  category: z.enum(['shirts', 'mugs', '3d', 'packs']),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(z.string().url()).min(1),
  variants: z.array(VariantSchema).min(1),
  tags: z.array(z.enum(['hit', 'new', 'set', 'drop'])).default([]),
  active: z.boolean().default(true),
  customizable: z.boolean().default(true),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;

// ── Order ────────────────────────────────────────────────────────────────────

const AddressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  department: z.string().min(2),
  country: z.string().default('Honduras'),
  notes: z.string().optional(),
});

export const CustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  address: AddressSchema,
});

export const OrderItemSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().min(1),
  variant: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
  }),
  customDesignNotes: z.string().optional(),
});

export const OrderCreateSchema = z.object({
  customer: CustomerSchema,
  items: z.array(OrderItemSchema).min(1),
  paymentMethod: z.enum(['stripe', 'cod', 'transfer']),
  shipping: z.number().min(0),
  stripeSessionId: z.string().optional(),
});

export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;

// ── Fulfillment status update (admin) ────────────────────────────────────────

export const OrderStatusUpdateSchema = z.object({
  fulfillmentStatus: z
    .enum(['pending', 'in_production', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  whatsappSent: z.boolean().optional(),
});

// ── Checkout ─────────────────────────────────────────────────────────────────

export const StripeCheckoutSchema = z.object({
  orderId: z.string(),
});
