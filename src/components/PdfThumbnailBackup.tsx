"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs"; // Importa directamente el worker
import Image from "next/image";

interface Props {
  pdfBuffer?: Buffer;
  imageSrc?: string | null;
}

const PdfThumbnail = ({ imageSrc }: Props) => {
  const [finalImage, setFinalImage] = useState<string | null>(null);

  const loadPdf = async () => {
    // Suponiendo que `pdfBuffer` es tu Buffer

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
      const context = canvas.getContext("2d") as any;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const imageData = canvas.toDataURL("image/png");
      setFinalImage(imageData);
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  useEffect(() => {
    if (imageSrc) {
      loadPdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);
  return (
    <div>
      {finalImage ? (
        <Image src={finalImage} alt="PDF Thumbnail" width={200} height={200} />
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default PdfThumbnail;
