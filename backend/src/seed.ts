import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'medico@medfila.com' },
    update: {},
    create: {
      email: 'medico@medfila.com',
      name: 'Dr. Diego (Demo)',
      password: passwordHash,
      role: 'DOCTOR'
    },
  });

  console.log('✅ Usuário padrão garantido:', user.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
