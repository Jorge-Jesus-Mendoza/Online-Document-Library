"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface NoteProps {
  pdfId: string;
  content: string;
  xPosition: number;
  yPosition: number;
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

export const addNote = async (
  pdfId: string,
  content: string,
  xPosition: number,
  yPosition: number
) => {
  const note = await prisma.note.create({
    data: {
      pdfId,
      content,
      xPosition,
      yPosition,
    },
  });
  if (note) return note;
};

export const getNotes = async (id: string) => {
  const notes = await prisma.note.findMany({
    where: {
      pdfId: id,
    },
  });

  if (notes) return notes;
};

export const getPdfData = async (id: string) => {
  const pdf = await prisma.pdfFile.findUnique({
    where: { id },
    select: { data: true },
  });
  if (pdf) {
    return pdf.data.toString("base64");
  }
};
