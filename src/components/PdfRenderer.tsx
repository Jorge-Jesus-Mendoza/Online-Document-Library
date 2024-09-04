"use client";

import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "pdfjs-dist/build/pdf.worker.min.js";

interface Props {
  base64: string;
}

const PdfRenderer = ({ base64 }: Props) => {
  const pdfData = `data:application/pdf;base64,${base64}`;
  return <Viewer fileUrl={pdfData} />;
};

export default PdfRenderer;
