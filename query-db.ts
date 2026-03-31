
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const families = await prisma.family.findMany({
    include: {
      memberships: {
        include: {
          user: true
        }
      }
    }
  })
  console.log('Families:')
  console.log(JSON.stringify(families, null, 2))

  const users = await prisma.user.findMany()
  console.log('\nUsers:')
  console.log(JSON.stringify(users, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
