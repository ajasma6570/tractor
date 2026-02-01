import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
})

async function main() {
    const userCount = await prisma.user.count()

    if (userCount === 0) {
        console.log('No users found. Creating default admin user...')

        // Hash the password
        const hashedPassword = await bcrypt.hash('admin', 12)

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                name: 'Arunachala Tractor',
                username: 'admin',
                email: 'arunachalatractor@gmail.com',
                password: hashedPassword,
                phone: '9995559990',
                role: 'admin',
                isActive: true,
            }
        })

        console.log('✅ Admin user created:', admin.username)
    } else {
        console.log('ℹ️  Users already exist. Skipping seed.')
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
