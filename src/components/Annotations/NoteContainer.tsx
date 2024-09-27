"use client";

import { HighlightArea } from "@react-pdf-viewer/highlight";
import React, { useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  cssProperties(area: HighlightArea, rotation: number): React.CSSProperties;
  area: any;
  rotation: number;
  children: JSX.Element;
  handleDeleteNote: (id: string) => Promise<void>;
  id: string;
}
const NoteContainer = ({
  cssProperties,
  area,
  rotation,
  children,
  handleDeleteNote,
  id,
}: Props) => {
  const [showNote, setShowNote] = useState<boolean>(true);
  const styles = cssProperties(area, rotation);
  return (
    <div
      className="z-50 flex w-full"
      style={{
        height: styles.height,
        position: styles.position,
        top: styles.top,
        left: styles.left,
        width: styles.width,
      }}
    >
      {showNote && (
        <div className=" overflow-y-auto overflow-x-auto">{children}</div>
      )}

      <div className="flex justify-center items-center">
        <div>
          <button
            className="inline-flex justify-center items-center  text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={() => handleDeleteNote(id)}
          >
            <IoTrashOutline className="m-2" size={25} />
          </button>
        </div>
        <div>
          <button
            className="inline-flex justify-center items-center  text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={() => setShowNote(!showNote)}
          >
            {showNote ? (
              <PiEyeClosed className="m-2" size={25} />
            ) : (
              <PiEye className="m-2" size={25} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteContainer;
