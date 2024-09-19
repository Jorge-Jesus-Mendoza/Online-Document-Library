"use client";

import { PageLayout, Viewer } from "@react-pdf-viewer/core";
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
  scale: number;
}

const PdfRenderer = memo(
  ({
    base64,
    children,
    zoomPluginInstance,
    pageNavigationPluginInstance,
    ShowViewer,
    handlePageChange,
    scale,
  }: Props) => {
    const pdfData = `data:application/pdf;base64,${base64}`;
    const router = useRouter();

    const pageLayout: PageLayout = {
      transformSize: ({ size }) => ({
        height: 840,
        width: 586,
      }),
    };

    useEffect(() => {
      if (!ShowViewer) {
        router.push("/");
      }
    }, [ShowViewer, router]);

    return (
      <div className="w-full h-full">
        {children}

        {/* <div className="fixed flex w-full bg-green-300 justify-center z-10">
          <CurrentPageInput />
          <GoToFirstPage />
          <button onClick={() => jumpToNextPage()}>Test</button>
        </div> */}
        <div className="mt-10">
          {ShowViewer && (
            <div className="pdf-viewer-container " style={{ height: "100vh" }}>
              <Viewer
                fileUrl={pdfData}
                plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
                defaultScale={1.5}
                onPageChange={handlePageChange}
                // pageLayout={pageLayout}
                theme={{
                  theme: "dark",
                }}
                enableSmoothScroll
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Definir el nombre de pantalla para el componente
PdfRenderer.displayName = "PdfRenderer";

export default PdfRenderer;
