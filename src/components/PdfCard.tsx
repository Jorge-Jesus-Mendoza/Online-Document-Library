"use client";

import React, { useEffect, useState } from "react";
import PdfThumbnail from "./PdfThumbnail";
import { getPdfData } from "@/actions/pdfActions/actions";

interface Props {
  id: number;
  name: string;
  mimeType: string;
  createdAt: Date;
  lastAccess: Date | null;
}

const PdfCard = ({ id, name, lastAccess }: Props) => {
  const [base64Data, setBase64Data] = useState<string | null>(null);

  useEffect(() => {
    const loadPdfData = async () => {
      if (!base64Data) {
        // Cargar datos binarios bajo demanda

        const pdf = await getPdfData(id);

        if (pdf) {
          setBase64Data(pdf);
        }
      }
    };

    loadPdfData();
  }, [base64Data, id]);

  function truncateText(text: string, maxLength: number) {
    if (text && text.length > maxLength) {
      return `${text.substring(0, maxLength - 3)}...`;
    }
    return text;
  }

  return (
    <div className="border border-spacing-5 thumbnail-card rounded-md">
      <span className="mx-5 my-5">{truncateText(name, 25)}</span>
      {base64Data ? (
        <PdfThumbnail imageSrc={base64Data} id={id} lastAccess={lastAccess} />
      ) : (
        <div
          role="status"
          className="flex items-center justify-center h-[280px] max-w-sm mx-5 my-5 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700 w-[200px]"
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

export default PdfCard;
