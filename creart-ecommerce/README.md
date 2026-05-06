# Creart Personalizados — E-commerce

E-commerce completo para Creart Personalizados (impresión personalizada en Honduras: DTF, sublimación, 3D).

**Stack:** Next.js 14 · TypeScript · MongoDB Atlas · Stripe · NextAuth · Zustand · Tailwind CSS

---

## Estructura rápida

```
creart-ecommerce/
├── src/
│   ├── app/
│   │   ├── (shop)/           # Tienda pública
│   │   │   ├── page.tsx                  # Landing
│   │   │   ├── catalog/page.tsx          # Catálogo con filtros
│   │   │   ├── product/[slug]/page.tsx   # Página de producto
│   │   │   ├── cart/page.tsx             # Carrito
│   │   │   ├── checkout/page.tsx         # Checkout
│   │   │   └── order/[id]/page.tsx       # Confirmación
│   │   ├── admin/            # Panel administrador
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   └── orders/
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── ui/               # Sticker, Marquee, TapeStrip, NavBar, Icons
│   │   ├── shop/             # ProductCard, CartDrawer, CheckoutForm
│   │   └── admin/            # AdminShell, ProductForm
│   ├── lib/                  # db, stripe, auth, validators, wa, shipping
│   ├── models/               # Product, Order, User
│   ├── store/                # cartStore (Zustand)
│   └── styles/globals.css
├── scripts/
│   ├── seedAdmin.ts
│   └── seedProducts.ts
├── .env.example
└── package.json
```

---

## 1. Clonar e instalar

```bash
git clone <repo-url> creart-ecommerce
cd creart-ecommerce
npm install
```

---

## 2. Configurar variables de entorno

Copiá el ejemplo y editalo:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y completá **todas** las variables. Abajo están las instrucciones para cada una.

### Variables requeridas

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | URI de conexión MongoDB Atlas |
| `NEXTAUTH_SECRET` | String aleatorio para firmar JWT |
| `NEXTAUTH_URL` | URL base de la app |
| `STRIPE_SECRET_KEY` | Clave secreta Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret del webhook de Stripe |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app |
| `NEXT_PUBLIC_WA_NUMBER` | Número WhatsApp sin + ni espacios |

---

## 3. Configurar MongoDB Atlas

1. Creá cuenta en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Creá un proyecto y un cluster gratuito (M0 Free Tier)
3. En **Database Access**: creá un usuario con password. Anotá usuario y contraseña.
4. En **Network Access**: agregá `0.0.0.0/0` (permite cualquier IP — suficiente para desarrollo)
5. En **Clusters** → **Connect** → **Connect your application** → copiá la URI
6. Reemplazá `<username>` y `<password>` en la URI y pegala en `MONGODB_URI`

```
mongodb+srv://miusuario:mipassword@cluster0.abc123.mongodb.net/creart?retryWrites=true&w=majority
```

---

## 4. Configurar Stripe

### Claves de API
1. Creá cuenta en [stripe.com](https://stripe.com)
2. En el Dashboard ve a **Developers → API keys**
3. Copiá la **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Copiá la **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`

### Webhook (desarrollo local)
1. Instalá la CLI de Stripe: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. En una terminal separada ejecutá:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copiá el `whsec_...` que aparece → `STRIPE_WEBHOOK_SECRET`

---

## 5. NextAuth Secret

Generá un secret seguro:

```bash
# Linux/Mac:
openssl rand -base64 32

# O simplemente usá cualquier string largo y aleatorio
```

---

## 6. Correr en desarrollo

```bash
npm run dev
```

La app corre en [http://localhost:3000](http://localhost:3000)

---

## 7. Crear el primer admin

```bash
npm run seed:admin
```

Esto crea el usuario definido en `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Luego accedé a `/admin/login`.

**Cambiá la contraseña** del `.env.local` y no la commiteés nunca.

---

## 8. Seed de productos iniciales

```bash
npm run seed:products
```

Crea los 12 productos del catálogo (6 camisas, 3 tazas, 1 figura 3D, 1 pack). No duplica si ya existen.

Para agregar imágenes reales a los productos:
1. Subí las imágenes a [Cloudinary](https://cloudinary.com) (free tier)
2. Editá cada producto en `/admin/products` agregando las URLs

---

## 9. Correr tests

```bash
npm run test        # modo watch
npm run test:run    # una pasada (para CI)
```

Incluye tests para: cartStore, validators (Zod), whatsapp helper, shipping calculator.

---

## 10. Deploy en Vercel

### Paso a paso

1. **Subí el código a GitHub**:
   ```bash
   git init && git add . && git commit -m "init"
   git remote add origin https://github.com/tuusuario/creart-ecommerce
   git push -u origin main
   ```

2. **Creá un proyecto en [vercel.com](https://vercel.com)**:
   - Import → seleccioná el repo
   - Framework: Next.js (auto-detecta)
   - Build command: `next build` (default)

3. **Configurá variables de entorno en Vercel**:
   - Settings → Environment Variables
   - Agregá TODAS las variables de `.env.example`
   - Para `NEXTAUTH_URL` usá tu dominio de Vercel: `https://creart.vercel.app`
   - Para `NEXT_PUBLIC_APP_URL` idem

4. **Deploy** → Vercel hace el build automáticamente.

---

## 11. Conectar webhook de Stripe en producción

1. En [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. **+ Add endpoint**
3. URL: `https://tu-dominio.vercel.app/api/webhooks/stripe`
4. Events: seleccioná `checkout.session.completed`
5. Copiá el **Signing secret** → actualizá `STRIPE_WEBHOOK_SECRET` en Vercel
6. Re-deploy para que tome el nuevo valor

---

## Funcionalidades

### Tienda (público)
- **Landing** — diseño urbano/street con marquee, stats, proceso, crew, contacto
- **Catálogo** `/catalog` — filtros por categoría, búsqueda, grid con ProductCards
- **Producto** `/product/[slug]` — galería, selector tallas, cantidad, notas custom, add-to-cart
- **Carrito** `/cart` — persistente en localStorage via Zustand
- **Checkout** `/checkout` — 3 métodos de pago: Stripe / Contra entrega / Transferencia
  - COD/Transfer → abre WhatsApp con resumen de orden
  - Stripe → redirige a Stripe Checkout seguro
- **Confirmación** `/order/[id]` — estado de orden, instrucciones de pago, botón WhatsApp

### Admin (`/admin`)
- **Login** — email + password con NextAuth
- **Dashboard** — stats: órdenes hoy/mes, ventas, productos activos
- **Productos** — listado con estado, CRUD completo, activar/desactivar
- **Órdenes** — listado con filtros, panel lateral de detalle, cambiar estado fulfillment/pago, abrir WhatsApp con cliente

### API Routes
| Método | URL | Auth | Descripción |
|---|---|---|---|
| GET | `/api/products` | Público | Listar productos (filtros via query) |
| POST | `/api/products` | Admin | Crear producto |
| GET | `/api/products/:id` | Público | Obtener producto |
| PUT | `/api/products/:id` | Admin | Actualizar producto |
| DELETE | `/api/products/:id` | Admin | Desactivar producto |
| GET | `/api/orders` | Admin | Listar órdenes |
| POST | `/api/orders` | Público | Crear orden |
| GET | `/api/orders/:id` | Admin/cliente | Ver orden |
| PATCH | `/api/orders/:id` | Admin | Actualizar estado |
| POST | `/api/checkout/stripe` | Público | Crear sesión Stripe |
| POST | `/api/webhooks/stripe` | Stripe | Webhook pago confirmado |

---

## Costos de envío

| Destino | Costo |
|---|---|
| Francisco Morazán / Cortés | L. 80 |
| Resto del país | L. 150 |
| Pedidos > L. 1,500 | Gratis |

---

## Tecnologías

- **Next.js 14** App Router + Server Components
- **TypeScript** strict mode
- **Tailwind CSS** + CSS custom properties para el estilo urbano
- **MongoDB Atlas** + Mongoose ODM
- **NextAuth.js** con JWT + Credentials provider
- **Stripe** Checkout Sessions + Webhooks
- **Zustand** con middleware `persist` para carrito
- **Zod** para validación de schemas
- **Vitest** para testing

---

## Contribuir / Personalizar

### Agregar nuevo producto
```bash
npm run seed:products  # solo si es el set inicial
# O desde el admin: /admin/products/new
```

### Cambiar número de WhatsApp
Editá `NEXT_PUBLIC_WA_NUMBER` en `.env.local`

### Cambiar costos de envío
Editá `src/lib/shipping.ts` — función `calculateShipping`

### Cambiar cuentas bancarias para transferencia
Editá `src/app/(shop)/order/[id]/page.tsx` — sección de instrucciones de transferencia

---

© 2026 Creart Personalizados · TGU · Honduras
