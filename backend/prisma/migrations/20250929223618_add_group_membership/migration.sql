/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropTable
DROP TABLE "public"."Group";

-- DropTable
DROP TABLE "public"."Payment";

-- CreateTable
CREATE TABLE "public"."groups" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "serviceId" INTEGER,
    "platformKey" TEXT NOT NULL,
    "platformName" TEXT NOT NULL,
    "planKey" TEXT,
    "basePriceMXN" INTEGER NOT NULL,
    "slots" INTEGER NOT NULL,
    "pricePerMember" INTEGER NOT NULL,
    "credentials" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER,
    "stripePaymentIntentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'mxn',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_memberships" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "paymentId" INTEGER,

    CONSTRAINT "group_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "groups_ownerId_idx" ON "public"."groups"("ownerId");

-- CreateIndex
CREATE INDEX "groups_serviceId_idx" ON "public"."groups"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "public"."payments"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "public"."payments"("userId");

-- CreateIndex
CREATE INDEX "payments_groupId_idx" ON "public"."payments"("groupId");

-- CreateIndex
CREATE INDEX "group_memberships_userId_idx" ON "public"."group_memberships"("userId");

-- CreateIndex
CREATE INDEX "group_memberships_groupId_idx" ON "public"."group_memberships"("groupId");

-- CreateIndex
CREATE INDEX "group_memberships_status_idx" ON "public"."group_memberships"("status");

-- CreateIndex
CREATE INDEX "group_memberships_expiresAt_idx" ON "public"."group_memberships"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "group_memberships_userId_groupId_key" ON "public"."group_memberships"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_memberships" ADD CONSTRAINT "group_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_memberships" ADD CONSTRAINT "group_memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
