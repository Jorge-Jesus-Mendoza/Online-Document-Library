"use client";

import React, { useCallback, useState } from "react";
import PdfRenderer from "./PdfRenderer";
import { debounce } from "lodash";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { deleteNote } from "@/actions/pdfActions/actions";
import { useRouter } from "next/navigation";
import { IoIosOptions } from "react-icons/io";
import SideNavigationMenu from "./SideNavigationMenu";
import { themePlugin } from "@react-pdf-viewer/theme";
import ThemeToggle from "./LayoutComponents/ThemeToggle";

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
}

const PdfWithAnnotations = ({ base64, pdfId, notes }: Props) => {
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

  const handlePageChange = useCallback((e: { currentPage: number }) => {
    setCurrentPage(e.currentPage + 1);
  }, []);

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
            <ThemeToggle
              themePluginInstance={themePluginInstance}
              setCurrentTheme={setCurrentTheme}
            />
          </div>

          <div className="p-3 mr-5">
            <IoIosOptions size={40} />
          </div>
        </div>
      </PdfRenderer>

      {/* {showModal && (
        <AnnotationModal
          onClose={toggleModal}
          initialPosition={modalPosition}
          pdfId={pdfId}
          currentPage={currentPage}
        />
      )} */}

      {/* <div className="annotations-list">
        {ShowViewer &&
          notes.map((annotation, index) => {
            // const adjustedX =
            //   ((annotation.xPosition - 746) / 406) * pdfDimensions.width * scale +
            //   746;
            // const adjustedY =
            //   ((annotation.yPosition - 40) / 614) * pdfDimensions.height * scale +
            //   40;

            return (
              annotation.page === currentPage && (
                <Note
                  {...annotation}
                  key={annotation.id}
                  handleDeleteNote={handleDeleteNote}
                />
              )
            );
          })}
      </div> */}
    </div>
  );
};

export default PdfWithAnnotations;
