/*
  Warnings:

  - Added the required column `mimeType` to the `QuickSend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuickSend" ADD COLUMN     "mimeType" TEXT NOT NULL;
