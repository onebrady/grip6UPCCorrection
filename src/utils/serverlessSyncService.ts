import type { Product } from "../types/product";

class ServerlessSyncService {
  private lastSyncTime: number = 0;
  private syncInterval: NodeJS.Timeout | null = null;
  private isPolling: boolean = false;
  private apiUrl: string;

  constructor() {
    // Use the deployed API URL or fallback to local development
    this.apiUrl = import.meta.env.VITE_API_URL || "/api/sync";
    console.log("ServerlessSyncService initialized with API URL:", this.apiUrl);
  }

  // Save data to server
  async saveData(
    products: Product[],
    editedProducts: Set<string>
  ): Promise<boolean> {
    try {
      console.log("Saving data to server:", this.apiUrl, {
        productsCount: products.length,
        editedProductsCount: editedProducts.size,
      });

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
          editedProducts: Array.from(editedProducts),
        }),
      });

      console.log("Server response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      return result.success;
    } catch (error) {
      console.error("Error saving data to server:", error);
      return false;
    }
  }

  // Load data from server
  async loadData(): Promise<{
    products: Product[];
    editedProducts: Set<string>;
  } | null> {
    try {
      console.log("Loading data from server:", this.apiUrl);

      const response = await fetch(this.apiUrl);

      console.log("Load response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Load error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Load response:", result);

      if (result.success && result.data) {
        return {
          products: result.data.products || [],
          editedProducts: new Set(result.data.editedProducts || []),
        };
      }

      return null;
    } catch (error) {
      console.error("Error loading data from server:", error);
      return null;
    }
  }

  // Start polling for changes every 5 seconds
  startPolling(
    onDataChange: (data: {
      products: Product[];
      editedProducts: Set<string>;
    }) => void
  ): void {
    if (this.isPolling) return;

    console.log("Starting sync polling...");
    this.isPolling = true;

    const poll = async () => {
      try {
        const currentData = await this.loadData();
        if (currentData) {
          // Check if data has been updated since last sync
          const response = await fetch(this.apiUrl);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              const serverLastUpdated = result.data.lastUpdated || 0;

              // Only trigger change if data is newer and from different session
              if (serverLastUpdated > this.lastSyncTime) {
                console.log("Data changed, triggering sync update");
                this.lastSyncTime = serverLastUpdated;
                onDataChange(currentData);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error during sync polling:", error);
      }
    };

    // Initial poll
    poll();

    // Set up polling every 5 seconds
    this.syncInterval = setInterval(poll, 5000);
  }

  // Stop polling
  stopPolling(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isPolling = false;
    console.log("Stopped sync polling");
  }

  // Force a sync by updating data on server
  async forceSync(
    products: Product[],
    editedProducts: Set<string>
  ): Promise<boolean> {
    console.log("Force syncing data...");
    this.lastSyncTime = Date.now();
    return await this.saveData(products, editedProducts);
  }

  // Check if server is available
  async isServerAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl);
      const isAvailable = response.ok;
      console.log("Server availability check:", isAvailable);
      return isAvailable;
    } catch (error) {
      console.error("Server availability check failed:", error);
      return false;
    }
  }
}

// Create singleton instance
export const serverlessSyncService = new ServerlessSyncService();
