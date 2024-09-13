-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "pdfId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "PdfFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
