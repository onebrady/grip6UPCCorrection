import { createClient } from "@supabase/supabase-js";
import type { Product } from "../types/product";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

interface SyncData {
  products: Product[];
  editedProducts: string[];
  lastUpdated: number;
}

class SupabaseService {
  private tableName = "upc_sync_data";

  constructor() {
    console.log("SupabaseService initialized");
  }

  // Save data to Supabase
  async saveData(
    products: Product[],
    editedProducts: Set<string>
  ): Promise<boolean> {
    try {
      console.log("Saving data to Supabase:", {
        productsCount: products.length,
        editedProductsCount: editedProducts.size,
      });

      const syncData: SyncData = {
        products,
        editedProducts: Array.from(editedProducts),
        lastUpdated: Date.now(),
      };

      // Upsert data (insert or update)
      const { error } = await supabase.from(this.tableName).upsert(
        {
          id: 1, // Use a single record for all data
          data: syncData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Supabase save error:", error);
        return false;
      }

      console.log("Data saved successfully to Supabase");
      return true;
    } catch (error) {
      console.error("Error saving data to Supabase:", error);
      return false;
    }
  }

  // Load data from Supabase
  async loadData(): Promise<{
    products: Product[];
    editedProducts: Set<string>;
  } | null> {
    try {
      console.log("Loading data from Supabase");

      const { data, error } = await supabase
        .from(this.tableName)
        .select("data")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Supabase load error:", error);
        return null;
      }

      if (!data) {
        console.log("No data found in Supabase");
        return null;
      }

      const syncData: SyncData = data.data;
      console.log("Data loaded from Supabase:", {
        productsCount: syncData.products?.length || 0,
        editedProductsCount: syncData.editedProducts?.length || 0,
        lastUpdated: syncData.lastUpdated,
      });

      return {
        products: syncData.products || [],
        editedProducts: new Set(syncData.editedProducts || []),
      };
    } catch (error) {
      console.error("Error loading data from Supabase:", error);
      return null;
    }
  }

  // Check if Supabase is available
  async isAvailable(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .select("id")
        .limit(1);

      return !error;
    } catch (error) {
      console.error("Supabase availability check failed:", error);
      return false;
    }
  }

  // Get last updated timestamp
  async getLastUpdated(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select("data")
        .eq("id", 1)
        .single();

      if (error || !data) {
        return 0;
      }

      return data.data?.lastUpdated || 0;
    } catch (error) {
      console.error("Error getting last updated:", error);
      return 0;
    }
  }
}

export const supabaseService = new SupabaseService();
