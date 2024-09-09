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

  return (
    <div className="w-full flex justify-center">
      <div className="toolbar">
        <button onClick={toggleModal}>Abrir Anotaciones</button>
      </div>

      {/* Componente que muestra el PDF */}
      <PdfRenderer base64={base64} />

      {/* Componente que maneja las anotaciones */}
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
