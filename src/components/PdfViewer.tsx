"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs"; // Importa directamente el worker

interface Props {
  pdfSrc: string;
}

const PdfViewer = ({ pdfSrc }: Props) => {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [scale, setScale] = useState(1);
  const [bgColor, setBgColor] = useState("#f0f0f0");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
      const viewport = page.getViewport({ scale: 1 });
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
      <div>
        <label>
          Background Color:
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </label>
        <label>
          Font Size:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </label>
      </div>
      {pdf &&
        Array.from({ length: pdf.numPages }, (_, index) => (
          <canvas
            key={index}
            ref={(el) => {
              canvasRefs.current[index] = el;
            }}
            style={{ backgroundColor: "#f0f0f0", marginBottom: "20px" }}
          />
        ))}
    </div>
  );
};

export default PdfViewer;
