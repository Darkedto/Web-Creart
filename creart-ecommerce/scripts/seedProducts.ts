import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI no definida en .env.local');
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  name: { es: String, en: String },
  description: { es: String, en: String },
  category: String,
  price: Number,
  compareAtPrice: Number,
  images: [String],
  variants: [{ size: String, color: String, stock: Number }],
  tags: [String],
  active: { type: Boolean, default: true },
  customizable: { type: Boolean, default: true },
}, { timestamps: true });

const PRODUCTS = [
  {
    slug: 'solo-leveling-text-art',
    sku: 'SL-01',
    name: { es: 'SOLO LEVELING — TEXT ART', en: 'SOLO LEVELING — TEXT ART' },
    description: {
      es: 'Diseño exclusivo Solo Leveling en text-art. DTF premium, colores ultra vibrantes. Lavado a máquina.',
      en: 'Exclusive Solo Leveling text-art design. Premium DTF, ultra vibrant colors. Machine washable.',
    },
    category: 'shirts',
    price: 450,
    compareAtPrice: 550,
    images: [],
    variants: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 6 },
      { size: 'XXL', stock: 3 },
    ],
    tags: ['hit'],
    active: true,
    customizable: false,
  },
  {
    slug: 'monarchs-sung-jinwoo',
    sku: 'SL-02',
    name: { es: 'MONARCHS', en: 'MONARCHS' },
    description: {
      es: 'Los Monarcas del Caos. Anime HD con colores vibrantes. Edición especial.',
      en: 'The Shadow Monarchs. HD anime with vibrant colors. Special edition.',
    },
    category: 'shirts',
    price: 480,
    images: [],
    variants: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 7 },
      { size: 'XL', stock: 5 },
      { size: 'XXL', stock: 2 },
    ],
    tags: ['new'],
    active: true,
    customizable: false,
  },
  {
    slug: 'sung-jinwoo-igris-beru',
    sku: 'SL-03',
    name: { es: 'SUNG JINWOO', en: 'SUNG JINWOO' },
    description: {
      es: 'Jinwoo, Igris y Beru. Estilo paneles de manga. DTF HD full color.',
      en: 'Jinwoo, Igris & Beru. Manga panel-style. Full color HD DTF.',
    },
    category: 'shirts',
    price: 480,
    images: [],
    variants: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 4 },
      { size: 'XXL', stock: 2 },
    ],
    tags: [],
    active: true,
    customizable: false,
  },
  {
    slug: 'guerrero-rojo',
    sku: 'WR-01',
    name: { es: 'GUERRERO ROJO', en: 'RED WARRIOR' },
    description: {
      es: 'Guerrero de fantasía con colores explosivos. Arte exclusivo Creart.',
      en: 'Fantasy warrior with explosive colors. Exclusive Creart art.',
    },
    category: 'shirts',
    price: 480,
    images: [],
    variants: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 4 },
      { size: 'XXL', stock: 2 },
    ],
    tags: ['drop'],
    active: true,
    customizable: false,
  },
  {
    slug: 'blood-red-igris',
    sku: 'SL-04',
    name: { es: 'BLOOD RED — IGRIS', en: 'BLOOD RED — IGRIS' },
    description: {
      es: 'Igris en rojo sangre. Edición limitada coleccionista.',
      en: 'Igris in blood red. Limited collector edition.',
    },
    category: 'shirts',
    price: 480,
    compareAtPrice: 580,
    images: [],
    variants: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 3 },
      { size: 'XXL', stock: 1 },
    ],
    tags: ['hit'],
    active: true,
    customizable: false,
  },
  {
    slug: 'arise-solo-leveling',
    sku: 'SL-05',
    name: { es: 'ARISE', en: 'ARISE' },
    description: {
      es: '"ARISE". Solo Leveling en panel azul neón. Diseño icónico.',
      en: '"ARISE". Solo Leveling in blue neon panel. Iconic design.',
    },
    category: 'shirts',
    price: 480,
    images: [],
    variants: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 9 },
      { size: 'L', stock: 7 },
      { size: 'XL', stock: 5 },
      { size: 'XXL', stock: 2 },
    ],
    tags: ['new'],
    active: true,
    customizable: false,
  },
  {
    slug: 'taza-custom',
    sku: 'MG-01',
    name: { es: 'TAZA CUSTOM', en: 'CUSTOM MUG' },
    description: {
      es: 'Tu nombre, foto o frase. Sublimación apta para microondas y lavavajillas.',
      en: 'Your name, photo or quote. Microwave and dishwasher safe sublimation.',
    },
    category: 'mugs',
    price: 280,
    images: [],
    variants: [{ stock: 50 }],
    tags: ['hit'],
    active: true,
    customizable: true,
  },
  {
    slug: 'taza-anime',
    sku: 'MG-02',
    name: { es: 'TAZA ANIME', en: 'ANIME MUG' },
    description: {
      es: 'Tus personajes favoritos en sublimación HD. Colores que no se van.',
      en: 'Your favorite characters in HD sublimation. Colors that last.',
    },
    category: 'mugs',
    price: 300,
    images: [],
    variants: [{ stock: 30 }],
    tags: ['new'],
    active: true,
    customizable: true,
  },
  {
    slug: 'taza-gaming',
    sku: 'MG-03',
    name: { es: 'TAZA GAMING', en: 'GAMING MUG' },
    description: {
      es: 'Logo de tu juego, clan o gamertag. Para gamers de verdad.',
      en: 'Your game logo, clan or gamertag. For real gamers.',
    },
    category: 'mugs',
    price: 300,
    images: [],
    variants: [{ stock: 25 }],
    tags: [],
    active: true,
    customizable: true,
  },
  {
    slug: 'taza-pareja',
    sku: 'MG-04',
    name: { es: 'TAZA PAREJA × 2', en: 'COUPLE MUG × 2' },
    description: {
      es: 'Set de 2 tazas que se complementan. El regalo perfecto para enamorados.',
      en: 'Set of 2 matching mugs. The perfect gift for couples.',
    },
    category: 'mugs',
    price: 550,
    compareAtPrice: 620,
    images: [],
    variants: [{ stock: 20 }],
    tags: ['set'],
    active: true,
    customizable: true,
  },
  {
    slug: 'soporte-dragon-3d',
    sku: '3D-01',
    name: { es: 'SOPORTE DRAGÓN 3D', en: '3D DRAGON STAND' },
    description: {
      es: 'Soporte para Alexa Echo Dot diseño dragón. Impresión 3D de alta resolución.',
      en: 'Dragon design Alexa Echo Dot stand. High resolution 3D print.',
    },
    category: '3d',
    price: 450,
    images: [],
    variants: [{ stock: 15 }],
    tags: ['new'],
    active: true,
    customizable: true,
  },
  {
    slug: 'combo-birthday',
    sku: 'PK-01',
    name: { es: 'COMBO BIRTHDAY', en: 'BIRTHDAY COMBO' },
    description: {
      es: 'Taza + camisa + llavero 3D. El regalo más completo para cumpleaños.',
      en: 'Mug + shirt + 3D keychain. The most complete birthday gift.',
    },
    category: 'packs',
    price: 750,
    compareAtPrice: 900,
    images: [],
    variants: [{ stock: 10 }],
    tags: ['set'],
    active: true,
    customizable: true,
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log('✅  Conectado a MongoDB');

  const ProductModel = mongoose.model('Product', ProductSchema);

  let created = 0;
  let skipped = 0;

  for (const p of PRODUCTS) {
    const exists = await ProductModel.findOne({ slug: p.slug });
    if (exists) {
      console.log(`⏭️   Saltando ${p.sku} (ya existe)`);
      skipped++;
      continue;
    }
    await ProductModel.create(p);
    console.log(`✅  Creado: ${p.sku} — ${p.name.es}`);
    created++;
  }

  console.log(`\n🎨  Seed completado: ${created} creados, ${skipped} saltados`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
