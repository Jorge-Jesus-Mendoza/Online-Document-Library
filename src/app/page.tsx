import { getUserServerSession } from "@/actions/authActions/auth-actions";
import { authOptions } from "@/auth.configs";
import Form from "@/components/LayoutComponents/Form";
import ThemeToggle from "@/components/LayoutComponents/ThemeToggle";
import PdfGrid from "@/components/PdfGrid";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = await getUserServerSession();
  const pdfList = await prisma.pdfFile.findMany({
    select: {
      id: true,
      name: true,
      lastAccess: true,
      createdAt: true,
      mimeType: true,
    },
  });
  return (
    <div>
      <div className="flex justify-between items-center">
        <Form />
        <span className="text-gray-100">{JSON.stringify(session)}</span>
        <div className="p-5">
          <ThemeToggle iconSize={40} />
        </div>
      </div>
      <PdfGrid pdfList={pdfList} />
    </div>
  );
}
