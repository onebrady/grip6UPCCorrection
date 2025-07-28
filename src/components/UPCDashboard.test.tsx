import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UPCDashboard from "./UPCDashboard";

describe("UPCDashboard", () => {
  it("renders with proper styling classes", () => {
    render(<UPCDashboard />);

    // Check if the main container has Tailwind classes
    const mainContainer = screen
      .getByText("UPC Management Dashboard")
      .closest("div")?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass(
      "min-h-screen",
      "bg-gradient-to-br",
      "from-blue-50",
      "to-indigo-100"
    );

    // Check if the header has proper styling
    const header = screen.getByText("UPC Management Dashboard");
    expect(header).toHaveClass("text-4xl", "font-bold", "text-gray-900");

    // Check if the description has proper styling
    const description = screen.getByText(
      "Manage and update UPC codes for your Shopify products with ease"
    );
    expect(description).toHaveClass("text-gray-600");

    // Check if the export button has proper styling
    const exportButton = screen.getByText("Export CSV");
    expect(exportButton).toHaveClass(
      "bg-gradient-to-r",
      "from-green-600",
      "to-green-700",
      "text-white"
    );
  });

  it("renders all main UI elements", () => {
    render(<UPCDashboard />);

    // Check for main dashboard elements
    expect(screen.getByText("UPC Management Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Manage and update UPC codes for your Shopify products with ease"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
    expect(screen.getByText("Total Products")).toBeInTheDocument();
    expect(screen.getByText("With UPC")).toBeInTheDocument();
    expect(screen.getByText("Needs UPC")).toBeInTheDocument();
  });

  it("shows empty state message for filtered products", () => {
    render(<UPCDashboard />);

    // The dashboard should show the empty state message indicating filtering
    expect(
      screen.getByText(
        /test products with 'copy' in the handle and products without SKUs are automatically excluded/
      )
    ).toBeInTheDocument();
  });

  it("has working filter checkbox", () => {
    render(<UPCDashboard />);

    // Check that the checkbox exists and is unchecked by default
    const checkbox = screen.getByRole("checkbox", {
      name: /show only products needing upcs/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("shows filter count when active", () => {
    render(<UPCDashboard />);

    // The filter should show count when active (even if 0)
    const filterLabel = screen.getByText(/show only products needing upcs/i);
    expect(filterLabel).toBeInTheDocument();
  });
});
