import React from "react";

interface Props {
  id: string;
  pdfId: string;
  content: string;
  colorCode: string;
  size: number;
  isBold: boolean;
  handleDeleteNote: (id: string) => Promise<void>;
}

const Note = ({ size, colorCode, content, isBold }: Props) => {
  return (
    <p
      className=" p-10 mt-5"
      style={{
        fontSize: size,
        color: colorCode,
        fontWeight: isBold ? "bold" : "normal",
        userSelect: "none",
      }}
    >
      {content?.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </p>
  );
};

export default Note;
