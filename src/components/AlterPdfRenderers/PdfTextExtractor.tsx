"use client";

import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/legacy/build/pdf.worker.entry";
import Image from "next/image";

interface Props {
  base64Pdf: string;
}

interface PDFPage {
  key: number;
  width: number;
  height: number;
  content: React.ReactNode[];
}

interface ImageData {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const PdfTectExtractor: React.FC<Props> = ({ base64Pdf }) => {
  const [pdfPages, setPdfPages] = useState<PDFPage[]>([]);

  const loadPDF = async (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    const pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    return pdfDoc;
  };

  const renderPage = async (
    pdfDoc: pdfjsLib.PDFDocumentProxy,
    pageNumber: number
  ): Promise<PDFPage> => {
    const page = await pdfDoc.getPage(pageNumber);

    const desiredWidth = 800;
    const viewport = page.getViewport({ scale: 1 });
    const scale = desiredWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const [textContent, operatorList] = await Promise.all([
      page.getTextContent(),
      page.getOperatorList(),
    ]);

    const content = [
      ...textContent.items.map((textItem: any, index: number) => {
        if ("transform" in textItem) {
          const [a, b, c, d, e, f] = textItem.transform;
          const x = e * scale;
          const y = scaledViewport.height - f * scale;
          const angle = (Math.atan2(b, a) * 180) / Math.PI;
          const fontName = textItem.fontName || "sans-serif";
          const isBold =
            fontName.toLowerCase().includes("bold") ||
            fontName.toLowerCase().includes("black");

          return (
            <span
              key={index}
              style={{
                position: "absolute",
                transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                fontSize: `${textItem.height * scale}px`,
                fontFamily: fontName,
                fontWeight: isBold ? "bold" : "normal",
                whiteSpace: "pre",
              }}
            >
              {textItem.str}
            </span>
          );
        }
        return null;
      }),
    ];

    return {
      key: pageNumber,
      width: scaledViewport.width,
      height: scaledViewport.height,
      content,
    };
  };

  useEffect(() => {
    const renderPDF = async () => {
      const pdfDoc = await loadPDF(base64Pdf);
      const pages: PDFPage[] = [];

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await renderPage(pdfDoc, i);
        pages.push(page);
      }

      setPdfPages(pages);
    };

    renderPDF();

    return () => {
      setPdfPages([]);
    };
  }, [base64Pdf]);

  return (
    <div className="pdf-container" style={{ position: "relative" }}>
      {pdfPages ? (
        pdfPages.map((page) => (
          <div
            key={page.key}
            className="pdf-page"
            style={{
              position: "relative",
              width: `${page.width}px`,
              height: `${page.height}px`,
              border: "1px solid #ddd",
              margin: "10px 0",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {page.content}
          </div>
        ))
      ) : (
        <span>Cargando...</span>
      )}
    </div>
  );
};

export default PdfTectExtractor;
