import Form from "@/components/LayoutComponents/Form";
import ThemeToggle from "@/components/LayoutComponents/ThemeToggle";
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
      <div className="flex justify-between items-center">
        <Form />
        <div className="p-5">
          <ThemeToggle iconSize={40} />
        </div>
      </div>
      <PdfGrid pdfList={pdfList} />
    </div>
  );
}
