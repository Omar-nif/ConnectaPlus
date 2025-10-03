-- CreateTable
CREATE TABLE "public"."Prueba" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "paymentId" INTEGER,

    CONSTRAINT "Prueba_pkey" PRIMARY KEY ("id")
);
