"use client";

import { handleSubmitFile } from "@/helpers/helpers";
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
    <div className="flex gap-3">
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
          } my-2 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
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
    </div>
  );
};

export default Form;
