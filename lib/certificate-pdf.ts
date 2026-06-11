import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

type CertificatePdfOptions = {
  courseSlug: string;
  courseTitle: string;
  hours: string;
  lessonTitles: string[];
  learnerName: string;
  date: string;
};

const INK = rgb(31 / 255, 36 / 255, 48 / 255);
const INK_SOFT = rgb(75 / 255, 82 / 255, 99 / 255);
const INK_FAINT = rgb(138 / 255, 144 / 255, 160 / 255);
const FLAME = rgb(255 / 255, 105 / 255, 74 / 255);
const PAPER = rgb(251 / 255, 250 / 255, 248 / 255);
const LINE = rgb(230 / 255, 226 / 255, 218 / 255);

function printable(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/·/g, "|")
    .replace(/[^\x20-\x7E]/g, "");
}

function fittedSize(font: PDFFont, text: string, preferred: number, maxWidth: number) {
  let size = preferred;
  while (size > 20 && font.widthOfTextAtSize(text, size) > maxWidth) size -= 1;
  return size;
}

function filenamePart(value: string) {
  return printable(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function downloadCertificatePdf({
  courseSlug,
  courseTitle,
  hours,
  lessonTitles,
  learnerName,
  date,
}: CertificatePdfOptions) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${courseTitle} certificate - ${learnerName}`);
  pdf.setAuthor("WNL Analytics");
  pdf.setSubject("Course completion certificate");

  const page = pdf.addPage([841.89, 595.28]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);

  page.drawRectangle({ x: 0, y: 0, width: 841.89, height: 595.28, color: PAPER });
  page.drawRectangle({
    x: 51,
    y: 33,
    width: 750,
    height: 511,
    color: FLAME,
    opacity: 0.2,
  });
  page.drawRectangle({
    x: 41,
    y: 43,
    width: 750,
    height: 511,
    color: rgb(1, 1, 1),
    borderColor: INK,
    borderWidth: 2.5,
  });

  page.drawCircle({ x: 735, y: 90, size: 118, color: FLAME, opacity: 0.045 });
  page.drawCircle({ x: 790, y: 52, size: 70, color: FLAME, opacity: 0.055 });
  page.drawCircle({ x: 703, y: 42, size: 42, color: rgb(1, 1, 1) });

  const left = 104;
  page.drawText("CERTIFICATE  OF  COMPLETION", {
    x: left,
    y: 493,
    size: 11,
    font: bold,
    color: FLAME,
  });
  page.drawText("This certifies that", {
    x: left,
    y: 440,
    size: 13,
    font: regular,
    color: INK_SOFT,
  });

  const safeName = printable(learnerName) || "Course learner";
  page.drawText(safeName, {
    x: left,
    y: 389,
    size: fittedSize(bold, safeName, 40, 610),
    font: bold,
    color: INK,
  });
  page.drawText("has completed the course", {
    x: left,
    y: 345,
    size: 13,
    font: regular,
    color: INK_SOFT,
  });
  page.drawText(printable(courseTitle), {
    x: left,
    y: 311,
    size: 24,
    font: bold,
    color: INK,
  });
  page.drawText(`${lessonTitles.length} lessons  |  ${printable(hours)}`, {
    x: left,
    y: 289,
    size: 10,
    font: mono,
    color: INK_FAINT,
  });

  const columns = [left, 405];
  lessonTitles.forEach((title, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = columns[column];
    const y = 249 - row * 24;
    page.drawCircle({ x: x + 4, y: y + 4, size: 4, color: FLAME });
    page.drawText(printable(title), {
      x: x + 15,
      y,
      size: 10,
      font: mono,
      color: INK_SOFT,
    });
  });

  page.drawLine({
    start: { x: left, y: 118 },
    end: { x: 728, y: 118 },
    thickness: 1,
    color: LINE,
  });
  page.drawText("dbt onboarding | WNL Analytics", {
    x: left,
    y: 89,
    size: 12,
    font: bold,
    color: INK,
  });
  page.drawText("not an official dbt Labs product", {
    x: left,
    y: 71,
    size: 8.5,
    font: mono,
    color: INK_FAINT,
  });

  const safeDate = printable(date);
  page.drawText(safeDate, {
    x: 728 - mono.widthOfTextAtSize(safeDate, 10),
    y: 79,
    size: 10,
    font: mono,
    color: INK_SOFT,
  });

  const bytes = await pdf.save();
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const learner = filenamePart(learnerName);
  link.href = url;
  link.download = `${filenamePart(courseSlug)}-${learner || "learner"}-certificate.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
