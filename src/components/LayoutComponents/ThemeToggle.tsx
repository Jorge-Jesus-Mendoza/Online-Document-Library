"use client";

import React, { useEffect, useState } from "react";
import { CiSun } from "react-icons/ci";
import { GoMoon } from "react-icons/go";
import { useSocket } from "../../../context/SocketContext";
import { useSession } from "next-auth/react";
import UserIcon from "../OnlineUsers/UserIcon";

interface Props {
  setCurrentTheme?: React.Dispatch<React.SetStateAction<string>>;
  iconSize?: number;
}

const ThemeToggle = ({ setCurrentTheme, iconSize = 25 }: Props) => {
  const { OnlineUsers = [] } = useSocket();
  const { data: session } = useSession();
  const userLogged = OnlineUsers?.find(
    (SockUser) => SockUser?.id === session?.user?.id
  );
  const [DarkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (DarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      if (setCurrentTheme) {
        setCurrentTheme("dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      if (setCurrentTheme) {
        setCurrentTheme("light");
      }
    }
  }, [DarkMode, setCurrentTheme]);

  return (
    <div className="flex justify-center items-center">
      {userLogged && <UserIcon user={userLogged} />}
      <button
        onClick={() => setDarkMode(!DarkMode)}
        className="inline-flex justify-center items-center p-2 rounded cursor-pointer text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        {DarkMode ? <CiSun size={iconSize} /> : <GoMoon size={iconSize} />}
      </button>
      {/* <SwitchThemeButton /> */}
    </div>
  );
};

export default ThemeToggle;
