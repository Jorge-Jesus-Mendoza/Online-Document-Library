"use client";

import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";
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

const PdfRenderer: React.FC<Props> = ({ base64Pdf }) => {
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

  const getImageSrc = async (
    page: pdfjsLib.PDFPageProxy,
    imageIndex: string
  ): Promise<string> => {
    const imgData = page.objs.get(imageIndex);
    if (imgData && imgData.data) {
      const blob = new Blob([imgData.data], { type: imgData.mimeType });
      return URL.createObjectURL(blob);
    }
    return "";
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

    const images: ImageData[] = [];
    const imagePromises = operatorList.fnArray.map(async (fn, i) => {
      if (fn === pdfjsLib.OPS.paintImageXObject) {
        const imgIndex = operatorList.argsArray[i][0].toString(); // Convert number to string
        try {
          const imgData = await getImageSrc(page, imgIndex);
          if (imgData) {
            images.push({
              src: imgData,
              x: 0, // Placeholder for actual position
              y: 0, // Placeholder for actual position
              width: 100, // Placeholder for actual width
              height: 100, // Placeholder for actual height
            });
          }
        } catch (error) {
          console.error(`Error loading image with index ${imgIndex}:`, error);
        }
      }
    });

    await Promise.all(imagePromises);

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
      ...images.map((imgData, index) => (
        <Image
          key={index}
          src={imgData.src}
          alt={`image-${index}`}
          layout="intrinsic"
          width={imgData.width * scale}
          height={imgData.height * scale}
          style={{
            position: "absolute",
            transform: `translate(${imgData.x * scale}px, ${
              scaledViewport.height - imgData.y * scale
            }px)`,
          }}
        />
      )),
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
      {pdfPages.map((page) => (
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
      ))}
    </div>
  );
};

export default PdfRenderer;
