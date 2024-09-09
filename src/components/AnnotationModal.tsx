"use client";

import { useState } from "react";
import Draggable from "react-draggable"; // Para mover el modal
import { Resizable } from "re-resizable"; // Para redimensionar el modal

interface AnnotationModalProps {
  onClose: () => void;
  onSave: (annotation: string) => void; // Callback para guardar la anotación
  initialPosition: { x: number; y: number }; // Posición inicial
}

const AnnotationModal = ({
  onClose,
  onSave,
  initialPosition,
}: AnnotationModalProps) => {
  const [annotations, setAnnotations] = useState<string>("");
  const [position, setPosition] = useState(initialPosition); // Posición inicial basada en prop
  const [size, setSize] = useState({ width: 300, height: 200 });

  const handleSave = () => {
    if (annotations.trim() !== "") {
      onSave(annotations); // Guarda la anotación usando la función recibida como prop
    }
    onClose(); // Cierra el modal después de guardar
  };

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleResize = (e: any, direction: any, ref: any, d: any) => {
    setSize({
      width: ref.style.width ? parseInt(ref.style.width) : size.width,
      height: ref.style.height ? parseInt(ref.style.height) : size.height,
    });
  };

  return (
    <Draggable
      handle=".modal-header"
      onStop={handleDrag}
      defaultPosition={position}
    >
      <Resizable
        size={{ width: size.width, height: size.height }}
        onResizeStop={handleResize} // Cambiado a onResizeStop para evitar recalculación continua
        minWidth={200}
        minHeight={100}
        style={{
          border: "1px solid black",
          backgroundColor: "white",
          padding: "10px",
          boxSizing: "border-box",
          position: "absolute",
          zIndex: 1000, // Para asegurarse de que el modal esté siempre por encima
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <div
            className="modal-header"
            style={{
              cursor: "move",
              backgroundColor: "#f0f0f0",
              padding: "5px",
              display: "flex",
              justifyContent: "space-between",
              color: "black",
            }}
          >
            <h3>Anotaciones</h3>
            <button onClick={onClose} style={{ cursor: "pointer" }}>
              Cerrar
            </button>
          </div>
          <textarea
            value={annotations}
            onChange={(e) => setAnnotations(e.target.value)}
            style={{
              width: "100%",
              height: "80%",
              marginTop: "10px",
              boxSizing: "border-box",
              color: "black",
            }}
            placeholder="Escribe tus anotaciones aquí..."
          />
          <button
            onClick={handleSave}
            style={{ marginTop: "10px", cursor: "pointer", color: "black" }}
          >
            Guardar
          </button>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default AnnotationModal;
