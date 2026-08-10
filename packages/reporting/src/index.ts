import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

export interface ExportOptions {
  title: string;
  subtitle?: string;
  columns: ExportColumn[];
  rows: Record<string, unknown>[];
  language?: "ar" | "en";
}

export function exportToPDF(options: ExportOptions): Uint8Array {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const isArabic = options.language === "ar";
  doc.setFont("helvetica");

  doc.setFontSize(18);
  doc.setTextColor(139, 92, 246);
  doc.text(options.title, isArabic ? 270 : 14, 20, { align: isArabic ? "right" : "left" });

  if (options.subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(options.subtitle, isArabic ? 270 : 14, 28, { align: isArabic ? "right" : "left" });
  }

  const tableColumns = options.columns.map((c) => ({ header: c.header, dataKey: c.key }));
  const tableRows = options.rows.map((row) =>
    options.columns.reduce<Record<string, string>>((acc, col) => {
      acc[col.key] = String(row[col.key] ?? "");
      return acc;
    }, {})
  );

  autoTable(doc, {
    startY: 35,
    head: [tableColumns.map((c) => c.header)],
    body: tableRows.map((r) => tableColumns.map((c) => r[c.dataKey])),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 246, 255] },
    margin: { left: 14, right: 14 },
  });

  doc.setFontSize(8);
  doc.setTextColor(150);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `${i} / ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
    doc.text("Odé AI Platform", 14, doc.internal.pageSize.getHeight() - 8);
  }

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

export function exportToXLSX(options: ExportOptions): Uint8Array {
  const wb = XLSX.utils.book_new();

  const header = options.columns.map((c) => c.header);
  const dataRows = options.rows.map((row) =>
    options.columns.map((col) => row[col.key] ?? "")
  );

  const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);

  const colWidths = options.columns.map((c) => ({ wch: c.width ?? 20 }));
  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, options.title.slice(0, 31));

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new Uint8Array(buffer);
}

export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    return headers.reduce<Record<string, string>>((acc, h, i) => {
      acc[h] = values[i] ?? "";
      return acc;
    }, {});
  });
}

export function detectFileType(filename: string): "csv" | "xlsx" | "pdf" | "unknown" {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "csv") return "csv";
  if (ext === "xlsx" || ext === "xls") return "xlsx";
  if (ext === "pdf") return "pdf";
  return "unknown";
}

export function summarizeDataset(rows: Record<string, unknown>[]): {
  rowCount: number;
  columnCount: number;
  columns: string[];
  numericColumns: string[];
  totals: Record<string, number>;
} {
  if (rows.length === 0) {
    return { rowCount: 0, columnCount: 0, columns: [], numericColumns: [], totals: {} };
  }

  const columns = Object.keys(rows[0]);
  const numericColumns: string[] = [];
  const totals: Record<string, number> = {};

  for (const col of columns) {
    const sample = rows.slice(0, 10).map((r) => r[col]);
    const allNumeric = sample.every((v) => v !== "" && !isNaN(Number(v)));
    if (allNumeric) {
      numericColumns.push(col);
      totals[col] = rows.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
    }
  }

  return { rowCount: rows.length, columnCount: columns.length, columns, numericColumns, totals };
}
