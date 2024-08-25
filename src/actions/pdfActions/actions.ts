"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface Props {
  file: File | null;
}

export const createPdf = async (file: File | null) => {
  const formData = new FormData();
  formData.append("file", file!);
  console.log("🚀 ~ createPdf ~ formData:", formData);

  //   const updatedPdf = await prisma.pdfFile.create({
  //     data: { ...formData },
  //   });

  //   revalidatePath("/");

  //   return updatedPdf;
};

export const getPdfData = async (id: number) => {
  const pdf = await prisma.pdfFile.findUnique({
    where: { id },
    select: { data: true },
  });
  if (pdf) {
    return pdf.data.toString("base64");
  }
};
