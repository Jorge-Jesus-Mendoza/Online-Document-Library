import Form from "@/components/Form";
import PdfCard from "@/components/PdfCard";
import PdfGrid from "@/components/PdfGrid";
import prisma from "@/lib/prisma";

export default async function Home() {
  const pdfList = await prisma.pdfFile.findMany({
    select: {
      id: true,
      name: true,
      lastAccess: true,
      createdAt: true,
      mimeType: true,
    },
  });
  // console.log("🚀 ~ Home ~ pdfList:", pdfList);
  return (
    <div>
      <Form />
      <PdfGrid pdfList={pdfList} />
    </div>
  );
}
