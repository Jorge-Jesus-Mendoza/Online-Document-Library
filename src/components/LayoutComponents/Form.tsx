"use client";

import { handleSubmitFile } from "@/helpers/helpers";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../../context/SocketContext";
import UserIcon from "../OnlineUsers/UserIcon";
import ThemeToggle from "./ThemeToggle";
import CallNotification from "../OnlineUsers/CallNotification";
import VideoCall from "../OnlineUsers/VideoCallComponents/VideoCall";

interface User {
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

interface Props {
  user: User | undefined;
}

const Form = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>("");
  const [Error, setError] = useState<boolean | null>(false);
  const { OnlineUsers = [], handleCall } = useSocket();

  const userLogged = OnlineUsers?.find((SockUser) => SockUser?.id === user?.id);

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const hasOnlineUsers = OnlineUsers && OnlineUsers?.length > 0;

  return (
    <div className="w-full">
      <div className="px-10 flex justify-between items-center">
        <div className="flex items-center">
          <div className="">
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

          <div className="flex items-center">
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
              className={`my-2 mx-2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                !loading && file
                  ? "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  : "bg-gray-400"
              }`}
            >
              {loading ? "Subiendo..." : "Actualizar Catálogo"}
            </button>

            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    signIn("spotify", {
                      redirect: true,
                    })
                  }
                  className="my-2 mx-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Iniciar sesión con Spotify
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      signIn("twitch");
                    } catch (error) {
                      console.log("error twitch: " + error);
                    }
                  }}
                  className="my-2 mx-2 text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Iniciar sesión con Twitch
                </button>

                <button
                  type="button"
                  onClick={() =>
                    signIn("github", {
                      redirect: true,
                    })
                  }
                  className="my-2 mx-2 text-white bg-slate-500 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Iniciar sesión con Github
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="my-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-5">
          <ThemeToggle iconSize={40} />
        </div>
      </div>

      <div className="flex px-10 pt-5 border-t border-gray-500 ">
        {hasOnlineUsers ? (
          OnlineUsers.filter((SockUser) => SockUser?.id !== user?.id).map(
            (socketUser) => (
              <UserIcon
                user={socketUser}
                key={socketUser.id}
                handleCall={handleCall}
              />
            )
          )
        ) : (
          <span className="text-white">Cargando Usuarios...</span>
        )}
      </div>

      <CallNotification />
      <VideoCall />
    </div>
  );
};

export default Form;
