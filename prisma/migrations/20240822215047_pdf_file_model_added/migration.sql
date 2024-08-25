-- CreateTable
CREATE TABLE "PdfFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccess" TIMESTAMP(3),
    "thumbnail" BYTEA NOT NULL,

    CONSTRAINT "PdfFile_pkey" PRIMARY KEY ("id")
);
