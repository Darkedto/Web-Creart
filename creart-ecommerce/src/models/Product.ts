import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IVariant {
  size?: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color?: string;
  stock: number;
}

export interface IProduct extends Document {
  slug: string;
  sku: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  category: 'shirts' | 'mugs' | '3d' | 'packs';
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: IVariant[];
  tags: Array<'hit' | 'new' | 'set' | 'drop'>;
  active: boolean;
  customizable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>(
  {
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] },
    color: String,
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true },
    name: {
      es: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      es: { type: String, required: true },
      en: { type: String, required: true },
    },
    category: {
      type: String,
      enum: ['shirts', 'mugs', '3d', 'packs'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    variants: { type: [VariantSchema], default: [] },
    tags: {
      type: [String],
      enum: ['hit', 'new', 'set', 'drop'],
      default: [],
    },
    active: { type: Boolean, default: true },
    customizable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product =
  (models.Product as mongoose.Model<IProduct>) ||
  model<IProduct>('Product', ProductSchema);
