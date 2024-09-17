"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/legacy/build/pdf.worker.entry"; // Importa directamente el worker

interface Props {
  pdfSrc: string;
}

const PdfThumbnailsNavigation = ({ pdfSrc }: Props) => {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const binaryString = window.atob(pdfSrc);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        Array.from(binaryString).forEach((char, i) => {
          bytes[i] = char.charCodeAt(0);
        });
        const loadingTask = pdfjs.getDocument({ data: bytes });
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
      } catch (error) {
        console.log("🚀 ~ loadPdf ~ error:", error);
      }
    };

    loadPdf();
  }, [pdfSrc]);

  useEffect(() => {
    const renderPages = async () => {
      if (!pdf) {
        return;
      }

      const numPages = pdf.numPages;
      const promises = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        promises.push(renderPage(pageNum));
      }

      await Promise.all(promises);
    };

    const renderPage = async (pageNum: number) => {
      if (!pdf) {
        return;
      }
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = canvasRefs.current[pageNum - 1];
      if (canvas) {
        const context = canvas.getContext("2d");

        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
        }
      }
    };

    renderPages();
  }, [pdf]);

  return (
    <div>
      {pdf &&
        Array.from({ length: pdf.numPages }, (_, index) => (
          <div
            key={index}
            className="flex flex-col rounded-lg justify-center cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <span className="text-center">{index + 1}</span>

            <canvas
              ref={(el) => {
                canvasRefs.current[index] = el;
              }}
              style={{ marginBottom: "20px" }}
              className="p-5"
            />
          </div>
        ))}
    </div>
  );
};

export default PdfThumbnailsNavigation;
