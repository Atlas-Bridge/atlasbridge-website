import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/pages/not-found";

describe("NotFound page", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByText("404 Page Not Found")).toBeInTheDocument();
  });

  it("renders helpful message", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/Did you forget to add the page to the router/),
    ).toBeInTheDocument();
  });
});
