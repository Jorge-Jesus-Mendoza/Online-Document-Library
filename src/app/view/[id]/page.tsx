import { getPdfData } from "@/actions/pdfActions/actions";
import AlterPdfViewer from "@/components/AlterPdfViewer";
import PdfRenderer from "@/components/PdfRenderer";
import PdfTectExtractor from "@/components/PdfTextExtractor";
import PdfViewer from "@/components/PdfViewer";
import PdfViewerV3 from "@/components/PdfViewerV3";

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
        {/* {pdf && <PdfViewer pdfSrc={pdf} />} */}
        {/* {pdf && <AlterPdfViewer pdfData={pdf} />} */}
        {/* {pdf && <PdfTectExtractor base64Pdf={pdf} />} */}
        {/* {pdf && <PdfViewerV3 pdfData={pdf} />} */}
        {pdf && <PdfRenderer base64={pdf} />}
      </div>
    </div>
  );
}
