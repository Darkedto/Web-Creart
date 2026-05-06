import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { ProductDetailClient } from './ProductDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug, active: true }).lean();
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: `${product.name.es} — Creart Personalizados`,
    description: product.description.es,
  };
}

export default async function ProductPage({ params }: Props) {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug, active: true }).lean();
  if (!product) notFound();

  const related = await Product.find({
    active: true,
    category: product.category,
    slug: { $ne: product.slug },
  })
    .limit(4)
    .lean();

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      related={JSON.parse(JSON.stringify(related))}
    />
  );
}
