"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"; // Importa la versión legacy para compatibilidad
import "pdfjs-dist/legacy/build/pdf.worker.entry"; // Importa el worker correctamente
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
  id: string;
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

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const loadingTask = pdfjs.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });

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
              className=" text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            >
              <IoEye size={25} />
            </Link>
            <button
              type="button"
              className=" text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            >
              <IoCheckmarkDone size={25} />
            </button>
            <button
              type="button"
              className=" text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            >
              <IoTrash size={25} />
            </button>
            <button
              type="button"
              className=" text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            >
              <IoLibrary size={25} />
            </button>
            <button
              type="button"
              className=" text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
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
