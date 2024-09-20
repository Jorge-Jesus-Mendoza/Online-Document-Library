"use server";

import prisma from "@/lib/prisma";

export const addNote = async (
  pdfId: string,
  content: string,
  xPosition: number,
  yPosition: number,
  size: number,
  colorCode: string,
  isBold: boolean,
  page: number
) => {
  const note = await prisma.note.create({
    data: {
      pdfId,
      content,
      xPosition,
      yPosition,
      colorCode,
      size,
      isBold,
      page,
    },
  });
  if (note) return note;
};

export const deleteNote = async (id: string) => {
  await prisma.note.delete({
    where: {
      id,
    },
  });
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
