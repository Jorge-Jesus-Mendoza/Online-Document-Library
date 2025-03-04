import { getNotes, getPdfData } from "@/actions/pdfActions/actions";
import { authOptions } from "@/auth.configs";
import PdfTectExtractor from "@/components/AlterPdfRenderers/PdfTextExtractor";
import PdfWithAnnotations from "@/components/PdfWithAnnotations";
import { getServerSession } from "next-auth";

interface Props {
  params: {
    id: string;
  };
  searchParams?: string[] | any;
}
export default async function PdfViewerPage(props: Props) {
  const session = await getServerSession(authOptions);
  const pdf = await getPdfData(props.params.id);
  const notes = await getNotes(props.params.id);
  return (
    <div>
      {pdf && notes && (
        <PdfWithAnnotations
          user={session?.user}
          lastPage={pdf.lastPage}
          base64={pdf.data}
          pdfId={props.params.id}
          notes={notes}
        />
        // <PdfTectExtractor base64Pdf={pdf.data} />
      )}
    </div>
  );
}
