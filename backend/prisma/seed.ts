import bcrypt from 'bcrypt';
import 'dotenv/config';
import { prisma } from '../src/config/prisma';

async function main() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    console.log('No users found. Creating default admin user...');

    const hashedPassword = await bcrypt.hash('admin', 12);

    const admin = await prisma.user.create({
      data: {
        name: 'Arunachala Tractor',
        username: 'admin',
        email: 'arunachalatractor@gmail.com',
        password: hashedPassword,
        phone: '9995559990',
        role: 'admin',
        isActive: true,
      },
    });

    console.log('✅ Admin user created:', admin.username);
    console.log('📧 Email:', admin.email);
    console.log('📱 Login: username=admin, password=admin');
  } else {
    console.log('ℹ️  Users already exist. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
