import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  parseCSV,
  processProductsWithUPC,
  exportToCSV,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "./csvUtils";
import type { Product } from "../types/product";

describe("CSV Utils", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock localStorage methods
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it("should parse CSV data correctly", () => {
    const csvData = `Handle,Title,Variant SKU,Variant Barcode
product-1,Test Product 1,SKU1,123456789
product-2,Test Product 2,SKU2,`;

    const result = parseCSV(csvData);

    expect(result).toHaveLength(2);
    expect(result[0]["Handle"]).toBe("product-1");
    expect(result[0]["Title"]).toBe("Test Product 1");
    expect(result[0]["Variant SKU"]).toBe("SKU1");
    expect(result[0]["Variant Barcode"]).toBe("123456789");
    expect(result[1]["Handle"]).toBe("product-2");
    expect(result[1]["Title"]).toBe("Test Product 2");
    expect(result[1]["Variant SKU"]).toBe("SKU2");
    expect(result[1]["Variant Barcode"]).toBe("");
  });

  it("should process products with UPC status correctly", () => {
    const products: Product[] = [
      {
        Handle: "product-1",
        Title: "Test Product 1",
        "Body (HTML)": "",
        Vendor: "",
        "Product Category": "",
        Type: "",
        Tags: "",
        Published: "",
        "Option1 Name": "",
        "Option1 Value": "",
        "Option1 Linked To": "",
        "Option2 Name": "",
        "Option2 Value": "",
        "Option2 Linked To": "",
        "Option3 Name": "",
        "Option3 Value": "",
        "Option3 Linked To": "",
        "Variant SKU": "SKU1",
        "Variant Grams": "",
        "Variant Inventory Tracker": "",
        "Variant Inventory Qty": "",
        "Variant Inventory Policy": "",
        "Variant Fulfillment Service": "",
        "Variant Price": "",
        "Variant Compare At Price": "",
        "Variant Requires Shipping": "",
        "Variant Taxable": "",
        "Variant Barcode": "123456789",
        "Image Src": "",
        "Image Position": "",
        "Image Alt Text": "",
        "Gift Card": "",
        "SEO Title": "",
        "SEO Description": "",
        "Google Shopping / Google Product Category": "",
        "Google Shopping / Gender": "",
        "Google Shopping / Age Group": "",
        "Google Shopping / MPN": "",
        "Google Shopping / Condition": "",
        "Google Shopping / Custom Product": "",
        "Google Shopping / Custom Label 0": "",
        "Google Shopping / Custom Label 1": "",
        "Google Shopping / Custom Label 2": "",
        "Google Shopping / Custom Label 3": "",
        "Google Shopping / Custom Label 4": "",
        "Checkout Blocks Rule Trigger (product.metafields.checkoutblocks.trigger)":
          "",
        "Activity (product.metafields.custom.activity)": "",
        "Badges (product.metafields.custom.badges)": "",
        "Buckle Color (product.metafields.custom.buckle_color)": "",
        "Buckle Material  (product.metafields.custom.buckle_material_)": "",
        "Buckle Width (product.metafields.custom.buckle_width)": "",
        "Bundle (product.metafields.custom.bundle)": "",
        "image with text - text (product.metafields.custom.image_with_text_text)":
          "",
        "Packs (product.metafields.custom.packs)": "",
        "Other (product.metafields.custom.product)": "",
        "Product Category (product.metafields.custom.product_category)": "",
        "Product Feature (product.metafields.custom.product_feature)": "",
        "Season (product.metafields.custom.season)": "",
        "Shipping (product.metafields.custom.shipping)": "",
        "Sock Color (product.metafields.custom.sock_color)": "",
        "Style (product.metafields.custom.sock_height)": "",
        "Buckle Style (product.metafields.custom.style)": "",
        "Video (product.metafields.custom.video)": "",
        "Warranty (product.metafields.custom.warranty)": "",
        "Wool Info (product.metafields.custom.wool_info)": "",
        "Google: Custom Product (product.metafields.mm-google-shopping.custom_product)":
          "",
        "Product rating count (product.metafields.reviews.rating_count)": "",
        "Hidden Product (product.metafields.seo.hidden)": "",
        "Accessory size (product.metafields.shopify.accessory-size)": "",
        "Activity (product.metafields.shopify.activity)": "",
        "Clothing features (product.metafields.shopify.clothing-features)": "",
        "Color (product.metafields.shopify.color-pattern)": "",
        "Fabric (product.metafields.shopify.fabric)": "",
        "Target gender (product.metafields.shopify.target-gender)": "",
        "Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)":
          "",
        "Related products (product.metafields.shopify--discovery--product_recommendation.related_products)":
          "",
        "Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)":
          "",
        "Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)":
          "",
        "Variant Image": "",
        "Variant Weight Unit": "",
        "Variant Tax Code": "",
        "Cost per item": "",
        "Included / United States": "",
        "Price / United States": "",
        "Compare At Price / United States": "",
        "Included / Brunei": "",
        "Price / Brunei": "",
        "Compare At Price / Brunei": "",
        "Included / Canada": "",
        "Price / Canada": "",
        "Compare At Price / Canada": "",
        "Included / International": "",
        "Price / International": "",
        "Compare At Price / International": "",
        Status: "",
      },
      {
        Handle: "product-2",
        Title: "Test Product 2",
        "Body (HTML)": "",
        Vendor: "",
        "Product Category": "",
        Type: "",
        Tags: "",
        Published: "",
        "Option1 Name": "",
        "Option1 Value": "",
        "Option1 Linked To": "",
        "Option2 Name": "",
        "Option2 Value": "",
        "Option2 Linked To": "",
        "Option3 Name": "",
        "Option3 Value": "",
        "Option3 Linked To": "",
        "Variant SKU": "SKU2",
        "Variant Grams": "",
        "Variant Inventory Tracker": "",
        "Variant Inventory Qty": "",
        "Variant Inventory Policy": "",
        "Variant Fulfillment Service": "",
        "Variant Price": "",
        "Variant Compare At Price": "",
        "Variant Requires Shipping": "",
        "Variant Taxable": "",
        "Variant Barcode": "",
        "Image Src": "",
        "Image Position": "",
        "Image Alt Text": "",
        "Gift Card": "",
        "SEO Title": "",
        "SEO Description": "",
        "Google Shopping / Google Product Category": "",
        "Google Shopping / Gender": "",
        "Google Shopping / Age Group": "",
        "Google Shopping / MPN": "",
        "Google Shopping / Condition": "",
        "Google Shopping / Custom Product": "",
        "Google Shopping / Custom Label 0": "",
        "Google Shopping / Custom Label 1": "",
        "Google Shopping / Custom Label 2": "",
        "Google Shopping / Custom Label 3": "",
        "Google Shopping / Custom Label 4": "",
        "Checkout Blocks Rule Trigger (product.metafields.checkoutblocks.trigger)":
          "",
        "Activity (product.metafields.custom.activity)": "",
        "Badges (product.metafields.custom.badges)": "",
        "Buckle Color (product.metafields.custom.buckle_color)": "",
        "Buckle Material  (product.metafields.custom.buckle_material_)": "",
        "Buckle Width (product.metafields.custom.buckle_width)": "",
        "Bundle (product.metafields.custom.bundle)": "",
        "image with text - text (product.metafields.custom.image_with_text_text)":
          "",
        "Packs (product.metafields.custom.packs)": "",
        "Other (product.metafields.custom.product)": "",
        "Product Category (product.metafields.custom.product_category)": "",
        "Product Feature (product.metafields.custom.product_feature)": "",
        "Season (product.metafields.custom.season)": "",
        "Shipping (product.metafields.custom.shipping)": "",
        "Sock Color (product.metafields.custom.sock_color)": "",
        "Style (product.metafields.custom.sock_height)": "",
        "Buckle Style (product.metafields.custom.style)": "",
        "Video (product.metafields.custom.video)": "",
        "Warranty (product.metafields.custom.warranty)": "",
        "Wool Info (product.metafields.custom.wool_info)": "",
        "Google: Custom Product (product.metafields.mm-google-shopping.custom_product)":
          "",
        "Product rating count (product.metafields.reviews.rating_count)": "",
        "Hidden Product (product.metafields.seo.hidden)": "",
        "Accessory size (product.metafields.shopify.accessory-size)": "",
        "Activity (product.metafields.shopify.activity)": "",
        "Clothing features (product.metafields.shopify.clothing-features)": "",
        "Color (product.metafields.shopify.color-pattern)": "",
        "Fabric (product.metafields.shopify.fabric)": "",
        "Target gender (product.metafields.shopify.target-gender)": "",
        "Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)":
          "",
        "Related products (product.metafields.shopify--discovery--product_recommendation.related_products)":
          "",
        "Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)":
          "",
        "Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)":
          "",
        "Variant Image": "",
        "Variant Weight Unit": "",
        "Variant Tax Code": "",
        "Cost per item": "",
        "Included / United States": "",
        "Price / United States": "",
        "Compare At Price / United States": "",
        "Included / Brunei": "",
        "Price / Brunei": "",
        "Compare At Price / Brunei": "",
        "Included / Canada": "",
        "Price / Canada": "",
        "Compare At Price / Canada": "",
        "Included / International": "",
        "Price / International": "",
        "Compare At Price / International": "",
        Status: "",
      },
    ];

    const result = processProductsWithUPC(products);

    expect(result).toHaveLength(2);
    expect(result[0].hasUPC).toBe(true);
    expect(result[0].upcMissing).toBe(false);
    expect(result[1].hasUPC).toBe(false);
    expect(result[1].upcMissing).toBe(true);
  });

  it("should export products to CSV", () => {
    const products: Product[] = [
      {
        Handle: "product-1",
        Title: "Test Product 1",
        "Body (HTML)": "",
        Vendor: "",
        "Product Category": "",
        Type: "",
        Tags: "",
        Published: "",
        "Option1 Name": "",
        "Option1 Value": "",
        "Option1 Linked To": "",
        "Option2 Name": "",
        "Option2 Value": "",
        "Option2 Linked To": "",
        "Option3 Name": "",
        "Option3 Value": "",
        "Option3 Linked To": "",
        "Variant SKU": "SKU1",
        "Variant Grams": "",
        "Variant Inventory Tracker": "",
        "Variant Inventory Qty": "",
        "Variant Inventory Policy": "",
        "Variant Fulfillment Service": "",
        "Variant Price": "",
        "Variant Compare At Price": "",
        "Variant Requires Shipping": "",
        "Variant Taxable": "",
        "Variant Barcode": "123456789",
        "Image Src": "",
        "Image Position": "",
        "Image Alt Text": "",
        "Gift Card": "",
        "SEO Title": "",
        "SEO Description": "",
        "Google Shopping / Google Product Category": "",
        "Google Shopping / Gender": "",
        "Google Shopping / Age Group": "",
        "Google Shopping / MPN": "",
        "Google Shopping / Condition": "",
        "Google Shopping / Custom Product": "",
        "Google Shopping / Custom Label 0": "",
        "Google Shopping / Custom Label 1": "",
        "Google Shopping / Custom Label 2": "",
        "Google Shopping / Custom Label 3": "",
        "Google Shopping / Custom Label 4": "",
        "Checkout Blocks Rule Trigger (product.metafields.checkoutblocks.trigger)":
          "",
        "Activity (product.metafields.custom.activity)": "",
        "Badges (product.metafields.custom.badges)": "",
        "Buckle Color (product.metafields.custom.buckle_color)": "",
        "Buckle Material  (product.metafields.custom.buckle_material_)": "",
        "Buckle Width (product.metafields.custom.buckle_width)": "",
        "Bundle (product.metafields.custom.bundle)": "",
        "image with text - text (product.metafields.custom.image_with_text_text)":
          "",
        "Packs (product.metafields.custom.packs)": "",
        "Other (product.metafields.custom.product)": "",
        "Product Category (product.metafields.custom.product_category)": "",
        "Product Feature (product.metafields.custom.product_feature)": "",
        "Season (product.metafields.custom.season)": "",
        "Shipping (product.metafields.custom.shipping)": "",
        "Sock Color (product.metafields.custom.sock_color)": "",
        "Style (product.metafields.custom.sock_height)": "",
        "Buckle Style (product.metafields.custom.style)": "",
        "Video (product.metafields.custom.video)": "",
        "Warranty (product.metafields.custom.warranty)": "",
        "Wool Info (product.metafields.custom.wool_info)": "",
        "Google: Custom Product (product.metafields.mm-google-shopping.custom_product)":
          "",
        "Product rating count (product.metafields.reviews.rating_count)": "",
        "Hidden Product (product.metafields.seo.hidden)": "",
        "Accessory size (product.metafields.shopify.accessory-size)": "",
        "Activity (product.metafields.shopify.activity)": "",
        "Clothing features (product.metafields.shopify.clothing-features)": "",
        "Color (product.metafields.shopify.color-pattern)": "",
        "Fabric (product.metafields.shopify.fabric)": "",
        "Target gender (product.metafields.shopify.target-gender)": "",
        "Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)":
          "",
        "Related products (product.metafields.shopify--discovery--product_recommendation.related_products)":
          "",
        "Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)":
          "",
        "Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)":
          "",
        "Variant Image": "",
        "Variant Weight Unit": "",
        "Variant Tax Code": "",
        "Cost per item": "",
        "Included / United States": "",
        "Price / United States": "",
        "Compare At Price / United States": "",
        "Included / Brunei": "",
        "Price / Brunei": "",
        "Compare At Price / Brunei": "",
        "Included / Canada": "",
        "Price / Canada": "",
        "Compare At Price / Canada": "",
        "Included / International": "",
        "Price / International": "",
        "Compare At Price / International": "",
        Status: "",
      },
    ];

    const result = exportToCSV(products);

    expect(result).toContain("Handle");
    expect(result).toContain("Title");
    expect(result).toContain("Variant SKU");
    expect(result).toContain("Variant Barcode");
    expect(result).toContain("product-1");
    expect(result).toContain("Test Product 1");
    expect(result).toContain("SKU1");
    expect(result).toContain("123456789");
  });

  it("should save and load from localStorage", () => {
    const products: Product[] = [
      {
        Handle: "product-1",
        Title: "Test Product 1",
        "Body (HTML)": "",
        Vendor: "",
        "Product Category": "",
        Type: "",
        Tags: "",
        Published: "",
        "Option1 Name": "",
        "Option1 Value": "",
        "Option1 Linked To": "",
        "Option2 Name": "",
        "Option2 Value": "",
        "Option2 Linked To": "",
        "Option3 Name": "",
        "Option3 Value": "",
        "Option3 Linked To": "",
        "Variant SKU": "SKU1",
        "Variant Grams": "",
        "Variant Inventory Tracker": "",
        "Variant Inventory Qty": "",
        "Variant Inventory Policy": "",
        "Variant Fulfillment Service": "",
        "Variant Price": "",
        "Variant Compare At Price": "",
        "Variant Requires Shipping": "",
        "Variant Taxable": "",
        "Variant Barcode": "123456789",
        "Image Src": "",
        "Image Position": "",
        "Image Alt Text": "",
        "Gift Card": "",
        "SEO Title": "",
        "SEO Description": "",
        "Google Shopping / Google Product Category": "",
        "Google Shopping / Gender": "",
        "Google Shopping / Age Group": "",
        "Google Shopping / MPN": "",
        "Google Shopping / Condition": "",
        "Google Shopping / Custom Product": "",
        "Google Shopping / Custom Label 0": "",
        "Google Shopping / Custom Label 1": "",
        "Google Shopping / Custom Label 2": "",
        "Google Shopping / Custom Label 3": "",
        "Google Shopping / Custom Label 4": "",
        "Checkout Blocks Rule Trigger (product.metafields.checkoutblocks.trigger)":
          "",
        "Activity (product.metafields.custom.activity)": "",
        "Badges (product.metafields.custom.badges)": "",
        "Buckle Color (product.metafields.custom.buckle_color)": "",
        "Buckle Material  (product.metafields.custom.buckle_material_)": "",
        "Buckle Width (product.metafields.custom.buckle_width)": "",
        "Bundle (product.metafields.custom.bundle)": "",
        "image with text - text (product.metafields.custom.image_with_text_text)":
          "",
        "Packs (product.metafields.custom.packs)": "",
        "Other (product.metafields.custom.product)": "",
        "Product Category (product.metafields.custom.product_category)": "",
        "Product Feature (product.metafields.custom.product_feature)": "",
        "Season (product.metafields.custom.season)": "",
        "Shipping (product.metafields.custom.shipping)": "",
        "Sock Color (product.metafields.custom.sock_color)": "",
        "Style (product.metafields.custom.sock_height)": "",
        "Buckle Style (product.metafields.custom.style)": "",
        "Video (product.metafields.custom.video)": "",
        "Warranty (product.metafields.custom.warranty)": "",
        "Wool Info (product.metafields.custom.wool_info)": "",
        "Google: Custom Product (product.metafields.mm-google-shopping.custom_product)":
          "",
        "Product rating count (product.metafields.reviews.rating_count)": "",
        "Hidden Product (product.metafields.seo.hidden)": "",
        "Accessory size (product.metafields.shopify.accessory-size)": "",
        "Activity (product.metafields.shopify.activity)": "",
        "Clothing features (product.metafields.shopify.clothing-features)": "",
        "Color (product.metafields.shopify.color-pattern)": "",
        "Fabric (product.metafields.shopify.fabric)": "",
        "Target gender (product.metafields.shopify.target-gender)": "",
        "Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)":
          "",
        "Related products (product.metafields.shopify--discovery--product_recommendation.related_products)":
          "",
        "Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)":
          "",
        "Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)":
          "",
        "Variant Image": "",
        "Variant Weight Unit": "",
        "Variant Tax Code": "",
        "Cost per item": "",
        "Included / United States": "",
        "Price / United States": "",
        "Compare At Price / United States": "",
        "Included / Brunei": "",
        "Price / Brunei": "",
        "Compare At Price / Brunei": "",
        "Included / Canada": "",
        "Price / Canada": "",
        "Compare At Price / Canada": "",
        "Included / International": "",
        "Price / International": "",
        "Compare At Price / International": "",
        Status: "",
      },
    ];

    // Mock localStorage to return the saved data
    const mockGetItem = vi.fn();
    const mockSetItem = vi.fn();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        clear: vi.fn(),
      },
      writable: true,
    });

    // Mock the getItem to return the JSON string when called with the correct key
    mockGetItem.mockReturnValue(JSON.stringify(products));

    saveToLocalStorage(products);
    const loaded = loadFromLocalStorage();

    expect(mockSetItem).toHaveBeenCalledWith(
      "upc-dashboard-data",
      JSON.stringify(products)
    );
    expect(loaded).toEqual(products);
  });
});
