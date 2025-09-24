-- AlterTable
ALTER TABLE "public"."Group" ADD COLUMN     "serviceId" INTEGER;

-- CreateTable
CREATE TABLE "public"."services" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "public"."services"("slug");

-- CreateIndex
CREATE INDEX "Group_serviceId_idx" ON "public"."Group"("serviceId");

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
