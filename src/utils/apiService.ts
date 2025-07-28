import type { Product } from "../types/product";

// API base URL - you can change this to your actual server endpoint
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiService = {
  // Save products to server
  async saveProducts(products: Product[]): Promise<ApiResponse<void>> {
    try {
      // Skip server calls if no API URL is configured (for static deployment)
      if (!import.meta.env.VITE_API_URL) {
        console.log("No API URL configured, skipping server save");
        return { success: true };
      }

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error saving products:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Load products from server
  async loadProducts(): Promise<ApiResponse<Product[]>> {
    try {
      // Skip server calls if no API URL is configured (for static deployment)
      if (!import.meta.env.VITE_API_URL) {
        console.log("No API URL configured, skipping server load");
        return { success: true, data: [] };
      }

      const response = await fetch(`${API_BASE_URL}/products`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data: data.products };
    } catch (error) {
      console.error("Error loading products:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Update a single product's UPC
  async updateProductUPC(
    handle: string,
    sku: string,
    upc: string
  ): Promise<ApiResponse<void>> {
    try {
      // Skip server calls if no API URL is configured (for static deployment)
      if (!import.meta.env.VITE_API_URL) {
        console.log("No API URL configured, skipping server update");
        return { success: true };
      }

      const response = await fetch(
        `${API_BASE_URL}/products/${handle}/sku/${sku}/upc`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ upc }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating product UPC:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Sync local data with server
  async syncWithServer(products: Product[]): Promise<ApiResponse<void>> {
    try {
      // Skip server calls if no API URL is configured (for static deployment)
      if (!import.meta.env.VITE_API_URL) {
        console.log("No API URL configured, skipping server sync");
        return { success: true };
      }

      const response = await fetch(`${API_BASE_URL}/products/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error syncing with server:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
