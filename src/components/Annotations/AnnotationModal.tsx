"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { Resizable } from "re-resizable";
import { addNote } from "@/actions/pdfActions/actions";
import { useRouter } from "next/navigation";
import AnnotationArea from "./AnnotationArea";
import disableScroll from "disable-scroll";

type HighlightArea = {
  height: number;
  left: number;
  pageIndex: number;
  top: number;
  width: number;
};

interface AnnotationModalProps {
  viewerRef: React.MutableRefObject<any>;
  onClose: () => void;
  pdfId: string;
  initialPosition?: { x: number; y: number }; // Haz que initialPosition sea opcional
  currentPage: number;
  highlightAreas: HighlightArea[];
  quote: string;
  scale: number;
}

const AnnotationModal = memo(
  ({
    onClose,
    initialPosition = { x: 100, y: 100 },
    pdfId,
    currentPage,
    highlightAreas,
    quote,
    scale,
    viewerRef,
  }: AnnotationModalProps) => {
    const [annotations, setAnnotations] = useState<string>("");
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState({ width: 600, height: 200 });
    const [draggingMode, setDraggingMode] = useState(false);
    const scrollOffset = useRef<number>(window.scrollY);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // Almacena el desplazamiento entre clic y modal
    const router = useRouter();
    const [Color, setColor] = useState<string>(
      localStorage.getItem("theme") === "dark" ? "#FFFFFF" : "#000000"
    );
    const [isBold, setIsBold] = useState<boolean>(false);
    const [FontSize, setFontSize] = useState<number>(12);

    const updatePosition = (x: number, y: number) => {
      setPosition({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (draggingMode) {
        const deltaX = (e.clientX - dragOffset.current.x) / (6 * scale);
        const deltaY = (e.clientY - dragOffset.current.y) / (8.5 * scale);

        setPosition((prevPosition) => ({
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY,
        }));

        dragOffset.current = {
          x: e.clientX,
          y: e.clientY,
        };
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

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest(".modal-header")) {
        const modalRect = target.closest("div")?.getBoundingClientRect();
        if (modalRect) {
          dragOffset.current = {
            x: e.clientX,
            y: e.clientY,
          };
        }
        setDraggingMode(true);
        disableScroll.on(); // Deshabilitar scroll
      }
    };

    const handleMouseUp = () => {
      if (draggingMode) {
        setDraggingMode(false);
        disableScroll.off(); // Rehabilitar scroll
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && draggingMode) {
        setDraggingMode(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mousedown", handleMouseDown); // Cambiado de "click" a "mousedown"
      document.addEventListener("mouseup", handleMouseUp); // Escuchar el mouseup para detener el arrastre
      document.addEventListener("keydown", handleEscapeKey);
      window.addEventListener("scroll", handleScroll);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("keydown", handleEscapeKey);
        window.removeEventListener("scroll", handleScroll);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggingMode, position]);

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

      context.font = `${isBold ? "bold" : "normal"} ${fontSize}px sans-serif`;
      const adjustedMaxWidth = maxWidth - 48;

      const words = text.split(" ");
      let currentLine = "";
      let formattedText = "";

      words.forEach((word, index) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testLineWidth = context.measureText(testLine).width;

        if (testLineWidth > adjustedMaxWidth) {
          formattedText += currentLine.trim() + "\n";
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

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

        const screenWidth = window.innerWidth; // El ancho de la pantalla en píxeles
        const screenHeight = window.innerHeight; // El ancho de la pantalla en píxeles
        const WidthPercentage = (size.width / screenWidth) * 100;
        const heightPercentage = (size.height / screenHeight) * 100;

        const parsedAreas = [
          {
            left: position.x,
            top: position.y,
            height: heightPercentage / 3,
            width: WidthPercentage * 2.2,
            pageIndex: highlightAreas[0].pageIndex,
          },
        ];

        const note = await addNote(
          pdfId,
          annotations,
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

    return (
      <div
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          zIndex: 1000,
          padding: "10px",
          boxSizing: "border-box",
          position: "absolute",
        }}
        onClick={handleClickInComponent}
      >
        <AnnotationArea
          size={size}
          handleResize={handleResize}
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
      </div>
    );
  }
);

AnnotationModal.displayName = "AnnotationModal";

export default AnnotationModal;
