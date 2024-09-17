"use client";

import React, { useCallback, useState } from "react";
import PdfRenderer from "./PdfRenderer";
import AnnotationModal from "./AnnotationModal";
import { debounce } from "lodash";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { deleteNote } from "@/actions/pdfActions/actions";
import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { HiOutlineAnnotation } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosOptions } from "react-icons/io";
import SideNavigationMenu from "./SideNavigationMenu";

type note = {
  id: string;
  pdfId: string;
  content: string;
  createdAt: Date;
  xPosition: number;
  yPosition: number;
  colorCode: string;
  size: number;
  isBold: boolean;
};

interface Props {
  base64: string;
  pdfId: string;
  notes: note[];
}

const PdfWithAnnotations = ({ base64, pdfId, notes }: Props) => {
  const [ShowViewer, setShowViewer] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState<number>(1.5);
  const [pdfDimensions, setPdfDimensions] = useState({
    width: 406,
    height: 614,
  }); // Ajusta según dimensiones originales
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const { zoomTo } = zoomPluginInstance;
  const router = useRouter();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleOpenModal = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const initialPosition = {
      x: 100, // Mantén una posición fija en X
      y: scrollY + 100, // Usa el scroll actual para ajustar la posición Y
    };

    setModalPosition(initialPosition);
    setShowModal(true);
  };

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
    if (newScale < 0.5 || newScale > 2) return;
    setScale(newScale);
    debouncedZoomTo(newScale);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    router.refresh();
  };

  return (
    <div className="w-full flex justify-center">
      <PdfRenderer
        base64={base64}
        zoomPluginInstance={zoomPluginInstance}
        ShowViewer={ShowViewer}
        handlePageChange={handlePageChange}
        scale={scale}
        pageNavigationPluginInstance={pageNavigationPluginInstance}
      >
        <div className="w-full z-10 flex justify-between fixed">
          <SideNavigationMenu pdfBase64={base64} />

          <div className="p-2 flex w-4/6 justify-between  mb-10  bg-gray-100 dark:bg-gray-700 rounded-b-xl shadow-md">
            <button
              onClick={() => setShowViewer(false)}
              className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              Inicio
            </button>
            {/* <input
              type="range"
              min="0.5"
              max="2"
              className="bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              step="0.1"
              value={scale}
              onChange={handleZoomChange}
              aria-label="Zoom level"
            />
            <input
              type="number"
              onChange={handleZoomChange}
              value={scale}
              min={0.5}
              max={2}
              step="0.1"
              aria-label="Zoom level input"
              style={{ color: "black" }}
            /> */}
            <span className="inline-flex justify-center items-center p-2 text-gray-500 rounded dark:text-gray-400 ">
              Pagina Actual: {currentPage}
            </span>

            <button
              onClick={handleOpenModal}
              className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <HiOutlineAnnotation size={25} />
            </button>
          </div>

          <div className="p-3 mr-5">
            <IoIosOptions size={40} />
          </div>
        </div>
      </PdfRenderer>

      {showModal && (
        <AnnotationModal
          onClose={toggleModal}
          initialPosition={modalPosition}
          pdfId={pdfId}
        />
      )}

      <div className="annotations-list">
        {ShowViewer &&
          notes.map((annotation, index) => {
            // const adjustedX =
            //   ((annotation.xPosition - 746) / 406) * pdfDimensions.width * scale +
            //   746;
            // const adjustedY =
            //   ((annotation.yPosition - 40) / 614) * pdfDimensions.height * scale +
            //   40;

            return (
              <div
                key={index}
                className="flex items-center"
                style={{
                  position: "absolute",
                  // transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  left: annotation.xPosition, // Ajustado para la posición en X
                  top: annotation.yPosition, // Ajustado para la posición en Y
                }}
              >
                <p
                  style={{
                    fontSize: annotation.size,
                    color: annotation.colorCode,
                    fontWeight: annotation.isBold ? "bold" : "normal",
                  }}
                >
                  {annotation.content?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  {/* {annotation.content} */}
                </p>

                <button onClick={() => handleDeleteNote(annotation.id)}>
                  <div className="px-5">
                    <IoTrashOutline color="red" size={25} />
                  </div>
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PdfWithAnnotations;
