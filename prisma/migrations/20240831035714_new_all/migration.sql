-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Unverified', 'Pending', 'Verified');

-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('Male', 'Female', 'Other');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Unverified',
    "profile_url" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerify" (
    "id" SERIAL NOT NULL,
    "gender" "UserGender" NOT NULL,
    "address" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,
    "id_no" TEXT NOT NULL,
    "front_id_url" TEXT NOT NULL,
    "back_id_url" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTransaction" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "sender_user_id" INTEGER NOT NULL,
    "recipient_user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserVerify" ADD CONSTRAINT "UserVerify_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTransaction" ADD CONSTRAINT "UserTransaction_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTransaction" ADD CONSTRAINT "UserTransaction_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
