"use client"

import { useEffect } from "react"

export function ClearSession() {
  useEffect(() => {
    localStorage.clear()
    sessionStorage.clear()

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim()
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
  }, [])

  return null
}
