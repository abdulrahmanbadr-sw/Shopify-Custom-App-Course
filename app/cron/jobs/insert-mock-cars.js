import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function insertCar() {
    console.log('Running cron task at', new Date());
    console.log("cronsky beat");

    try {
        const existing = await prisma.car.findUnique({
            where: { licensePlace: "------" }
        });

        if (!existing) {
            const car = await prisma.car.create({
                data: {
                    brand: new Date().toISOString(),
                    licensePlace: "------",
                    year: 2025,
                    fuelTypeId: 1,
                    driverName: "abdulrahman"
                }
            });
            console.log("[CRON Job] Inserted car:", car);
        }
    } catch (error) {
        console.error("[CRON Job] Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

insertCar();
