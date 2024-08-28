"use client";

import React, { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

interface Props {
  pdfData: string;
}
const PdfViewerV3 = ({ pdfData }: Props) => {
  const viewerDiv = useRef<HTMLDivElement>(null);
  const pdfUrl = `data:application/pdf;base64,${pdfData}`;

  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc:
          "https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf",
      },
      viewerDiv.current as HTMLDivElement
    ).then();
  }, []);

  return (
    <div>
      <div className="webviewer" ref={viewerDiv}></div>
    </div>
  );
};

export default PdfViewerV3;
