import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const file = await prisma.pdfFile.findFirst();

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(file.data, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
          file.name
        )}`,
      },
    });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
};
