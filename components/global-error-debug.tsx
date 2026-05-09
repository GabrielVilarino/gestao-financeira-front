"use client";

import { useEffect } from "react";

export function GlobalErrorDebug() {
  useEffect(() => {
    const handleError = (
      msg: string | Event,
      src?: string,
      line?: number,
      col?: number,
      err?: Error
    ) => {
      console.error("GLOBAL_ERROR", {
        msg,
        src,
        line,
        col,
        stack: err?.stack,
      });

      alert(
        JSON.stringify(
          {
            type: "GLOBAL_ERROR",
            msg,
            src,
            line,
            col,
            stack: err?.stack,
          },
          null,
          2
        )
      );

      return false;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("UNHANDLED_PROMISE_REJECTION", event.reason);

      alert(
        JSON.stringify(
          {
            type: "UNHANDLED_PROMISE_REJECTION",
            reason:
              typeof event.reason === "object"
                ? {
                    message: event.reason?.message,
                    stack: event.reason?.stack,
                  }
                : event.reason,
          },
          null,
          2
        )
      );
    };

    window.onerror = handleError;

    window.addEventListener(
      "unhandledrejection",
      handleUnhandledRejection
    );

    return () => {
      window.onerror = null;

      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return null;
}