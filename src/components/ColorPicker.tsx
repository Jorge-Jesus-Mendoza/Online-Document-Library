"use client";

import { IoColorPalette } from "react-icons/io5";
import { useRef } from "react";

interface Props {
  onChange: (value: React.SetStateAction<string>) => void;
  Color: string;
}

const ColorPicker = ({ Color, onChange }: Props) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleColorPickerClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click(); // Simula el clic en el input de color
    }
  };

  return (
    <div className="inline-flex justify-center items-center relative">
      {/* Input de color oculto fuera de la vista */}
      <input
        id="nativeColorPicker1"
        type="color"
        ref={colorInputRef}
        value={Color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute opacity-0 w-0 h-0" // Lo hacemos invisible, pero mantiene su posición
      />

      {/* Botón con el icono de la paleta de colores */}
      <button
        type="button"
        className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
        onClick={handleColorPickerClick} // Abrimos el input de color al hacer clic en el icono
      >
        <IoColorPalette size={20} />
      </button>
    </div>
  );
};

export default ColorPicker;
