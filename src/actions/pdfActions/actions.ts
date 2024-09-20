"use server";

import prisma from "@/lib/prisma";

type HighlightArea = {
  height: number;
  left: number;
  pageIndex: number;
  top: number;
  width: number;
};

export const addNote = async (
  pdfId: string,
  content: string,
  size: number,
  colorCode: string,
  isBold: boolean,
  page: number,
  highlightAreas: HighlightArea[],
  quote: string
) => {
  const note = await prisma.note.create({
    data: {
      pdfId,
      content,
      colorCode,
      size,
      isBold,
      page,
      highlightAreas,
      quote,
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
