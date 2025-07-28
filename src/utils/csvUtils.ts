import Papa from "papaparse";
import type { Product, ProductWithUPC } from "../types/product";

export const parseCSV = (csvText: string): Product[] => {
  console.log("Parsing CSV, text length:", csvText.length);
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  console.log("CSV parse result:", {
    dataLength: result.data.length,
    errors: result.errors,
    meta: result.meta,
  });

  return result.data as Product[];
};

export const processProductsWithUPC = (
  products: Product[]
): ProductWithUPC[] => {
  console.log("Processing products with UPC, count:", products.length);

  const processed = products.map((product) => ({
    ...product,
    hasUPC: Boolean(
      product["Variant Barcode"] && product["Variant Barcode"].trim() !== ""
    ),
    upcMissing:
      !product["Variant Barcode"] || product["Variant Barcode"].trim() === "",
  }));

  const withUPC = processed.filter((p) => p.hasUPC).length;
  const missingUPC = processed.filter((p) => p.upcMissing).length;

  console.log("Processed products stats:", {
    total: processed.length,
    withUPC,
    missingUPC,
  });

  return processed;
};

export const exportToCSV = (products: Product[]): string => {
  return Papa.unparse(products);
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const saveToLocalStorage = (products: Product[]) => {
  localStorage.setItem("upc-dashboard-data", JSON.stringify(products));
};

export const loadFromLocalStorage = (): Product[] | null => {
  const data = localStorage.getItem("upc-dashboard-data");
  return data ? JSON.parse(data) : null;
};
