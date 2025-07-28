import Papa from "papaparse";
import { Product, ProductWithUPC } from "../types/product";

export const parseCSV = (csvText: string): Product[] => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data as Product[];
};

export const processProductsWithUPC = (
  products: Product[]
): ProductWithUPC[] => {
  return products.map((product) => ({
    ...product,
    hasUPC: Boolean(
      product["Variant Barcode"] && product["Variant Barcode"].trim() !== ""
    ),
    upcMissing:
      !product["Variant Barcode"] || product["Variant Barcode"].trim() === "",
  }));
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
