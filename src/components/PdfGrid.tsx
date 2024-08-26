import React from "react";
import PdfCard from "./PdfCard";

type Pdf = {
  id: number;
  name: string;
  mimeType: string;
  createdAt: Date;
  lastAccess: Date | null;
};

interface Props {
  pdfList: Pdf[];
}
const PdfGrid = ({ pdfList }: Props) => {
  return (
    <div className="grid grid-cols-5 gap-5 p-10">
      {pdfList.map((pdf) => (
        <PdfCard key={pdf.id} {...pdf} />
      ))}
    </div>
  );
};

export default PdfGrid;
