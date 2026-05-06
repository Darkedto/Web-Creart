import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@creart.hn';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'CambiaEsta!2026';

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI no definida en .env.local');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log('✅  Conectado a MongoDB');

  const UserModel = mongoose.model(
    'User',
    new mongoose.Schema({
      email: { type: String, required: true, unique: true, lowercase: true },
      passwordHash: { type: String, required: true },
      role: { type: String, default: 'admin' },
    }, { timestamps: true })
  );

  const existing = await UserModel.findOne({ email: EMAIL.toLowerCase() });
  if (existing) {
    console.log(`⚠️   Admin ${EMAIL} ya existe. Nada que hacer.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  await UserModel.create({ email: EMAIL.toLowerCase(), passwordHash, role: 'admin' });

  console.log(`✅  Admin creado: ${EMAIL}`);
  console.log(`🔑  Password: ${PASSWORD}`);
  console.log(`⚠️   Cambiá la contraseña después del primer login!`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
