"use client";

import { Viewer } from "@react-pdf-viewer/core";
import { ZoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "pdfjs-dist/legacy/build/pdf.worker.entry";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { memo, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  base64: string;

  children: JSX.Element;
  zoomPluginInstance: ZoomPlugin;
  pageNavigationPluginInstance: PageNavigationPlugin;
  ShowViewer: boolean;
  handlePageChange: (e: { currentPage: number }) => void;
}

const PdfRenderer = memo(
  ({
    base64,
    children,
    zoomPluginInstance,
    pageNavigationPluginInstance,
    ShowViewer,
    handlePageChange,
  }: Props) => {
    const pdfData = `data:application/pdf;base64,${base64}`;
    const router = useRouter();

    useEffect(() => {
      if (!ShowViewer) {
        router.push("/");
      }
    }, [ShowViewer, router]);

    return (
      <div className="w-4/6 bg-blue-300">
        {children}
        <div className="mt-10">
          {ShowViewer && (
            <>
              <Viewer
                fileUrl={pdfData}
                plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
                defaultScale={1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    );
  }
);

// Definir el nombre de pantalla para el componente
PdfRenderer.displayName = "PdfRenderer";

export default PdfRenderer;
