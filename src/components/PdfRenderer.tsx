"use client";

import {
  Button,
  PageLayout,
  Tooltip,
  Position,
  Viewer,
  PrimaryButton,
} from "@react-pdf-viewer/core";
import { ZoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "pdfjs-dist/legacy/build/pdf.worker.entry";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import React, { memo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  highlightPlugin,
  MessageIcon,
  RenderHighlightTargetProps,
  HighlightArea,
  RenderHighlightContentProps,
  RenderHighlightsProps,
} from "@react-pdf-viewer/highlight";
import AnnotationModal from "./Annotations/AnnotationModal";
import { deleteNote } from "@/actions/pdfActions/actions";
import Note from "./Annotations/Note";

type note = {
  id: string;
  pdfId: string;
  content: string;
  createdAt: Date;
  colorCode: string;
  size: number;
  page: number;
  isBold: boolean;
  quote: string;
  highlightAreas: any;
};
interface Props {
  base64: string;
  pdfId: string;
  notes: note[];

  children: JSX.Element;
  currentPage: number;
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
    pdfId,
    currentPage,
    notes,
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

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
      const onClose = () => {
        props.cancel();
      };

      return (
        <AnnotationModal
          onClose={onClose}
          pdfId={pdfId}
          quote={props.selectedText}
          initialPosition={{
            x: props.selectionRegion.left,
            y: props.selectionRegion.top,
          }}
          highlightAreas={props.highlightAreas}
          currentPage={currentPage}
        />
      );
    };

    const renderHighlights = (props: RenderHighlightsProps) => {
      const handleDeleteNote = async (id: string) => {
        await deleteNote(id);
        router.refresh();
      };
      return (
        <div>
          {notes.map((note) => (
            <React.Fragment key={note.id}>
              {note.highlightAreas
                // Filter all highlights on the current page
                .filter((area: any) => area.pageIndex === props.pageIndex)
                .map((area: any, idx: any) => (
                  <div
                    className="bg-red-900 z-50"
                    key={idx}
                    style={Object.assign(
                      {},
                      {
                        // background: "yellow",
                        // opacity: 0.4,
                      },
                      props.getCssProperties(area, props.rotation)
                    )}
                  >
                    <Note
                      handleDeleteNote={handleDeleteNote}
                      colorCode={note.colorCode}
                      content={note.content}
                      id={note.id}
                      isBold={note.isBold}
                      pdfId={pdfId}
                      size={note.size}
                    />
                  </div>
                ))}
            </React.Fragment>
          ))}
        </div>
      );
    };

    const highlightPluginInstance = highlightPlugin({
      renderHighlightTarget,
      renderHighlightContent,
      renderHighlights,
    });

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
