import type { Product } from "../types/product";

interface SyncData {
  products: Product[];
  editedProducts: string[];
  timestamp: number;
  userId: string;
}

class SyncService {
  private userId: string;
  private lastSyncTime: number = 0;
  private syncInterval: NodeJS.Timeout | null = null;
  private isPolling: boolean = false;

  constructor() {
    // Generate a unique user ID for this browser session
    this.userId = this.generateUserId();
  }

  private generateUserId(): string {
    const existingId = localStorage.getItem("upc-dashboard-user-id");
    if (existingId) {
      return existingId;
    }

    const newId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("upc-dashboard-user-id", newId);
    return newId;
  }

  // Save data with timestamp for change detection
  saveData(products: Product[], editedProducts: Set<string>): void {
    const syncData: SyncData = {
      products,
      editedProducts: Array.from(editedProducts),
      timestamp: Date.now(),
      userId: this.userId,
    };

    localStorage.setItem("upc-dashboard-sync-data", JSON.stringify(syncData));

    // Also save individual data for backward compatibility
    localStorage.setItem("upc-dashboard-data", JSON.stringify(products));
    localStorage.setItem(
      "upc-dashboard-edited-products",
      JSON.stringify(Array.from(editedProducts))
    );
  }

  // Load data from localStorage
  loadData(): { products: Product[]; editedProducts: Set<string> } | null {
    try {
      const syncDataStr = localStorage.getItem("upc-dashboard-sync-data");
      if (syncDataStr) {
        const syncData: SyncData = JSON.parse(syncDataStr);
        return {
          products: syncData.products,
          editedProducts: new Set(syncData.editedProducts),
        };
      }

      // Fallback to individual data
      const productsStr = localStorage.getItem("upc-dashboard-data");
      const editedProductsStr = localStorage.getItem(
        "upc-dashboard-edited-products"
      );

      if (productsStr) {
        const products = JSON.parse(productsStr);
        const editedProducts = editedProductsStr
          ? new Set(JSON.parse(editedProductsStr) as string[])
          : new Set<string>();
        return { products, editedProducts };
      }

      return null;
    } catch (error) {
      console.error("Error loading sync data:", error);
      return null;
    }
  }

  // Start polling for changes
  startPolling(
    onDataChange: (data: {
      products: Product[];
      editedProducts: Set<string>;
    }) => void
  ): void {
    if (this.isPolling) return;

    this.isPolling = true;

    const poll = () => {
      try {
        const currentData = this.loadData();
        if (currentData) {
          const syncDataStr = localStorage.getItem("upc-dashboard-sync-data");
          if (syncDataStr) {
            const syncData: SyncData = JSON.parse(syncDataStr);

            // Only trigger change if timestamp is newer and from different user
            if (
              syncData.timestamp > this.lastSyncTime &&
              syncData.userId !== this.userId
            ) {
              this.lastSyncTime = syncData.timestamp;
              onDataChange(currentData);
            }
          }
        }
      } catch (error) {
        console.error("Error during sync polling:", error);
      }
    };

    // Initial poll
    poll();

    // Set up polling every 1 second
    this.syncInterval = setInterval(poll, 1000);
  }

  // Stop polling
  stopPolling(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isPolling = false;
  }

  // Force a sync by updating timestamp
  forceSync(products: Product[], editedProducts: Set<string>): void {
    this.lastSyncTime = Date.now();
    this.saveData(products, editedProducts);
  }

  // Get current user ID
  getUserId(): string {
    return this.userId;
  }

  // Check if data has changed since last sync
  hasDataChanged(): boolean {
    try {
      const syncDataStr = localStorage.getItem("upc-dashboard-sync-data");
      if (syncDataStr) {
        const syncData: SyncData = JSON.parse(syncDataStr);
        return syncData.timestamp > this.lastSyncTime;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const syncService = new SyncService();
