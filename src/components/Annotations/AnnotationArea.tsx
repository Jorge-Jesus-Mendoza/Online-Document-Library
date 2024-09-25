"use client";

import React, { useState } from "react";
import ColorPicker from "./ColorPicker";
import { RxTransparencyGrid } from "react-icons/rx";
import { FaBold } from "react-icons/fa";

interface Props {
  annotations: string;
  onChange: (value: React.SetStateAction<string>) => void;
  handleSaveAnnotation: () => Promise<void>;
  onClose: () => void;
  setColor: (value: React.SetStateAction<string>) => void;
  Color: string;
  setIsBold: React.Dispatch<React.SetStateAction<boolean>>;
  isBold: boolean;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  FontSize: number;
}

const AnnotationArea = ({
  annotations,
  onChange,
  handleSaveAnnotation,
  onClose,
  setColor,
  Color,
  setIsBold,
  isBold,
  FontSize,
  setFontSize,
}: Props) => {
  const [isTransparent, setIsTransparent] = useState(false);

  const toggleTransparency = () => {
    setIsTransparent((prev) => !prev);
  };

  const handleSize = (action: string = "") => {
    if (action === "substract" && FontSize !== 1) {
      setFontSize(FontSize - 1);
    } else if (action === "add") {
      setFontSize(FontSize + 1);
    }
  };

  return (
    <div
      className={`w-full mb-4 border border-gray-200 rounded-lg  dark:border-gray-600 ${
        isTransparent ? "bg-transparent" : "bg-gray-50 dark:bg-gray-700"
      }`}
    >
      {/* modal-header class to enable dragginMode */}
      <div
        onScroll={() => console.log("jejeje")}
        className="modal-header flex items-center justify-between px-3 py-2 dark:border-gray-600"
      >
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-500 rounded cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div
        className={`child-div px-4 mx-2 py-2 rounded-lg ${
          isTransparent ? "bg-transparent" : "bg-gray-50 dark:bg-gray-800"
        } rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        // className={`child-div px-4 mx-2 py-2 border border-gray-500 rounded-lg   ${
        //   isTransparent ? "bg-transparent" : "bg-gray-800"
        // }`}
      >
        <label className="sr-only">Your comment</label>
        <textarea
          id="comment"
          value={annotations}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          style={{
            color: Color,
            fontWeight: isBold ? "bold" : "normal",
            fontSize: FontSize,
          }}
          className="w-full px-0 border-0 bg-transparent focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Write a comment..."
          required
        ></textarea>
      </div>
      <div className="flex items-center justify-between px-3 py-2 dark:border-gray-600">
        <button
          onClick={handleSaveAnnotation}
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          Guardar
        </button>
        <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
          {/* Botón de transparencia */}

          <div className="relative flex items-center">
            <button
              type="button"
              id="decrement-button"
              onClick={() => handleSize("substract")}
              data-input-counter-decrement="counter-input"
              className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
            >
              <svg
                className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 2"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h16"
                />
              </svg>
            </button>
            <div className="bg-gray-50  dark:bg-gray-700">
              <input
                type="number"
                className={`custom-number flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center bg-gray-50`}
                placeholder=""
                min={1}
                // onChange={handleChangeSizeFromTextInput}
                onChange={(e) => setFontSize(Number(e.target.value))}
                value={FontSize}
                required
              />
            </div>
            <button
              type="button"
              id="increment-button"
              onClick={() => handleSize("add")}
              data-input-counter-increment="counter-input"
              className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
            >
              <svg
                className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTransparency}
            className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <RxTransparencyGrid size={20} />
          </button>

          <button
            type="button"
            onClick={() => setIsBold(!isBold)}
            className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <FaBold size={20} />
          </button>

          <ColorPicker Color={Color} onChange={setColor} />
        </div>
      </div>
    </div>
  );
};

export default AnnotationArea;
