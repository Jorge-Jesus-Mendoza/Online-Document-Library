import Form from "@/components/Form";
import PdfCard from "@/components/PdfCard";
import prisma from "@/lib/prisma";

export default async function Home() {
  const pdfList = await prisma.pdfFile.findMany();
  // console.log("🚀 ~ Home ~ pdfList:", pdfList);
  return (
    <div>
      <Form />
      <div className="grid grid-cols-6 gap-5">
        {pdfList.map((pdf) => (
          <PdfCard key={pdf.id} {...pdf} />
        ))}
      </div>
    </div>
  );
}
