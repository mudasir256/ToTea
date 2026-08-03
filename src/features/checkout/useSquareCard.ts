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

declare global {
  interface Window {
    Square?: {
      payments: (
        applicationId: string,
        locationId: string,
      ) => Promise<{
        card: () => Promise<SquareCard>;
      }>;
    };
  }
}

function loadSquareSdk(environment: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Square) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>("script[data-square-sdk]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Square Web Payments SDK")),
        { once: true },
      );
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
    document.body.appendChild(script);
  });
}

export function useSquareCard(containerId = "square-card-container") {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);

  useEffect(() => {
    let cancelled = false;
    const appId = (import.meta.env.VITE_SQUARE_APPLICATION_ID as string | undefined)?.trim();
    const locationId = (import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined)?.trim();
    const environment =
      (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined)?.trim() || "sandbox";

    async function init() {
      setReady(false);
      setError(null);

      if (!appId || !locationId || appId.includes("xxxxxxxx")) {
        setError("Square application ID / location ID is not configured.");
        return;
      }

      // Wait a tick so the container is in the DOM after route paint.
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
      if (cancelled) return;

      const container = document.getElementById(containerId);
      if (!container) {
        setError("Payment form container is missing.");
        return;
      }
      container.innerHTML = "";

      try {
        await loadSquareSdk(environment);
        if (cancelled || !window.Square) return;

        const payments = await window.Square.payments(appId, locationId);
        const card = await payments.card();
        await card.attach(`#${containerId}`);
        if (cancelled) {
          await card.destroy?.();
          return;
        }
        cardRef.current = card;
        setReady(true);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to initialize Square payment form.",
          );
          setReady(false);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
      void cardRef.current?.destroy?.();
      cardRef.current = null;
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
