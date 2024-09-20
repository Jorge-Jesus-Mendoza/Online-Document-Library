/*
  Warnings:

  - Added the required column `highlightAreas` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quote` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "highlightAreas" JSONB NOT NULL,
ADD COLUMN     "quote" TEXT NOT NULL;
