"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export const NotificationSystem = () => {
  const { toast } = useToast()

  useEffect(() => {
    const handleSync = (event: any) => {
      if (event.tag === "sync-responses") {
        toast({
          title: "Synchronisation des données",
          description: "Les données hors ligne sont en cours de synchronisation.",
        })
      }
    }

    navigator.serviceWorker.addEventListener("message", (event: any) => {
      if (event.data && event.data.type === "SYNC_COMPLETE") {
        toast({
          title: "Synchronisation terminée",
          description: "Toutes les données hors ligne ont été synchronisées avec succès.",
        })
      }
    })

    window.addEventListener("sync", handleSync)

    return () => {
      window.removeEventListener("sync", handleSync)
    }
  }, [toast])

  return null
}
