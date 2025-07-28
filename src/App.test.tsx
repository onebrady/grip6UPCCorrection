import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the UPC dashboard", () => {
    render(<App />);

    // Check if the main dashboard title is rendered
    expect(screen.getByText("UPC Management Dashboard")).toBeInTheDocument();

    // Check if the description is rendered
    expect(
      screen.getByText("Manage and update UPC codes for your Shopify products")
    ).toBeInTheDocument();

    // Check if the upload button is present
    expect(screen.getByText("Upload CSV")).toBeInTheDocument();
  });
});
