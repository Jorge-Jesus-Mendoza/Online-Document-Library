"use client";

import React, { useCallback, useState } from "react";
import PdfRenderer from "./PdfRenderer";
import AnnotationModal from "./AnnotationModal";
import { debounce } from "lodash";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

type note = {
  id: string;
  pdfId: string;
  content: string;
  createdAt: Date;
  xPosition: number;
  yPosition: number;
};

interface Props {
  base64: string;
  pdfId: string;
  notes: note[];
}

const PdfWithAnnotations = ({ base64, pdfId, notes }: Props) => {
  const [ShowViewer, setShowViewer] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState<number>(1);
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const { zoomTo } = zoomPluginInstance;

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleOpenModal = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const initialPosition = {
      x: 100, // Mantén una posición fija en X
      y: scrollY + 100, // Usa el scroll actual para ajustar la posición Y
    };

    setModalPosition(initialPosition);
    setShowModal(true);
  };

  const handlePageChange = useCallback((e: { currentPage: number }) => {
    setCurrentPage(e.currentPage + 1);
  }, []);

  // Función para aplicar el zoom con debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedZoomTo = useCallback(
    debounce((scale: number) => {
      zoomTo(scale);
    }, 300),
    [zoomTo]
  );

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); // Evita que el zoom dispare eventos como clic
    const newScale = Number(event.target.value);
    if (newScale < 0.5 || newScale > 2) return; // Validar rango
    setScale(newScale);
    debouncedZoomTo(newScale);
  };

  return (
    <div className="w-full flex justify-center">
      {/* Componente que muestra el PDF */}
      <PdfRenderer
        base64={base64}
        zoomPluginInstance={zoomPluginInstance}
        ShowViewer={ShowViewer}
        handlePageChange={handlePageChange}
        pageNavigationPluginInstance={pageNavigationPluginInstance}
      >
        <div className="flex justify-center">
          <div className="flex bg-red-400 fixed mb-10 z-10">
            <button onClick={() => setShowViewer(false)} className="mx-5">
              Inicio
            </button>
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

            <button onClick={handleOpenModal}>Abrir Anotaciones</button>

            <span>Pagina Actual: {currentPage}</span>
          </div>
        </div>
      </PdfRenderer>

      {/* Modal de anotaciones fuera del contenedor del PDF */}
      {showModal && (
        <AnnotationModal
          onClose={toggleModal}
          initialPosition={modalPosition}
          pdfId={pdfId}
        />
      )}

      {/* Mostrar las anotaciones guardadas */}
      <div className="annotations-list">
        {notes.map((annotation, index) => (
          <p
            key={index}
            style={{
              position: "absolute",
              left: annotation.xPosition * scale, // Escalar la posición en X
              top: annotation.yPosition * scale, // Escalar la posición en Y
              transform: `scale(${scale})`, // Ajustar el tamaño del texto al zoom
              transformOrigin: "top left", // Asegurarse de que el escalado se base en la esquina superior izquierda
            }}
          >
            {annotation.content}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PdfWithAnnotations;
