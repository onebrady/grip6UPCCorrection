import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  AlertCircle,
  CheckCircle,
  Edit3,
  Save,
  X,
} from "lucide-react";
import type { Product, ProductWithUPC } from "../types/product";
import {
  processProductsWithUPC,
  exportToCSV,
  downloadCSV,
  parseCSV,
} from "../utils/csvUtils";
import { supabaseService } from "../utils/supabaseService";

const UPCDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [processedProducts, setProcessedProducts] = useState<ProductWithUPC[]>(
    []
  );
  const [filteredProducts, setFilteredProducts] = useState<ProductWithUPC[]>(
    []
  );
  const [filterMissing, setFilterMissing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingSKU, setEditingSKU] = useState<string | null>(null);
  const [editingUPC, setEditingUPC] = useState("");
  const [editedProducts, setEditedProducts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to get the correct title for a product handle
  const getProductTitle = useCallback(
    (handle: string): string => {
      // Find the first product with this handle that has a title
      const productWithTitle = products.find(
        (product) =>
          product.Handle === handle &&
          product.Title &&
          product.Title.trim() !== ""
      );
      return productWithTitle?.Title || "No Title";
    },
    [products]
  );

  // Load data from server or default CSV on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedData = await supabaseService.loadData();
        if (savedData && savedData.products.length > 0) {
          setProducts(savedData.products);
          const processed = processProductsWithUPC(savedData.products);
          setProcessedProducts(processed);
          setEditedProducts(savedData.editedProducts);
          // Don't set filteredProducts here - let the filter useEffect handle it
        } else {
          // Load default CSV if no saved data
          loadDefaultCSV();
        }
      } catch (error) {
        console.error("Error loading from server:", error);
        // Try to load default CSV as fallback
        loadDefaultCSV();
      }
    };

    loadInitialData();
  }, []);

  // Real-time sync with other browser windows using serverless sync service
  useEffect(() => {
    // Start polling for changes every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const currentData = await supabaseService.loadData();
        if (currentData) {
          setProducts(currentData.products);
          const processed = processProductsWithUPC(currentData.products);
          setProcessedProducts(processed);
          setEditedProducts(currentData.editedProducts);
        }
      } catch (error) {
        console.error("Error during sync polling:", error);
      }
    }, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const loadDefaultCSV = async () => {
    try {
      setIsLoading(true);
      console.log("Loading default CSV from /products_export.csv");

      // Clear any cached data and force fresh fetch
      const response = await fetch("/products_export.csv", {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      console.log("CSV response status:", response.status);
      if (response.ok) {
        const csvText = await response.text();
        console.log("CSV loaded, length:", csvText.length);
        const parsedProducts = parseCSV(csvText);
        console.log("Parsed products count:", parsedProducts.length);
        setProducts(parsedProducts);
        const processed = processProductsWithUPC(parsedProducts);
        console.log("Processed products count:", processed.length);
        setProcessedProducts(processed);
        // Don't set filteredProducts here - let the filter useEffect handle it
        await supabaseService.saveData(parsedProducts, new Set());
      } else {
        console.warn(
          "Could not load default CSV file, status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error loading default CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search and filter criteria
  useEffect(() => {
    try {
      console.log("Filtering products:", {
        total: processedProducts.length,
        filterMissing,
        editedProductsSize: editedProducts.size,
      });

      let filtered = processedProducts;

      // Filter out products with "copy" in the handle (test products)
      const beforeCopyFilter = filtered.length;
      filtered = filtered.filter(
        (product) => !product.Handle.toLowerCase().includes("copy")
      );
      console.log(
        "After copy filter:",
        beforeCopyFilter,
        "->",
        filtered.length
      );

      // Filter out products without SKU
      const beforeSKUFilter = filtered.length;
      filtered = filtered.filter(
        (product) =>
          product["Variant SKU"] && product["Variant SKU"].trim() !== ""
      );
      console.log("After SKU filter:", beforeSKUFilter, "->", filtered.length);

      // Filter out products that already have UPCs (but keep ones edited in this session)
      const beforeUPCFilter = filtered.length;
      filtered = filtered.filter((product) => {
        const hasUPC =
          product["Variant Barcode"] &&
          product["Variant Barcode"].trim() !== "";

        // Create a unique identifier for this product+SKU combination
        const productKey = `${product.Handle}-${product["Variant SKU"]}`;

        // Show if no UPC OR if this product was edited in this session
        // (unless "Show only products needing UPCs" is checked)
        if (filterMissing) {
          // When filter is active, only show products that need UPCs
          return !hasUPC;
        } else {
          // When filter is not active, show products that need UPCs OR were edited
          return !hasUPC || editedProducts.has(productKey);
        }
      });
      console.log("After UPC filter:", beforeUPCFilter, "->", filtered.length);

      console.log("Final filtered count:", filtered.length);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error filtering products:", error);
      setFilteredProducts([]);
    }
  }, [processedProducts, filterMissing, editedProducts]);

  const handleExport = () => {
    try {
      const csvContent = exportToCSV(products);
      downloadCSV(csvContent, "products_with_upc_updated.csv");
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const startEditing = (
    productHandle: string,
    productSKU: string,
    currentUPC: string
  ) => {
    setEditingProduct(productHandle);
    setEditingSKU(productSKU);
    setEditingUPC(currentUPC);
  };

  const saveEdit = async () => {
    if (!editingProduct || !editingSKU) return;

    console.log("Saving edit:", {
      product: editingProduct,
      sku: editingSKU,
      upc: editingUPC,
    });

    try {
      const updatedProducts = products.map((product) => {
        if (
          product.Handle === editingProduct &&
          product["Variant SKU"] === editingSKU
        ) {
          console.log(
            "Updating product:",
            product.Handle,
            product["Variant SKU"]
          );
          return { ...product, "Variant Barcode": editingUPC };
        }
        return product;
      });

      console.log("Updated products count:", updatedProducts.length);
      setProducts(updatedProducts);
      const processed = processProductsWithUPC(updatedProducts);
      console.log("Processed products count:", processed.length);
      setProcessedProducts(processed);

      // Track that this product was edited
      const productKey = `${editingProduct}-${editingSKU}`;
      console.log("Adding to edited products:", productKey);
      setEditedProducts((prev) => {
        const newSet = new Set([...prev, productKey]);
        console.log("Edited products count:", newSet.size);

        // Use Supabase service to save data
        supabaseService
          .saveData(updatedProducts, newSet)
          .then((success: boolean) => {
            console.log("Sync save result:", success);
          })
          .catch((error: unknown) => {
            console.error("Sync save error:", error);
          });

        return newSet;
      });

      setEditingProduct(null);
      setEditingSKU(null);
      setEditingUPC("");
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditingSKU(null);
    setEditingUPC("");
  };

  const stats = {
    total: processedProducts.filter(
      (p) =>
        !p.Handle.toLowerCase().includes("copy") &&
        p["Variant SKU"] &&
        p["Variant SKU"].trim() !== ""
    ).length,
    withUPC: processedProducts.filter(
      (p) =>
        p.hasUPC &&
        !p.Handle.toLowerCase().includes("copy") &&
        p["Variant SKU"] &&
        p["Variant SKU"].trim() !== ""
    ).length,
    // Show count of products that need UPCs (excluding ones that already have them)
    needsUPC: processedProducts.filter(
      (p) =>
        !p.Handle.toLowerCase().includes("copy") &&
        p["Variant SKU"] &&
        p["Variant SKU"].trim() !== "" &&
        (!p["Variant Barcode"] || p["Variant Barcode"].trim() === "")
    ).length,
    // Show count of products that were edited in this session
    edited: editedProducts.size,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            UPC Management Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and update UPC codes for your Shopify products with ease
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle className="h-7 w-7 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  With UPC
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.withUPC}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Needs UPC
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.needsUPC}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100">
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleExport}
                  disabled={products.length === 0}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export CSV
                </button>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterMissing}
                    onChange={(e) => setFilterMissing(e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show only products needing UPCs{" "}
                    {filterMissing && `(${filteredProducts.length} found)`}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    UPC/Barcode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.Handle}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {getProductTitle(product.Handle)}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {product.Handle}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product["Variant SKU"]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct === product.Handle &&
                      editingSKU === product["Variant SKU"] ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Enter UPC Code:
                            </label>
                            <input
                              type="text"
                              value={editingUPC}
                              onChange={(e) => setEditingUPC(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="e.g., 123456789012"
                              autoFocus
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={saveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-200"
                              title="Save UPC"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors duration-200"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span
                              className={`text-sm ${
                                product["Variant Barcode"]
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-500 italic"
                              }`}
                            >
                              {product["Variant Barcode"] || "No UPC assigned"}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              startEditing(
                                product.Handle,
                                product["Variant SKU"],
                                product["Variant Barcode"] || ""
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 ml-2 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                            title={
                              product["Variant Barcode"]
                                ? "Edit UPC"
                                : "Add UPC"
                            }
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const productKey = `${product.Handle}-${product["Variant SKU"]}`;
                        const wasEdited = editedProducts.has(productKey);

                        if (product.hasUPC) {
                          return (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                wasEdited
                                  ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200"
                                  : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200"
                              }`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {wasEdited ? "Updated UPC" : "Has UPC"}
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Missing UPC
                            </span>
                          );
                        }
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <Download className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {products.length === 0
                    ? "No products loaded yet"
                    : "No products found"}
                </h3>
                <p className="text-gray-500">
                  {products.length === 0
                    ? isLoading
                      ? "Loading Grip6 product data..."
                      : "Grip6 product data should load automatically from the database."
                    : "No products match your current filters (test products with 'copy' in the handle, products without SKUs, and products that already have UPCs are automatically excluded, but edited products remain visible)"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPCDashboard;
