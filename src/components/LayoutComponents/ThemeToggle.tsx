"use client";

import { ThemePlugin } from "@react-pdf-viewer/theme";
import React, { useEffect, useState } from "react";
import { CiSun } from "react-icons/ci";
import { GoMoon } from "react-icons/go";

interface Props {
  themePluginInstance: ThemePlugin;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeToggle = ({ themePluginInstance, setCurrentTheme }: Props) => {
  const { SwitchThemeButton } = themePluginInstance;
  const [DarkMode, setDarkMode] = useState<boolean>(false);

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
      setCurrentTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setCurrentTheme("light");
    }
  }, [DarkMode, setCurrentTheme]);

  return (
    <>
      <button
        onClick={() => setDarkMode(!DarkMode)}
        className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        {DarkMode ? <CiSun size={25} /> : <GoMoon size={25} />}
      </button>
      {/* <SwitchThemeButton /> */}
    </>
  );
};

export default ThemeToggle;
