/*
  Warnings:

  - Added the required column `xPosition` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yPosition` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "xPosition" INTEGER NOT NULL,
ADD COLUMN     "yPosition" INTEGER NOT NULL;
