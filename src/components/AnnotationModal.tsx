import React, { useState, useRef, useEffect, memo } from "react";
import { Resizable } from "re-resizable";

interface AnnotationModalProps {
  onClose: () => void;
  onSave: (annotation: string) => void;
  initialPosition: { x: number; y: number };
}

const AnnotationModal = memo(
  ({ onClose, onSave, initialPosition }: AnnotationModalProps) => {
    const [annotations, setAnnotations] = useState<string>("");
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState({ width: 300, height: 200 });
    const isDragging = useRef(false);
    const lastMousePosition = useRef<{ x: number; y: number }>({
      x: initialPosition.x,
      y: initialPosition.y,
    });
    const frameId = useRef<number | null>(null);

    const handleSave = () => {
      if (annotations.trim() !== "") {
        onSave(annotations);
      }
      onClose();
    };

    const handleResize = (e: any, direction: any, ref: any, d: any) => {
      setSize({
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      });
    };

    const updatePosition = (x: number, y: number) => {
      setPosition({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        lastMousePosition.current = {
          x: e.clientX - size.width / 2,
          y: e.clientY - 20,
        };
        if (!frameId.current) {
          frameId.current = requestAnimationFrame(() => {
            updatePosition(
              lastMousePosition.current.x,
              lastMousePosition.current.y
            );
            frameId.current = null; // Reset the frame ID
          });
        }
      }
    };

    const handleMouseDown = () => {
      isDragging.current = true;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
        frameId.current = null;
      }
    };

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, []);

    return (
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 1000,
          border: "1px solid black",
          backgroundColor: "white",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <Resizable
          size={size}
          onResizeStop={handleResize}
          minWidth={200}
          minHeight={100}
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
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
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
      </div>
    );
  }
);

AnnotationModal.displayName = "AnnotationModal";

export default AnnotationModal;
