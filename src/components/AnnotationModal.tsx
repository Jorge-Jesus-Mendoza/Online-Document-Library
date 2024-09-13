"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { Resizable } from "re-resizable";
import { addNote } from "@/actions/pdfActions/actions";
import { useRouter } from "next/navigation";

interface AnnotationModalProps {
  onClose: () => void;
  pdfId: string;
  initialPosition?: { x: number; y: number }; // Haz que initialPosition sea opcional
}

const AnnotationModal = memo(
  ({
    onClose,
    initialPosition = { x: 100, y: 100 },
    pdfId,
  }: AnnotationModalProps) => {
    // Se asegura de que siempre haya un valor predeterminado para initialPosition
    const [annotations, setAnnotations] = useState<string>("");
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState({ width: 300, height: 200 });
    const [draggingMode, setDraggingMode] = useState(false);
    const lastMousePosition = useRef<{ x: number; y: number }>(initialPosition);
    const frameId = useRef<number | null>(null);
    const scrollOffset = useRef<number>(window.scrollY);
    const router = useRouter();

    const handleSave = () => {
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
      if (draggingMode) {
        lastMousePosition.current = {
          x: e.clientX - size.width / 2,
          y: e.clientY - 20 + scrollOffset.current,
        };
        if (!frameId.current) {
          frameId.current = requestAnimationFrame(() => {
            updatePosition(
              lastMousePosition.current.x,
              lastMousePosition.current.y
            );
            frameId.current = null;
          });
        }
      }
    };

    const handleScroll = () => {
      if (draggingMode) {
        const newScrollY = window.scrollY;
        const scrollDiff = newScrollY - scrollOffset.current;
        scrollOffset.current = newScrollY;
        updatePosition(position.x, position.y + scrollDiff);
      }
    };

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleDocumentClick);
      window.addEventListener("scroll", handleScroll);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("click", handleDocumentClick);
        window.removeEventListener("scroll", handleScroll);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggingMode, position]);

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Solo activar el draggingMode si el clic es en el div con la clase 'modal-header'
      if (target.closest(".modal-header")) {
        setDraggingMode((prev) => !prev);
      }
    };

    const handleClickInComponent = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation(); // Evitar que el clic se propague al document
    };

    const handleSaveAnnotation = async () => {
      if (annotations.trim() !== "") {
        const note = await addNote(pdfId, annotations, position.x, position.y);
        if (note) {
          onClose();
          router.refresh();
        }
      }
    };

    return (
      <div
        style={{
          left: position.x,
          top: position.y,
          zIndex: 1000,
          border: "1px solid black",
          backgroundColor: "white",
          padding: "10px",
          boxSizing: "border-box",
          position: "absolute",
        }}
        onClick={handleClickInComponent}
      >
        <Resizable
          size={size}
          onResizeStop={handleResize}
          minWidth={200}
          minHeight={100}
        >
          <div
            style={{ width: "100%", height: "100%", backgroundColor: "white" }}
          >
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
            <span className="bg-white text-slate-900">
              {JSON.stringify(position)}
            </span>
            <button
              onClick={handleSaveAnnotation}
              style={{
                marginTop: "10px",
                cursor: "pointer",
                color: "black",
                backgroundColor: "white",
              }}
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
