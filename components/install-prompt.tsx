"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream)
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)
  }, [])

  if (isStandalone || !isIOS || dismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-start gap-3 rounded-xl border bg-background p-4 shadow-lg">
      <div className="flex-1 text-sm">
        <p className="font-medium">Instalar aplicativo</p>
        <p className="mt-1 text-muted-foreground">
          Toque em{" "}
          <span role="img" aria-label="ícone de compartilhar">
            ⎋
          </span>{" "}
          e depois em &ldquo;Adicionar à Tela Inicial&rdquo;{" "}
          <span role="img" aria-label="ícone de mais">
            ➕
          </span>
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => setDismissed(true)}
        aria-label="Fechar"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
