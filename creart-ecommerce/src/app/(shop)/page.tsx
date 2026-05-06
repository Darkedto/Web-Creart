import type { Metadata } from 'next';
import { LandingClient } from './LandingClient';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export const metadata: Metadata = {
  title: 'Creart Personalizados — Street Custom Print Honduras',
  description: 'Camisas DTF, tazas sublimadas y figuras 3D personalizadas en Honduras. Tu diseño, tu estilo.',
};

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  return <LandingClient products={products} />;
}
