"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { Resizable } from "re-resizable";
import { addNote } from "@/actions/pdfActions/actions";
import { useRouter } from "next/navigation";
import AnnotationArea from "./AnnotationArea";

type HighlightArea = {
  height: number;
  left: number;
  pageIndex: number;
  top: number;
  width: number;
};

interface AnnotationModalProps {
  onClose: () => void;
  pdfId: string;
  initialPosition?: { x: number; y: number }; // Haz que initialPosition sea opcional
  currentPage: number;
  highlightAreas: HighlightArea[];
  quote: string;
}

const AnnotationModal = memo(
  ({
    onClose,
    initialPosition = { x: 100, y: 100 },
    pdfId,
    currentPage,
    highlightAreas,
    quote,
  }: AnnotationModalProps) => {
    const [annotations, setAnnotations] = useState<string>("");
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState({ width: 600, height: 300 });
    const [draggingMode, setDraggingMode] = useState(false);
    const lastMousePosition = useRef<{ x: number; y: number }>(initialPosition);
    const frameId = useRef<number | null>(null);
    const scrollOffset = useRef<number>(window.scrollY);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // Almacena el desplazamiento entre clic y modal
    const router = useRouter();
    const [Color, setColor] = useState<string>("#000000");
    const [isBold, setIsBold] = useState<boolean>(false);
    const [FontSize, setFontSize] = useState<number>(12);

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

    const handleResize = (e: any, direction: any, ref: any, d: any) => {
      setSize({
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      });
    };

    const wrapTextToTextarea = (
      text: string,
      maxWidth: number,
      fontSize: number,
      isBold: boolean
    ) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("No se pudo obtener el contexto del canvas");
      }

      // Configurar la fuente para el canvas basándonos en el tamaño y el estilo
      context.font = `${isBold ? "bold" : "normal"} ${fontSize}px sans-serif`;
      const adjustedMaxWidth = maxWidth - 48;

      const words = text.split(" ");
      let currentLine = "";
      let formattedText = "";

      words.forEach((word, index) => {
        // Probar la nueva línea con la palabra actual
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testLineWidth = context.measureText(testLine).width;

        // Si la línea excede el ancho máximo, agrega un salto de línea
        if (testLineWidth > adjustedMaxWidth) {
          formattedText += currentLine.trim() + "\n"; // Agrega la línea con salto
          currentLine = word; // Iniciar una nueva línea con la palabra actual
        } else {
          currentLine = testLine; // Si cabe en la línea, continúa con la misma
        }
      });

      // Añadir la última línea
      if (currentLine) {
        formattedText += currentLine.trim();
      }

      return formattedText;
    };

    const handleSaveAnnotation = async () => {
      if (annotations.trim() !== "") {
        const formattedText = wrapTextToTextarea(
          annotations,
          size.width,
          FontSize,
          isBold
        );

        const parsedAreas = [
          {
            left: position.x,
            top: position.y,
            height: highlightAreas[0].height,
            width: highlightAreas[0].width,
            pageIndex: highlightAreas[0].pageIndex,
          },
        ];

        const note = await addNote(
          pdfId,
          formattedText,
          FontSize,
          Color,
          isBold,
          currentPage,
          parsedAreas,
          quote
        );
        if (note) {
          onClose();
          router.refresh();
        }
      }
    };

    console.log("🚀 ~ handleSaveAnnotation ~ highlightAreas:", highlightAreas);
    console.log("🚀 ~ renderHighlightContent ~ currentPage:", currentPage);

    return (
      <div
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          // left: `${initialPosition.x}%`,
          // top: `${initialPosition.y}%`,
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
          {/* <span className="text-purple-300">{JSON.stringify(position)}</span> */}
          <AnnotationArea
            onClose={onClose}
            isBold={isBold}
            setColor={setColor}
            Color={Color}
            FontSize={FontSize}
            setFontSize={setFontSize}
            setIsBold={setIsBold}
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
