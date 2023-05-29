-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "ingredients" TEXT,
    "avatarUrl" TEXT,
    "basePrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "description" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodhasTypes" (
    "foodId" TEXT NOT NULL,
    "foodTypeId" TEXT NOT NULL,
    "main" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FoodhasTypes_pkey" PRIMARY KEY ("foodTypeId","foodId")
);

-- CreateTable
CREATE TABLE "FoodType" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "FoodType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "orderCapacity" INTEGER,
    "currentDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minOrderPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "address" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "delivery" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreHasFoods" (
    "storeId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "capacityPerDay" INTEGER,
    "isAvailible" BOOLEAN NOT NULL DEFAULT false,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DECIMAL(65,30) NOT NULL,
    "maxPerOrder" INTEGER,

    CONSTRAINT "StoreHasFoods_pkey" PRIMARY KEY ("foodId","storeId")
);

-- CreateTable
CREATE TABLE "StoreHasCategories" (
    "storeId" TEXT NOT NULL,
    "storeCategoryId" TEXT NOT NULL,
    "main" BOOLEAN NOT NULL,

    CONSTRAINT "StoreHasCategories_pkey" PRIMARY KEY ("storeCategoryId","storeId")
);

-- CreateTable
CREATE TABLE "StoreCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "StoreCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "rate" DOUBLE PRECISION,
    "comment" TEXT,
    "satisfied" BOOLEAN NOT NULL DEFAULT false,
    "deliveyPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "packaging" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "appliedCoupon" TEXT,
    "orderStatusId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHasFoods" (
    "orderId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "finalPrice" DECIMAL(65,30) NOT NULL,
    "count" INTEGER NOT NULL,
    "free" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrderHasFoods_pkey" PRIMARY KEY ("foodId","orderId")
);

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "successful" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodType_name_key" ON "FoodType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Store_registrationNumber_key" ON "Store"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "FoodhasTypes" ADD CONSTRAINT "FoodhasTypes_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodhasTypes" ADD CONSTRAINT "FoodhasTypes_foodTypeId_fkey" FOREIGN KEY ("foodTypeId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreHasFoods" ADD CONSTRAINT "StoreHasFoods_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreHasFoods" ADD CONSTRAINT "StoreHasFoods_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreHasCategories" ADD CONSTRAINT "StoreHasCategories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreHasCategories" ADD CONSTRAINT "StoreHasCategories_storeCategoryId_fkey" FOREIGN KEY ("storeCategoryId") REFERENCES "StoreCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderStatusId_fkey" FOREIGN KEY ("orderStatusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHasFoods" ADD CONSTRAINT "OrderHasFoods_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHasFoods" ADD CONSTRAINT "OrderHasFoods_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
