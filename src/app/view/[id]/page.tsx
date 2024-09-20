import { getNotes, getPdfData } from "@/actions/pdfActions/actions";
import HighlightExample from "@/components/HightlinghtExample";
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
      <div className="flex justify-center">
        {pdf && notes && (
          <PdfWithAnnotations
            base64={pdf}
            pdfId={props.params.id}
            notes={notes}
          />
          // <HighlightExample fileUrl={pdf} />
        )}
      </div>
    </div>
  );
}
