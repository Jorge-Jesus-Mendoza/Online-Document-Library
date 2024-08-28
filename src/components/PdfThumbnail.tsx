"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs"; // Importa directamente el worker
import Image from "next/image";
import {
  IoCheckmarkDone,
  IoEye,
  IoLibrary,
  IoTrash,
  IoTrashBinOutline,
} from "react-icons/io5";
import { IoMdClock } from "react-icons/io";
import moment from "moment";
import Link from "next/link";

interface Props {
  pdfBuffer?: Buffer;
  imageSrc?: string | null;
  id: number;
  lastAccess?: Date | null;
}

const PdfThumbnail = ({ imageSrc, lastAccess, id }: Props) => {
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const previousImageSrcRef = useRef<string | null>(null);

  const loadPdf = useCallback(async () => {
    try {
      const binaryString = window.atob(imageSrc!);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      Array.from(binaryString).forEach((char, i) => {
        bytes[i] = char.charCodeAt(0);
      });

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
    <div className="flex justify-between p-5">
      {finalImage && (
        <>
          <Image
            src={finalImage}
            alt="PDF Thumbnail"
            width={200}
            height={200}
          />
          <div className="flex flex-col ">
            <Link
              href={`/view/${id}`}
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              <IoEye size={25} />
            </Link>
            <button
              type="button"
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              <IoCheckmarkDone size={25} />
            </button>
            <button
              type="button"
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              <IoTrash size={25} />
            </button>
            <button
              type="button"
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              <IoLibrary size={25} />
            </button>
            <button
              type="button"
              className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              <IoMdClock size={25} />
            </button>
          </div>
          <span>{lastAccess && `Ultima lectura: ${moment(lastAccess)}`}</span>
        </>
      )}
    </div>
  );
};

export default PdfThumbnail;
