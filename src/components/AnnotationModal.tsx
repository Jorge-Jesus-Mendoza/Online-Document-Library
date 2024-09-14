"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { Resizable } from "re-resizable";
import { addNote } from "@/actions/pdfActions/actions";
import { useRouter } from "next/navigation";
import AnotationArea from "./AnotationArea";

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
    const [annotations, setAnnotations] = useState<string>("");
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState({ width: 300, height: 200 });
    const [draggingMode, setDraggingMode] = useState(false);
    const lastMousePosition = useRef<{ x: number; y: number }>(initialPosition);
    const frameId = useRef<number | null>(null);
    const scrollOffset = useRef<number>(window.scrollY);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // Almacena el desplazamiento entre clic y modal
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
        const mouseX = e.clientX - dragOffset.current.x;
        const mouseY = e.clientY - dragOffset.current.y + scrollOffset.current;

        lastMousePosition.current = {
          x: mouseX,
          y: mouseY,
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

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && draggingMode) {
        setDraggingMode(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("keydown", handleEscapeKey); // Añadir evento keydown para la tecla Escape
      window.addEventListener("scroll", handleScroll);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("click", handleDocumentClick);
        document.removeEventListener("keydown", handleEscapeKey); // Remover evento keydown
        window.removeEventListener("scroll", handleScroll);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggingMode, position]);

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Solo activar el draggingMode si el clic es en el div con la clase 'modal-header'
      if (target.closest(".modal-header")) {
        const modalRect = target.closest("div")?.getBoundingClientRect();
        if (modalRect) {
          // Calcular desplazamiento del clic respecto al modal
          dragOffset.current = {
            x: e.clientX - modalRect.left,
            y: e.clientY - modalRect.top,
          };
        }
        setDraggingMode((prev) => !prev);
      }
    };

    const handleClickInComponent = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation(); // Evitar que el clic se propague al document
    };

    const handleSaveAnnotation = async () => {
      if (annotations.trim() !== "") {
        const modalHeaderHeight = 30;
        const paddingLeft = 10;
        const paddingTop = 10;

        const adjustedX = position.x + paddingLeft;
        const adjustedY = position.y + modalHeaderHeight + paddingTop;

        const note = await addNote(pdfId, annotations, adjustedX, adjustedY);
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
          padding: "10px",
          boxSizing: "border-box",
          position: "absolute",
        }}
        onClick={handleClickInComponent}
      >
        <Resizable
          size={size}
          onResizeStop={handleResize}
          minWidth={600}
          minHeight={100}
        >
          <AnotationArea
            onClose={onClose}
            annotations={annotations}
            handleSaveAnnotation={handleSaveAnnotation}
            onChange={setAnnotations}
          />
        </Resizable>
      </div>
    );
  }
);

AnnotationModal.displayName = "AnnotationModal";

export default AnnotationModal;
