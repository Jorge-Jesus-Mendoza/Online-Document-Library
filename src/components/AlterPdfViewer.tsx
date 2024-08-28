"use client";

import React from "react";
import { EmbedPDF } from "@simplepdf/react-embed-pdf";

interface Props {
  pdfData: string;
}

const AlterPdfViewer = ({ pdfData }: Props) => {
  const pdfUrl = `data:application/pdf;base64,${pdfData}`;
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <EmbedPDF
        mode="inline"
        style={{ width: "900px", height: "900px" }}
        documentURL={pdfUrl}
      />
    </div>
  );
};

export default AlterPdfViewer;
