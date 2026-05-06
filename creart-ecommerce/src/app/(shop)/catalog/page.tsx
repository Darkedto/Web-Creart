import type { Metadata } from 'next';
import { CatalogClient } from './CatalogClient';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export const metadata: Metadata = {
  title: 'Catálogo — Creart Personalizados',
  description: 'Camisas DTF, tazas sublimadas y figuras 3D personalizadas en Honduras.',
};

interface SearchParams {
  category?: string;
  tag?: string;
  q?: string;
}

async function getProducts(search: SearchParams) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { active: true };
  if (search.category && search.category !== 'all') filter.category = search.category;
  if (search.tag) filter.tags = search.tag;
  if (search.q) {
    filter.$or = [
      { 'name.es': { $regex: search.q, $options: 'i' } },
      { 'name.en': { $regex: search.q, $options: 'i' } },
      { sku: { $regex: search.q, $options: 'i' } },
    ];
  }
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const products = await getProducts(searchParams);
  return <CatalogClient products={products} initialCategory={searchParams.category ?? 'all'} initialSearch={searchParams.q ?? ''} />;
}
