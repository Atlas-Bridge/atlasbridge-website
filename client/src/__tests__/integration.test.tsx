import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { memoryLocation } from "wouter/memory-location";

// Stub IntersectionObserver before any page imports (used by scroll animations)
beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

// Pages
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

const Privacy = await import("@/pages/privacy").then((m) => m.default);
const Terms = await import("@/pages/terms").then((m) => m.default);
const SecurityPage = await import("@/pages/security-page").then((m) => m.default);

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

/** Render a component at a specific route path */
function renderAtPath(path: string) {
  const { hook } = memoryLocation({ path, static: true });
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <Router hook={hook}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/security" component={SecurityPage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>,
  );
}

// ──────────────────────────────────────────────
// 1. Homepage integration tests
// ──────────────────────────────────────────────
describe("Homepage", () => {
  it("renders hero heading", () => {
    renderAtPath("/");
    expect(screen.getByText(/Controlled Autonomy for AI Agents/)).toBeInTheDocument();
  });

  it("renders navigation bar", () => {
    renderAtPath("/");
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders CTA buttons linking to docs", () => {
    renderAtPath("/");
    const getStarted = screen.getByRole("link", { name: /Get Started/ });
    const viewDocs = screen.getByRole("link", { name: /View Documentation/ });
    expect(getStarted).toHaveAttribute("href", "/docs/quickstart");
    expect(viewDocs).toHaveAttribute("href", "/docs");
  });

  it("renders main content landmark", () => {
    renderAtPath("/");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders skip-to-content link", () => {
    renderAtPath("/");
    expect(screen.getByTestId("link-skip-to-content")).toBeInTheDocument();
  });

  it("renders footer links", () => {
    renderAtPath("/");
    expect(screen.getByTestId("link-privacy")).toBeInTheDocument();
    expect(screen.getByTestId("link-terms")).toBeInTheDocument();
    expect(screen.getByTestId("link-security")).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────
// 2. Route rendering tests
// ──────────────────────────────────────────────
describe("Route rendering", () => {
  it("/privacy renders Privacy Policy page", () => {
    renderAtPath("/privacy");
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("/terms renders Terms of Use page", () => {
    renderAtPath("/terms");
    expect(screen.getByTestId("text-terms-title")).toHaveTextContent("Terms of Use");
  });

  it("/security renders Security page", () => {
    renderAtPath("/security");
    expect(screen.getByTestId("text-security-title")).toHaveTextContent("Security");
  });

  it("unknown route renders 404", () => {
    renderAtPath("/this-does-not-exist");
    expect(screen.getByText("404 Page Not Found")).toBeInTheDocument();
  });
});
