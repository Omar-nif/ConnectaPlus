-- AlterTable
ALTER TABLE "public"."services" ADD COLUMN     "basePriceMXN" INTEGER,
ADD COLUMN     "plans" JSONB,
ADD COLUMN     "slots" INTEGER;
