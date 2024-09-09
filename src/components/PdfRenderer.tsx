"use client";

import { Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "pdfjs-dist/legacy/build/pdf.worker.entry";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { useCallback, useState, memo, useEffect } from "react";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import AnnotationModal from "./AnnotationModal";

interface Props {
  base64: string;
}

const PdfRenderer = memo(({ base64 }: Props) => {
  const [scale, setScale] = useState<number>(1);
  const [ShowViewer, setShowViewer] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pdfData = `data:application/pdf;base64,${base64}`;
  const zoomPluginInstance = zoomPlugin();
  const router = useRouter();
  const { zoomTo } = zoomPluginInstance;
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSaveAnnotation = (text: string) => {
    console.log("Anotación guardada:", text);
    // Aquí podrías manejar cómo se guardan las anotaciones
  };

  const pageNavigationPluginInstance = pageNavigationPlugin();

  const handlePageChange = useCallback((e: { currentPage: number }) => {
    setCurrentPage(e.currentPage + 1);
  }, []);

  // Función para aplicar el zoom con debounce
  const debouncedZoomTo = useCallback(
    debounce((scale: number) => {
      zoomTo(scale);
    }, 300),
    [zoomTo]
  );

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Number(event.target.value);
    if (newScale < 0.5 || newScale > 2) return; // Validar rango
    setScale(newScale);
    debouncedZoomTo(newScale);
  };

  useEffect(() => {
    if (!ShowViewer) {
      router.push("/");
    }
  }, [ShowViewer, router]);

  return (
    <div className="w-4/6 bg-blue-300">
      <div className="flex justify-center">
        <div className="flex bg-red-400 fixed mb-10 z-10">
          <button onClick={() => setShowViewer(false)} className="mx-5">
            Inicio
          </button>
          <button onClick={toggleModal}>Abrir Anotaciones</button>

          <input
            type="range"
            min="0.5"
            max="2"
            className="bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            step="0.1"
            value={scale}
            onChange={handleZoomChange}
            aria-label="Zoom level"
          />
          <input
            type="number"
            onChange={handleZoomChange}
            value={scale}
            min={0.5}
            max={2}
            step="0.1"
            aria-label="Zoom level input"
            style={{ color: "black" }}
          />
          <p>Página actual: {currentPage}</p>
        </div>
      </div>
      <div className="mt-10">
        {ShowViewer && (
          <>
            {showModal && (
              <AnnotationModal
                onClose={toggleModal}
                onSave={handleSaveAnnotation}
                initialPosition={{ x: 100, y: 100 }} // Añadido initialPosition
              />
            )}
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
});

// Definir el nombre de pantalla para el componente
PdfRenderer.displayName = "PdfRenderer";

export default PdfRenderer;
