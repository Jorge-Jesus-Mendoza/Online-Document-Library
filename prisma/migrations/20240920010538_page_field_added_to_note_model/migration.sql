/*
  Warnings:

  - Added the required column `page` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "page" INTEGER NOT NULL;
