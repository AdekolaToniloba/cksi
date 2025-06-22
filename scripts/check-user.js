// scripts/check-user.js
// Run this to check your admin user in the database

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkUser() {
    try {
        console.log('🔍 Checking admin user...')

        const user = await prisma.user.findUnique({
            where: { email: 'admin@cksi.org' },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                createdAt: true
            }
        })

        if (!user) {
            console.log('❌ No user found with email: admin@cksi.org')
            return
        }

        console.log('✅ User found:')
        console.log('📧 Email:', user.email)
        console.log('👤 Name:', user.name)
        console.log('🔑 Role:', user.role)
        console.log('📅 Created:', user.createdAt)
        console.log('🔐 Password hash starts with:', user.password?.substring(0, 10) + '...')
        console.log('🔐 Password hash length:', user.password?.length)

        // Test the password
        if (user.password) {
            const testPassword = 'admin123'
            const isValid = await bcrypt.compare(testPassword, user.password)
            console.log('🔓 Password "admin123" is valid:', isValid)

            // Check if password is hashed
            const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
            console.log('🔒 Password appears to be hashed:', isHashed)

            if (!isHashed) {
                console.log('⚠️  WARNING: Password is not hashed! This will cause login failures.')
            }
        } else {
            console.log('❌ No password set for user!')
        }

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkUser()