-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_mealId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "mealId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
