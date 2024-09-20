"use client";

import {
  Button,
  PageLayout,
  Tooltip,
  Position,
  Viewer,
} from "@react-pdf-viewer/core";
import { ZoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "pdfjs-dist/legacy/build/pdf.worker.entry";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { memo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  highlightPlugin,
  MessageIcon,
  RenderHighlightTargetProps,
  HighlightArea,
} from "@react-pdf-viewer/highlight";

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

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
      <div
        style={{
          background: "#eee",
          display: "flex",
          position: "absolute",
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          transform: "translate(0, 8px)",
          zIndex: 1,
        }}
      >
        <Tooltip
          position={Position.TopCenter}
          target={
            <Button onClick={props.toggle}>
              <MessageIcon />
            </Button>
          }
          content={() => <div style={{ width: "100px" }}>Add a note</div>}
          offset={{ left: 0, top: -8 }}
        />
      </div>
    );

    const highlightPluginInstance = highlightPlugin({ renderHighlightTarget });

    return (
      <div className="w-full h-full">
        {children}
        {ShowViewer && (
          <div
            className="pdf-viewer-container"
            style={{ height: "100vh", overflow: "auto" }}
          >
            <Viewer
              fileUrl={pdfData}
              plugins={[
                zoomPluginInstance,
                pageNavigationPluginInstance,
                highlightPluginInstance,
              ]}
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
    );
  }
);

// Definir el nombre de pantalla para el componente
PdfRenderer.displayName = "PdfRenderer";

export default PdfRenderer;
