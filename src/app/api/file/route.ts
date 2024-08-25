import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const mimeType = file.type;
    const savedFile = await prisma.pdfFile.create({
      data: {
        name: fileName,
        mimeType: mimeType,
        data: buffer,
      },
    });
    return NextResponse.json(savedFile);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error, { status: 400 });
  }
};
