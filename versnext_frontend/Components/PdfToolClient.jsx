"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileArchive,
  FileText,
  Images,
  Loader2,
  Scissors,
  Settings2,
  Trash2,
  Upload,
} from "lucide-react";

const pageSizes = [
  { label: "A4", value: "a4" },
  { label: "Letter", value: "letter" },
  { label: "Legal", value: "legal" },
];

const margins = [
  { label: "Small", value: 24 },
  { label: "Normal", value: 40 },
  { label: "Wide", value: 64 },
  { label: "No margin", value: 0 },
];

const backgroundColors = [
  { label: "White", value: "#ffffff" },
  { label: "Soft gray", value: "#f8fafc" },
  { label: "Black", value: "#000000" },
];

const imageQualityOptions = [
  { label: "High quality", value: "NONE" },
  { label: "Balanced", value: "MEDIUM" },
  { label: "Smaller file", value: "SLOW" },
];

function safeFileName(name, fallback) {
  const cleanName = (name || fallback)
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return cleanName || fallback;
}

function getContrastingText(hexColor) {
  return hexColor === "#000000" ? "#ffffff" : "#071633";
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export default function PdfToolClient({ tool }) {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pageRange, setPageRange] = useState({ start: 1, end: 1 });
  const [outputName, setOutputName] = useState("");
  const [pdfOptions, setPdfOptions] = useState({
    pageSize: "a4",
    orientation: "portrait",
    margin: 40,
    imageFit: "contain",
    backgroundColor: "#ffffff",
    compression: "MEDIUM",
  });

  const Icon = useMemo(() => {
    if (tool.mode === "merge-pdf") return FileArchive;
    if (tool.mode === "split-pdf") return Scissors;
    if (tool.mode === "compress-pdf") return FileText;
    return Images;
  }, [tool.mode]);

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    setFiles(tool.multiple ? selected : selected.slice(0, 1));
    setMessage("");
    setPageRange({ start: 1, end: 1 });
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  };

  const moveFile = (index, direction) => {
    setFiles((current) => {
      const next = [...current];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const getDownloadName = (fallback, suffix = "") => {
    const baseName = safeFileName(outputName || files[0]?.name || fallback, fallback);
    return `${baseName}${suffix}.pdf`;
  };

  const processImagesToPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({
      orientation: pdfOptions.orientation,
      unit: "pt",
      format: pdfOptions.pageSize,
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = Number(pdfOptions.margin);
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    for (let index = 0; index < files.length; index += 1) {
      if (index > 0) pdf.addPage();

      const dataUrl = await readAsDataURL(files[index]);
      const image = await loadImage(dataUrl);
      const ratio =
        pdfOptions.imageFit === "cover"
          ? Math.max(availableWidth / image.width, availableHeight / image.height)
          : pdfOptions.imageFit === "stretch"
            ? null
            : Math.min(availableWidth / image.width, availableHeight / image.height);
      const width = pdfOptions.imageFit === "stretch" ? availableWidth : image.width * ratio;
      const height = pdfOptions.imageFit === "stretch" ? availableHeight : image.height * ratio;
      const x = margin + (availableWidth - width) / 2;
      const y = margin + (availableHeight - height) / 2;
      const format = files[index].type.includes("png") ? "PNG" : "JPEG";
      pdf.setFillColor(pdfOptions.backgroundColor);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.addImage(dataUrl, format, x, y, width, height, undefined, pdfOptions.compression);
    }

    pdf.save(getDownloadName(tool.slug));
  };

  const processMergePdf = async () => {
    const { PDFDocument } = await import("pdf-lib");
    const output = await PDFDocument.create();

    for (const file of files) {
      const source = await PDFDocument.load(await readAsArrayBuffer(file));
      const pages = await output.copyPages(source, source.getPageIndices());
      pages.forEach((page) => output.addPage(page));
    }

    const bytes = await output.save({ useObjectStreams: true });
    downloadBlob(new Blob([bytes], { type: "application/pdf" }), getDownloadName("merged-pdf"));
  };

  const processCompressPdf = async () => {
    const { PDFDocument } = await import("pdf-lib");
    const source = await PDFDocument.load(await readAsArrayBuffer(files[0]), { ignoreEncryption: true });
    const bytes = await source.save({ useObjectStreams: true, addDefaultPage: false });
    const originalKb = Math.round(files[0].size / 1024);
    const newKb = Math.round(bytes.byteLength / 1024);

    setMessage(`Optimized PDF ready. Original: ${originalKb} KB, new: ${newKb} KB.`);
    downloadBlob(new Blob([bytes], { type: "application/pdf" }), getDownloadName("compressed", "-compressed"));
  };

  const processSplitPdf = async () => {
    const { PDFDocument } = await import("pdf-lib");
    const source = await PDFDocument.load(await readAsArrayBuffer(files[0]), { ignoreEncryption: true });
    const pageCount = source.getPageCount();
    const start = Math.max(1, Number(pageRange.start || 1));
    const end = Math.min(pageCount, Number(pageRange.end || start));

    if (start > end) throw new Error("Start page must be smaller than or equal to end page.");

    const output = await PDFDocument.create();
    const pageIndexes = Array.from({ length: end - start + 1 }, (_, index) => start - 1 + index);
    const pages = await output.copyPages(source, pageIndexes);
    pages.forEach((page) => output.addPage(page));

    const bytes = await output.save({ useObjectStreams: true });
    downloadBlob(new Blob([bytes], { type: "application/pdf" }), getDownloadName("split", `-pages-${start}-${end}`));
  };

  const processFiles = async () => {
    setBusy(true);
    setMessage("");

    try {
      if (!files.length) throw new Error("Please upload a file first.");
      if (tool.mode === "merge-pdf" && files.length < 2) throw new Error("Please upload at least two PDF files to merge.");

      if (tool.mode === "images-to-pdf") await processImagesToPdf();
      if (tool.mode === "merge-pdf") await processMergePdf();
      if (tool.mode === "compress-pdf") await processCompressPdf();
      if (tool.mode === "split-pdf") await processSplitPdf();

      if (tool.mode !== "compress-pdf") setMessage("Done. Your PDF has been generated and downloaded.");
    } catch (error) {
      setMessage(error?.message || "Something went wrong while processing the file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#4d61b7]/10 text-[#4d61b7]">
          <Icon size={25} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#071633]">{tool.shortTitle} Tool</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{tool.tagline}</p>
        </div>
      </div>

      <label className="mt-7 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-[#4d61b7] hover:bg-[#eef1ff]">
        <Upload className="mb-3 text-[#4d61b7]" size={34} />
        <span className="text-base font-semibold text-[#071633]">{tool.inputLabel}</span>
        <span className="mt-1 text-sm text-slate-500">{tool.fileHint}</span>
        <input type="file" accept={tool.accept} multiple={tool.multiple} onChange={handleFiles} className="hidden" />
      </label>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#071633]">
          <Settings2 className="text-[#4d61b7]" size={18} />
          Output settings
        </div>

        <label className="text-sm font-semibold text-[#071633]">
          PDF file name
          <input
            type="text"
            value={outputName}
            onChange={(event) => setOutputName(event.target.value)}
            placeholder={`${tool.slug}.pdf`}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4d61b7]"
          />
        </label>

        {tool.mode === "images-to-pdf" ? (
          <div className="mt-4 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[#071633]">
                Page size
                <select
                  value={pdfOptions.pageSize}
                  onChange={(event) => setPdfOptions((options) => ({ ...options, pageSize: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4d61b7]"
                >
                  {pageSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-[#071633]">
                Orientation
                <select
                  value={pdfOptions.orientation}
                  onChange={(event) => setPdfOptions((options) => ({ ...options, orientation: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4d61b7]"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[#071633]">
                Margin
                <select
                  value={pdfOptions.margin}
                  onChange={(event) => setPdfOptions((options) => ({ ...options, margin: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4d61b7]"
                >
                  {margins.map((margin) => (
                    <option key={margin.label} value={margin.value}>
                      {margin.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-[#071633]">
                Image fit
                <select
                  value={pdfOptions.imageFit}
                  onChange={(event) => setPdfOptions((options) => ({ ...options, imageFit: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4d61b7]"
                >
                  <option value="contain">Fit full image</option>
                  <option value="cover">Fill page</option>
                  <option value="stretch">Stretch to page</option>
                </select>
              </label>
            </div>

            <label className="text-sm font-semibold text-[#071633]">
              Image quality
              <select
                value={pdfOptions.compression}
                onChange={(event) => setPdfOptions((options) => ({ ...options, compression: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4d61b7]"
              >
                {imageQualityOptions.map((quality) => (
                  <option key={quality.value} value={quality.value}>
                    {quality.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#071633]">PDF background</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {backgroundColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setPdfOptions((options) => ({ ...options, backgroundColor: color.value }))}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      pdfOptions.backgroundColor === color.value ? "border-[#4d61b7] ring-2 ring-[#4d61b7]/15" : "border-slate-200"
                    }`}
                    style={{ backgroundColor: color.value, color: getContrastingText(color.value) }}
                  >
                    <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.value }} />
                    {color.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {files.length ? (
        <div className="mt-5 space-y-3">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#071633]">{file.name}</p>
                <p className="text-xs text-slate-500">{Math.max(1, Math.round(file.size / 1024))} KB</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <button type="button" onClick={() => moveFile(index, -1)} disabled={index === 0} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label={`Move ${file.name} up`}>
                  <ArrowUp size={16} />
                </button>
                <button type="button" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label={`Move ${file.name} down`}>
                  <ArrowDown size={16} />
                </button>
                <button type="button" onClick={() => removeFile(index)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600" aria-label={`Remove ${file.name}`}>
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {tool.mode === "split-pdf" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#071633]">
            Start page
            <input type="number" min="1" value={pageRange.start} onChange={(event) => setPageRange((range) => ({ ...range, start: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4d61b7]" />
          </label>
          <label className="text-sm font-semibold text-[#071633]">
            End page
            <input type="number" min="1" value={pageRange.end} onChange={(event) => setPageRange((range) => ({ ...range, end: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#4d61b7]" />
          </label>
        </div>
      ) : null}

      <button type="button" onClick={processFiles} disabled={busy || !files.length} className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#071633] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#071633]/20 transition hover:bg-[#4d61b7] disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Download className="mr-2" size={18} />}
        {busy ? "Processing..." : `Download ${tool.shortTitle}`}
      </button>

      {message ? <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{message}</p> : null}
    </section>
  );
}
