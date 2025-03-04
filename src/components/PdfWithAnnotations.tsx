"use client";

import React, { useCallback, useEffect, useState } from "react";
import PdfRenderer from "./PdfRenderer";
import { debounce } from "lodash";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import SideNavigationMenu from "./LayoutComponents/SideNavigationMenu";
import { themePlugin } from "@react-pdf-viewer/theme";
import ThemeToggle from "./LayoutComponents/ThemeToggle";
import SideSettingsMenu from "./LayoutComponents/SideSettingsMenu";
import { updatePdfLastPage } from "@/actions/pdfActions/actions";

type note = {
  id: string;
  pdfId: string;
  content: string;
  createdAt: Date;
  colorCode: string;
  size: number;
  page: number;
  isBold: boolean;
  quote: string;
  highlightAreas: any;
};

interface Props {
  base64: string;
  pdfId: string;
  notes: note[];
  lastPage: number;
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

const PdfWithAnnotations = ({
  base64,
  pdfId,
  notes,
  user,
  lastPage,
}: Props) => {
  const [ShowViewer, setShowViewer] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.5);

  const [currentTheme, setCurrentTheme] = useState<string>(
    localStorage.getItem("theme") as string
  );
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const themePluginInstance = themePlugin();
  const { zoomTo } = zoomPluginInstance;

  const handlePageChange = useCallback(
    (e: { currentPage: number }) => {
      const page = e.currentPage + 1;
      setCurrentPage(page);
      updatePdfLastPage(pdfId, page);
    },
    [pdfId]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedZoomTo = useCallback(
    debounce((scale: number) => {
      zoomTo(scale);
    }, 300),
    [zoomTo]
  );

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const newScale = Number(event.target.value);
    if (newScale < 0.5 || newScale > 3) return;
    setScale(newScale);
    debouncedZoomTo(newScale);
  };

  const { GoToFirstPage, CurrentPageInput, jumpToNextPage, jumpToPage } =
    pageNavigationPluginInstance;

  return (
    <div className="w-full flex justify-center">
      <PdfRenderer
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        themePluginInstance={themePluginInstance}
        scale={scale}
        notes={notes}
        currentPage={currentPage}
        lastPage={lastPage}
        jumpToPage={jumpToPage}
        pdfId={pdfId}
        base64={base64}
        zoomPluginInstance={zoomPluginInstance}
        ShowViewer={ShowViewer}
        handlePageChange={handlePageChange}
        pageNavigationPluginInstance={pageNavigationPluginInstance}
      >
        <div className="w-full z-10 flex justify-between fixed">
          <SideNavigationMenu pdfBase64={base64} jumpToPage={jumpToPage} />

          <div className="p-2 flex w-4/6 justify-between  mb-10  bg-gray-100 dark:bg-gray-700 rounded-b-xl shadow-md">
            <button
              onClick={() => setShowViewer(false)}
              className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              Inicio
            </button>
            <div className="flex justify-center self-center items-center h-10 ">
              <div className="bg-gray-50 dark:bg-gray-600 border dark:border-none flex items-center   h-full rounded-s-xl">
                <div className=" flex items-center p-2">
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    className="bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 "
                    step="0.1"
                    value={scale}
                    onChange={handleZoomChange}
                    aria-label="Zoom level"
                  />
                </div>
              </div>
              <div className="h-full bg-gray-200 dark:bg-gray-800 flex items-center rounded-e-xl">
                <input
                  type="number"
                  onChange={handleZoomChange}
                  value={scale}
                  min={0.5}
                  max={3}
                  step="0.1"
                  className="custom-number flex-shrink-0 text-gray-900 dark:text-white items-center border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center bg-gray-50"
                  aria-label="Zoom level input"
                  // style={{ color: "black" }}
                />
              </div>
            </div>
            <span className="inline-flex justify-center items-center p-2 text-gray-500 rounded dark:text-gray-400 ">
              Pagina Actual: {currentPage}
            </span>

            {/* <button
              onClick={handleOpenModal}
              className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <HiOutlineAnnotation size={25} />
            </button> */}
            <ThemeToggle setCurrentTheme={setCurrentTheme} />
          </div>

          <SideSettingsMenu
            user={user}
            pdfBase64={base64}
            jumpToPage={jumpToPage}
          />
        </div>
      </PdfRenderer>
    </div>
  );
};

export default PdfWithAnnotations;
