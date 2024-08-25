import React from "react";
import PdfThumbnail from "./PdfThumbnail";

interface Props {
  id: number;
  name: string;
  mimeType: string;
  data: Buffer;
  createdAt: Date;
  lastAccess: Date | null;
}

const PdfCard = ({ name, data, lastAccess }: Props) => {
  function truncateText(text: string, maxLength: number) {
    if (text && text.length > maxLength) {
      return `${text.substring(0, maxLength - 3)}...`;
    }
    return text;
  }

  const base64Data = data?.toString("base64") || undefined;
  return (
    <div className="border border-spacing-5 bor tumbnail-card">
      <span>{truncateText(name, 25)}</span>
      <PdfThumbnail imageSrc={base64Data} />
    </div>
  );
};

export default PdfCard;
