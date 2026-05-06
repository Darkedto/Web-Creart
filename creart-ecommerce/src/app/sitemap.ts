import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${appUrl}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  try {
    await connectDB();
    const products = await Product.find({ active: true }).select('slug updatedAt').lean();
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${appUrl}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
