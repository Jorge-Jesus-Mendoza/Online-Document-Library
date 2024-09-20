import React, { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  id: string;
  pdfId: string;
  content: string;
  xPosition: number;
  yPosition: number;
  colorCode: string;
  size: number;
  isBold: boolean;
  handleDeleteNote: (id: string) => Promise<void>;
  containerScrollY: number; // Valor del scroll del contenedor
}

const Note = ({
  xPosition,
  yPosition,
  size,
  colorCode,
  content,
  isBold,
  handleDeleteNote,
  id,
  containerScrollY,
}: Props) => {
  const [position, setPosition] = useState({ x: xPosition, y: yPosition });

  // Escuchar cambios en el desplazamiento del contenedor
  useEffect(() => {
    setPosition({
      x: xPosition,
      y: yPosition - containerScrollY, // Ajustar la posición Y con base en el scroll
    });
  }, [containerScrollY, xPosition, yPosition]);

  return (
    <div
      className="flex items-center"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transformOrigin: "top left",
      }}
    >
      <p
        style={{
          fontSize: size,
          color: colorCode,
          fontWeight: isBold ? "bold" : "normal",
        }}
      >
        {content?.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>

      <button onClick={() => handleDeleteNote(id)}>
        <div className="px-5">
          <IoTrashOutline color="red" size={25} />
        </div>
      </button>
    </div>
  );
};

export default Note;
