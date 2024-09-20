import React from "react";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  id: string;
  pdfId: string;
  content: string;
  colorCode: string;
  size: number;
  isBold: boolean;
  handleDeleteNote: (id: string) => Promise<void>;
}

const Note = ({
  size,
  colorCode,
  content,
  isBold,
  handleDeleteNote,
  id,
}: Props) => {
  return (
    <div
      className="flex items-center"
      style={{
        position: "absolute",
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
