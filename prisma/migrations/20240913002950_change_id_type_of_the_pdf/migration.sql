/*
  Warnings:

  - The primary key for the `PdfFile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_pdfId_fkey";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "pdfId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PdfFile" DROP CONSTRAINT "PdfFile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PdfFile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PdfFile_id_seq";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "PdfFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
