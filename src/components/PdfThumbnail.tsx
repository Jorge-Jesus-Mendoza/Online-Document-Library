"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs"; // Importa directamente el worker
import Image from "next/image";

interface Props {
  pdfBuffer?: Buffer;
  imageSrc?: string | null;
}

const PdfThumbnail = ({ imageSrc }: Props) => {
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const previousImageSrcRef = useRef<string | null>(null);

  const loadPdf = useCallback(async () => {
    try {
      const binaryString = window.atob(imageSrc!);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const loadingTask = pdfjs.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const imageData = canvas.toDataURL("image/png");
      setFinalImage(imageData);

      // Liberar memoria eliminando el canvas
      canvas.remove();
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  }, [imageSrc]);

  useEffect(() => {
    if (imageSrc && imageSrc !== previousImageSrcRef.current) {
      loadPdf();
      previousImageSrcRef.current = imageSrc;
    }
  }, [imageSrc, loadPdf]);

  return (
    <div>
      {finalImage ? (
        <Image src={finalImage} alt="PDF Thumbnail" width={200} height={200} />
      ) : (
        <div
          role="status"
          className="flex items-center justify-center h-[300px] max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700 w-[200px]"
        >
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default PdfThumbnail;
