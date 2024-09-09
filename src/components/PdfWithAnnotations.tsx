"use client";

import React, { useState, useEffect } from "react";
import PdfRenderer from "./PdfRenderer";
import AnnotationModal from "./AnnotationModal";

interface Props {
  base64: string;
}

const PdfWithAnnotations = ({ base64 }: Props) => {
  const [annotations, setAnnotations] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 100, y: 100 });

  // Manejar la apertura del modal
  const toggleModal = () => {
    if (!showModal) {
      // Calcular la posición del scroll y ajustar la posición inicial del modal
      const scrollY = window.scrollY;
      const initialPosition = { x: 100, y: scrollY + 100 }; // Ajustar según sea necesario
      setModalPosition(initialPosition);
    }
    setShowModal(!showModal);
  };

  const handleSaveAnnotation = (annotation: string) => {
    setAnnotations((prevAnnotations) => [...prevAnnotations, annotation]);
    toggleModal(); // Cerrar el modal después de guardar
  };

  useEffect(() => {
    // Opcionalmente, manejar el cierre del modal si el usuario se desplaza
    const handleScroll = () => {
      if (showModal) {
        const scrollY = window.scrollY;
        setModalPosition((prevPosition) => ({
          ...prevPosition,
          y: scrollY + 100,
        }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showModal]);

  return (
    <div className="w-full flex justify-center">
      {/* Componente que muestra el PDF */}
      <PdfRenderer base64={base64}>
        <button onClick={toggleModal}>Abrir Anotaciones</button>
      </PdfRenderer>

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
