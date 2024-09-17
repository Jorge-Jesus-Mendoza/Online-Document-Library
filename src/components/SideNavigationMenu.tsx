import React, { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import PdfThumbnailsNavigation from "./PdfThumbnailsNavigation";

interface Props {
  pdfBase64: string;
}

const SideNavigationMenu = ({ pdfBase64 }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Referencia al menú lateral

  // Función para alternar la visibilidad del menú lateral
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Detecta clics fuera del menú y lo cierra
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Cerrar el menú si se hace clic fuera de este
    }
  };

  useEffect(() => {
    // Añadir el event listener al montar el componente
    document.addEventListener("pointerdown", handleClickOutside); // pointerdown puede ser más confiable

    // Eliminar el event listener al desmontar el componente
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Botón para abrir/cerrar el menú */}
      <button
        onClick={toggleMenu}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <GiHamburgerMenu size={40} />
      </button>

      {/* Menú lateral (aside) */}
      <aside
        ref={menuRef} // Asignamos la referencia al menú
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform transform bg-gray-50 dark:bg-gray-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full w-full p-5 overflow-y-auto">
          <PdfThumbnailsNavigation pdfSrc={pdfBase64} />
        </div>
      </aside>
    </div>
  );
};

export default SideNavigationMenu;
