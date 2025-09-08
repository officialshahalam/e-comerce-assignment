import { PrismaClient } from '@prisma/client';

async function cleanup() {
  const prisma = new PrismaClient();
  
  try {
    const result = await prisma.image.deleteMany({
      where: {
        userId: null
      }
    });
    
    console.log(`Deleted ${result.count} documents`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();