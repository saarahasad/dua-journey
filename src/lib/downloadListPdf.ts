import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const MARGIN_MM = 10;

/**
 * Capture an HTML element and save as a single long-page PDF.
 * One continuous page avoids the black bar / seam that appeared with multi-page split.
 */
export async function downloadElementAsPdf(element: HTMLElement, filename: string = "my-dua-list.pdf") {
  const scale = 3;
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 0,
  });

  const imgWidth = A4_WIDTH_MM - 2 * MARGIN_MM;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeight = Math.max(297, imgHeight + 2 * MARGIN_MM); // single long page

  const pdf = new jsPDF("p", "mm", [A4_WIDTH_MM, pageHeight]);
  const imgData = canvas.toDataURL("image/png", 1.0);

  pdf.addImage(imgData, "PNG", MARGIN_MM, MARGIN_MM, imgWidth, imgHeight);
  pdf.save(filename);
}
