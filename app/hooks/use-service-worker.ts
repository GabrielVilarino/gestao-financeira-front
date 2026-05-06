"use client"

import { useEffect } from "react"

export function useServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((error) => {
          console.error("Erro ao registrar service worker:", error)
        })
    }
  }, [])
}
