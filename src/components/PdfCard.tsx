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
    <div className="border border-spacing-5 thumbnail-card cursor-pointer rounded-md">
      <span>{truncateText(name, 25)}</span>
      {base64Data && <PdfThumbnail imageSrc={base64Data} />}
    </div>
  );
};

export default PdfCard;
