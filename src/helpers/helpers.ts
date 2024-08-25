import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Props {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean | null>>;
  router: AppRouterInstance;
}

export const handleSubmitFile = async ({
  setLoading,
  setMessage,
  setFile,
  setError,
  file,
  router,
}: Props) => {
  setLoading(true);
  const formData = new FormData();
  formData.append("file", file!);

  const response = await fetch("/api/file", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    console.log("File uploaded successfully");
    setMessage("Archivo subido con éxito.");
    setFile(null); // Reset file input
    setLoading(false);
  } else {
    console.log("File upload failed");
    setMessage("Error al subir el archivo. Por favor, inténtalo de nuevo.");
    setError(true);
    setLoading(false);
  }

  router.refresh();
};

// export const generatePdfThumbnail = async (pdfBuffer: Buffer) => {
//   // Cargar el PDF desde el buffer
//   const loadingTask = getDocument({ data: pdfBuffer });

//   const pdfDoc = await loadingTask.promise; // Utiliza la propiedad 'promise' para manejar la carga

//   // Obtener la primera página del PDF
//   const page = await pdfDoc.getPage(1);
//   const viewport = page.getViewport({ scale: 1 });

//   // Crear un canvas para renderizar la miniatura
//   const canvas = createCanvas(viewport.width, viewport.height);
//   const context = canvas.getContext("2d") as any;

//   await page.render({ canvasContext: context, viewport: viewport }).promise;

//   // Crear un canvas de tamaño reducido para la miniatura
//   const thumbnailWidth = 200;
//   const thumbnailHeight = (thumbnailWidth / viewport.width) * viewport.height;
//   const thumbnailCanvas = createCanvas(thumbnailWidth, thumbnailHeight);
//   const thumbnailContext = thumbnailCanvas.getContext("2d") as any;

//   thumbnailContext.drawImage(canvas, 0, 0, thumbnailWidth, thumbnailHeight);

//   return thumbnailCanvas.toBuffer("image/png");
// };

// export async function generateThumbnail(pdfBuffer: Buffer) {
//   // Guardar el buffer como archivo temporal
//   const tempFilePath = "/tmp/temp.pdf";
//   fs.writeFileSync(tempFilePath, pdfBuffer);

//   // Usar pdf-image para convertir la primera página a imagen
//   const pdfImage = new PDFImage(tempFilePath, {
//     convertOptions: {
//       "-resize": "200x200", // Cambia '200x200' al tamaño que necesites
//       "-density": "150", // Ajusta la densidad (DPI) para controlar la resolución
//     },
//   });
//   const imagePath = await pdfImage.convertPage(0);

//   // Leer la imagen generada como buffer
//   const thumbnailBuffer = fs.readFileSync(imagePath);

//   // Eliminar el archivo temporal
//   fs.unlinkSync(tempFilePath);
//   fs.unlinkSync(imagePath);

//   return thumbnailBuffer;
// }
