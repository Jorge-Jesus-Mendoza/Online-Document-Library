"use client";

import React, { useState } from "react";
import PdfRenderer from "./PdfRenderer";
import AnnotationModal from "./AnnotationModal";

interface Props {
  base64: string;
}

const PdfWithAnnotations = ({ base64 }: Props) => {
  const [annotations, setAnnotations] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 100, y: 100 });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSaveAnnotation = (annotation: string) => {
    setAnnotations((prevAnnotations) => [...prevAnnotations, annotation]);
    toggleModal(); // Cerrar el modal después de guardar
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

  return (
    <div className="w-full flex justify-center">
      {/* Componente que muestra el PDF */}
      <PdfRenderer base64={base64}>
        <button onClick={handleOpenModal}>Abrir Anotaciones</button>
      </PdfRenderer>

      {/* Modal de anotaciones fuera del contenedor del PDF */}
      {showModal && (
        <AnnotationModal
          onClose={toggleModal}
          onSave={handleSaveAnnotation}
          initialPosition={modalPosition}
        />
      )}

      {/* Mostrar las anotaciones guardadas */}
      <div className="annotations-list">
        {annotations.map((annotation, index) => (
          <p key={index}>{annotation}</p>
        ))}
      </div>
    </div>
  );
};

export default PdfWithAnnotations;
