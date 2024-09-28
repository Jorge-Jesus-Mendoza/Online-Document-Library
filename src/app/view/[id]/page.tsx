import { getNotes, getPdfData } from "@/actions/pdfActions/actions";
import PdfWithAnnotations from "@/components/PdfWithAnnotations";

interface Props {
  params: {
    id: string;
  };
  searchParams?: string[] | any;
}
export default async function PdfViewerPage(props: Props) {
  const pdf = await getPdfData(props.params.id);
  const notes = await getNotes(props.params.id);
  return (
    <div>
      {pdf && notes && (
        <PdfWithAnnotations
          base64={pdf}
          pdfId={props.params.id}
          notes={notes}
        />
      )}
    </div>
  );
}
