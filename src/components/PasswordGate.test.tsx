import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PasswordGate from "./PasswordGate";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("PasswordGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders password form when not authenticated", () => {
    render(
      <PasswordGate>
        <div>Dashboard Content</div>
      </PasswordGate>
    );

    expect(screen.getByText("UPC Management Dashboard")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByText("Access Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("shows dashboard when correct password is entered", () => {
    render(
      <PasswordGate>
        <div>Dashboard Content</div>
      </PasswordGate>
    );

    const passwordInput = screen.getByPlaceholderText("Enter password");
    const submitButton = screen.getByText("Access Dashboard");

    fireEvent.change(passwordInput, { target: { value: "grip6upc" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "upc-dashboard-auth",
      "true"
    );
  });

  it("shows error for incorrect password", () => {
    render(
      <PasswordGate>
        <div>Dashboard Content</div>
      </PasswordGate>
    );

    const passwordInput = screen.getByPlaceholderText("Enter password");
    const submitButton = screen.getByText("Access Dashboard");

    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Incorrect password. Please try again.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("shows dashboard when already authenticated", () => {
    localStorageMock.getItem.mockReturnValue("true");

    render(
      <PasswordGate>
        <div>Dashboard Content</div>
      </PasswordGate>
    );

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("logs out when logout button is clicked", () => {
    localStorageMock.getItem.mockReturnValue("true");

    render(
      <PasswordGate>
        <div>Dashboard Content</div>
      </PasswordGate>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(screen.getByText("UPC Management Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      "upc-dashboard-auth"
    );
  });
});
