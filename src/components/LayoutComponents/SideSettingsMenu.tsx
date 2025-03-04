import React, { useEffect, useRef, useState } from "react";
import { IoIosOptions } from "react-icons/io";
import AudioPlayer from "../AudioPlayerComponents/AudioPlayer";
import { signIn, signOut } from "next-auth/react";
import SpotifyPlayer from "../Spotify/SpotifyPlayer";
import { getUserServerSession } from "@/actions/authActions/auth-actions";

interface Props {
  pdfBase64: string;
  jumpToPage: (pageIndex: number) => void;
  user:
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        roles?: string[];
        id?: string;
        sub?: string;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        iat?: number;
        exp?: number;
        jti?: number;
      }
    | undefined;
}

const SideSettingsMenu = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Referencia al menú lateral
  const audioFile = "/Chopin-Nocturne-op.9-No.2.mp3";

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
        className="inline-flex items-center p-2 mt-2 mr-6 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <IoIosOptions size={40} />
      </button>

      {/* Menú lateral (aside) */}
      <aside
        ref={menuRef} // Asignamos la referencia al menú
        className={`fixed top-0 right-0 z-40 w-80 h-screen transition-transform transform bg-gray-100 dark:bg-gray-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        {/* <div className="h-full w-full p-5 overflow-y-auto">
          <AudioPlayer audioFile={audioFile} />
        </div> */}

        {/* <button
          type="button"
          onClick={() =>
            signIn("spotify", {
              redirect: true,
            })
          }
          className="my-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Iniciar sesión con Spotify
        </button> */}
        {!user ? (
          <button
            type="button"
            onClick={() => signIn("spotify")}
            className="my-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Iniciar sesión con Spotify
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => signOut()}
              className="my-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Cerrar sesión
            </button>

            {/* <SpotifyPlayer token={user?.accessToken || ""} /> */}
            <br />
            <span className="text-gray-100">{JSON.stringify(user)}</span>
          </>
        )}
      </aside>
    </div>
  );
};

export default SideSettingsMenu;
