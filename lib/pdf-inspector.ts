import { createRequire } from "node:module";
import type {
  PagesExtractionResult,
  PdfClassification,
  PdfResult,
  TextItem,
} from "@firecrawl/pdf-inspector";

const require = createRequire(import.meta.url);

type PdfInspectorModule = {
  classifyPdf: (buffer: Buffer) => PdfClassification;
  detectPdf: (buffer: Buffer) => PdfResult;
  extractText: (buffer: Buffer) => string;
  extractTextWithPositions: (
    buffer: Buffer,
    pages?: number[] | null,
  ) => TextItem[];
  extractPagesMarkdown: (
    buffer: Buffer,
    pages?: number[] | null,
  ) => PagesExtractionResult;
  processPdf: (buffer: Buffer, pages?: number[] | null) => PdfResult;
};

let pdfInspector: PdfInspectorModule | null = null;

function getPdfInspector(): PdfInspectorModule {
  if (!pdfInspector) {
    pdfInspector = require("@firecrawl/pdf-inspector") as PdfInspectorModule;
  }
  return pdfInspector;
}

export type PdfInspectionResult = {
  classification: PdfClassification;
  detection: PdfResult;
  plainText: string;
  textWithPositions: TextItem[];
  pagesMarkdown: PagesExtractionResult;
  processed: PdfResult;
};

export function inspectPdfBuffer(buffer: Buffer): PdfInspectionResult {
  const {
    classifyPdf,
    detectPdf,
    extractText,
    extractTextWithPositions,
    extractPagesMarkdown,
    processPdf,
  } = getPdfInspector();

  const classification = classifyPdf(buffer);
  const detection = detectPdf(buffer);
  const plainText = extractText(buffer);
  const textWithPositions = extractTextWithPositions(buffer);
  const pagesMarkdown = extractPagesMarkdown(buffer);
  const processed = processPdf(buffer);

  const result: PdfInspectionResult = {
    classification,
    detection,
    plainText,
    textWithPositions,
    pagesMarkdown,
    processed,
  };

  console.log("[PDF Inspector] Classification:", classification);
  console.log("[PDF Inspector] Detection:", detection);
  console.log(
    "[PDF Inspector] Plain text length:",
    plainText.length,
    "characters",
  );
  console.log(
    "[PDF Inspector] Text items with positions:",
    textWithPositions.length,
    "items",
  );
  console.log("[PDF Inspector] Pages markdown:", pagesMarkdown);
  console.log("[PDF Inspector] Processed PDF:", processed);
  console.log(
    "[PDF Inspector] Full parse result:",
    JSON.stringify(result, null, 2),
  );

  return result;
}
