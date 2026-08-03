import { useEffect, useRef, useState } from "react";

type SquareCard = {
  attach: (selector: string) => Promise<void>;
  tokenize: (details?: unknown) => Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message: string }>;
  }>;
  destroy?: () => Promise<void>;
};

type SquarePayments = {
  card: () => Promise<SquareCard>;
};

declare global {
  interface Window {
    Square?: {
      payments: (
        applicationId: string,
        locationId: string,
      ) => SquarePayments | Promise<SquarePayments>;
    };
  }
}

function loadSquareSdk(environment: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Square) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-square-sdk], script[src*='square.js']");
    if (existing) {
      if (window.Square) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Square Web Payments SDK")),
        { once: true },
      );
      // Script may already be loaded but Square global not yet visible.
      setTimeout(() => {
        if (window.Square) resolve();
      }, 0);
      return;
    }

    const script = document.createElement("script");
    script.dataset.squareSdk = "true";
    script.src =
      environment === "production"
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Square Web Payments SDK"));
    document.head.appendChild(script);
  });
}

async function waitForContainer(containerId: string, attempts = 40): Promise<HTMLElement | null> {
  for (let i = 0; i < attempts; i += 1) {
    const el = document.getElementById(containerId);
    if (el) return el;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return null;
}

function formatSquareError(err: unknown): string {
  if (!err) return "Unable to initialize Square payment form.";
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const maybe = err as { message?: string; detail?: string; errors?: Array<{ detail?: string; message?: string }> };
    if (maybe.errors?.length) {
      return maybe.errors.map((e) => e.detail || e.message).filter(Boolean).join(", ");
    }
    if (maybe.message) return maybe.message;
    if (maybe.detail) return maybe.detail;
  }
  return String(err);
}

export function useSquareCard(containerId = "square-card-container") {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const initIdRef = useRef(0);

  useEffect(() => {
    const initId = ++initIdRef.current;
    let cancelled = false;
    const appId = (import.meta.env.VITE_SQUARE_APPLICATION_ID as string | undefined)?.trim();
    const locationId = (import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined)?.trim();
    const environment =
      (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined)?.trim() || "sandbox";

    async function init() {
      setReady(false);
      setError(null);

      if (!appId || !locationId || appId.includes("xxxxxxxx")) {
        setError("Square application ID / location ID is not configured in .env");
        return;
      }

      const container = await waitForContainer(containerId);
      if (cancelled || initId !== initIdRef.current) return;
      if (!container) {
        setError("Payment form container is missing from the page.");
        return;
      }

      container.innerHTML = "";

      try {
        await loadSquareSdk(environment);
        if (cancelled || initId !== initIdRef.current) return;
        if (!window.Square) {
          setError("Square SDK loaded but window.Square is unavailable.");
          return;
        }

        const payments = await Promise.resolve(window.Square.payments(appId, locationId));
        if (cancelled || initId !== initIdRef.current) return;

        const card = await payments.card();
        await card.attach(`#${CSS.escape(containerId)}`);
        if (cancelled || initId !== initIdRef.current) {
          await card.destroy?.();
          return;
        }

        cardRef.current = card;
        setReady(true);
      } catch (err) {
        console.error("[Square card init]", err);
        if (!cancelled && initId === initIdRef.current) {
          setError(formatSquareError(err));
          setReady(false);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
      const card = cardRef.current;
      cardRef.current = null;
      void card?.destroy?.().catch(() => undefined);
    };
  }, [containerId]);

  const tokenize = async (details?: unknown) => {
    if (!cardRef.current) {
      throw new Error("Payment form is not ready.");
    }
    return cardRef.current.tokenize(details);
  };

  return { ready, error, tokenize };
}
