/*
  Warnings:

  - You are about to drop the column `xPosition` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `yPosition` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "xPosition",
DROP COLUMN "yPosition";
