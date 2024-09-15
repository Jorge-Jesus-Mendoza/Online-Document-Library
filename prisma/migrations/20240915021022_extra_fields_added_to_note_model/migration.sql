/*
  Warnings:

  - Added the required column `colorCode` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBold` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "colorCode" TEXT NOT NULL,
ADD COLUMN     "isBold" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;
