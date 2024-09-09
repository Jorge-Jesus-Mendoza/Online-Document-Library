import { getPdfData } from "@/actions/pdfActions/actions";
import PdfRenderer from "@/components/PdfRenderer";

interface Props {
  params: {
    id: number;
  };
  searchParams?: string[] | any;
}
export default async function PdfViewerPage(props: Props) {
  const pdf = await getPdfData(Number(props.params.id));
  return (
    <div>
      <div className="flex justify-center">
        {pdf && <PdfRenderer base64={pdf} />}
      </div>
    </div>
  );
}
