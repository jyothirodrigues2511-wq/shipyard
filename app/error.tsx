"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="container">
      <div className="status-container">
        <div className="status">
          <h2 className="status-title">Something went wrong</h2>
          <p className="status-text">Something went wrong loading this page.</p>
          <button
            type="button"
            className="retry-btn"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
