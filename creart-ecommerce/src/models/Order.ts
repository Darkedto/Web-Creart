import mongoose, { Schema, model, models, Document } from 'mongoose';

export type PaymentMethod = 'stripe' | 'cod' | 'transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus =
  | 'pending'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface IOrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  variant: { size?: string; color?: string };
  customDesignNotes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      department: string;
      country: string;
      notes?: string;
    };
  };
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: 'HNL';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  stripeSessionId?: string;
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: {
      size: String,
      color: String,
    },
    customDesignNotes: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        department: { type: String, required: true },
        country: { type: String, default: 'Honduras' },
        notes: String,
      },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: 'HNL' },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod', 'transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['pending', 'in_production', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    stripeSessionId: String,
    whatsappSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate order number before saving
OrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `CR-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const Order =
  (models.Order as mongoose.Model<IOrder>) ||
  model<IOrder>('Order', OrderSchema);
