/*
  Warnings:

  - You are about to drop the `StoreCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoreHasCategories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `descriptor` to the `FoodType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StoreHasCategories" DROP CONSTRAINT "StoreHasCategories_storeCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "StoreHasCategories" DROP CONSTRAINT "StoreHasCategories_storeId_fkey";

-- AlterTable
ALTER TABLE "FoodType" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "descriptor" TEXT NOT NULL;

-- DropTable
DROP TABLE "StoreCategory";

-- DropTable
DROP TABLE "StoreHasCategories";

-- CreateTable
CREATE TABLE "StoreHasTypes" (
    "storeId" TEXT NOT NULL,
    "storeCategoryId" TEXT NOT NULL,
    "main" BOOLEAN NOT NULL,

    CONSTRAINT "StoreHasTypes_pkey" PRIMARY KEY ("storeCategoryId","storeId")
);

-- AddForeignKey
ALTER TABLE "StoreHasTypes" ADD CONSTRAINT "StoreHasTypes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreHasTypes" ADD CONSTRAINT "StoreHasTypes_storeCategoryId_fkey" FOREIGN KEY ("storeCategoryId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
