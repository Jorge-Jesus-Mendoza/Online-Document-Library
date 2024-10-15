"use client";

import { handleSubmitFile } from "@/helpers/helpers";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>("");
  const [Error, setError] = useState<boolean | null>(false);

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  return (
    <div className="flex gap-3 p-10">
      <div>
        <input
          type="file"
          name="file-input"
          id="file-input"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          className={`${
            !loading && "cursor-pointer"
          } my-2 text-slate-900 dark:text-gray-50 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
file:bg-gray-50 file:border-0
file:me-4
file:py-3 file:px-4
`}
        />
      </div>
      <button
        type="button"
        onClick={() =>
          handleSubmitFile({
            file,
            router,
            setLoading,
            setFile,
            setMessage,
            setError,
          })
        }
        disabled={!file}
        className={`my-2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
          !loading && file
            ? "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            : "bg-gray-400"
        }`}
      >
        {loading ? "Subiendo..." : "Actualizar Catálogo"}
      </button>

      <button
        type="button"
        onClick={() => signIn("spotify")}
        className="my-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Iniciar sesión con Spotify
      </button>

      <button
        type="button"
        onClick={() => signOut()}
        className="my-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Cerrar sesión con Spotify
      </button>
    </div>
  );
};

export default Form;
