"use client";

import { Button, Tooltip, Position, Viewer } from "@react-pdf-viewer/core";
import { ZoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "pdfjs-dist/legacy/build/pdf.worker.entry";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import React, { memo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  highlightPlugin,
  MessageIcon,
  RenderHighlightTargetProps,
  RenderHighlightContentProps,
  RenderHighlightsProps,
} from "@react-pdf-viewer/highlight";
import AnnotationModal from "./Annotations/AnnotationModal";
import { deleteNote } from "@/actions/pdfActions/actions";
import Note from "./Annotations/Note";
import NoteContainer from "./Annotations/NoteContainer";
import { ThemePlugin } from "@react-pdf-viewer/theme";
import { ThemeContext } from "@react-pdf-viewer/core";

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
  scale: number;

  children: JSX.Element;
  currentPage: number;
  zoomPluginInstance: ZoomPlugin;
  pageNavigationPluginInstance: PageNavigationPlugin;
  themePluginInstance: ThemePlugin;
  currentTheme: string;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
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
    scale,
    themePluginInstance,
    currentTheme,
    setCurrentTheme,
  }: Props) => {
    const pdfData = `data:application/pdf;base64,${base64}`;
    const router = useRouter();
    const viewerRef = useRef<any>(null);
    const { SwitchThemeButton } = themePluginInstance;
    const themeContext = { currentTheme, setCurrentTheme };

    useEffect(() => {
      if (!ShowViewer) {
        router.push("/");
      }
    }, [ShowViewer, router]);

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
      <div
        style={{
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
          viewerRef={viewerRef}
          onClose={onClose}
          scale={scale}
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
                  <NoteContainer
                    key={idx}
                    cssProperties={props.getCssProperties}
                    area={area}
                    rotation={props.rotation}
                    id={note.id}
                    handleDeleteNote={handleDeleteNote}
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
                  </NoteContainer>
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
      <div className="w-full h-full" ref={viewerRef}>
        {children}
        {ShowViewer && (
          <div
            className="pdf-viewer-container"
            style={{
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexWrap: "nowrap",
            }}
          >
            <ThemeContext.Provider value={themeContext}>
              <Viewer
                fileUrl={pdfData}
                plugins={[
                  themePluginInstance,
                  zoomPluginInstance,
                  pageNavigationPluginInstance,
                  highlightPluginInstance,
                ]}
                defaultScale={scale}
                onPageChange={handlePageChange}
                theme={currentTheme}
                enableSmoothScroll
              />
            </ThemeContext.Provider>
          </div>
        )}
      </div>
    );
  }
);

// Definir el nombre de pantalla para el componente
PdfRenderer.displayName = "PdfRenderer";

export default PdfRenderer;
