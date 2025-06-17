"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function DataCollector() {
  const { toast } = useToast()
  const [isInitialized, setIsInitialized] = useState(false)

  // Fonction pour collecter les données des utilisateurs
  const collectData = async () => {
    try {
      if (typeof window === "undefined") return

      // Récupérer les données du localStorage
      const dashboardResponses = localStorage.getItem("dashboard_responses")
        ? JSON.parse(localStorage.getItem("dashboard_responses") || "[]")
        : []

      // Récupérer les réponses hors ligne
      const offlineResponses = localStorage.getItem("offlineResponses")
        ? JSON.parse(localStorage.getItem("offlineResponses") || "[]")
        : []

      // Fusionner les données
      const allResponses = [...dashboardResponses, ...offlineResponses]

      // Dédupliquer les données par ID
      const uniqueResponses = allResponses.reduce((acc: any[], response: any) => {
        const exists = acc.find((r) => r.id === response.id)
        if (!exists) {
          acc.push(response)
        }
        return acc
      }, [])

      // Sauvegarder les données fusionnées
      localStorage.setItem("dashboard_responses", JSON.stringify(uniqueResponses))

      // Mettre à jour le compteur
      localStorage.setItem("dashboard_responses_count", uniqueResponses.length.toString())

      if (!isInitialized) {
        setIsInitialized(true)
      }
    } catch (error) {
      console.error("Erreur lors de la collecte des données:", error)
    }
  }

  // Collecter les données au chargement et périodiquement
  useEffect(() => {
    if (typeof window === "undefined") return

    // Collecter les données immédiatement
    collectData()

    // Puis collecter les données toutes les 30 secondes
    const interval = setInterval(collectData, 30000)

    // Écouter les événements de stockage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "offlineResponses" || event.key === null) {
        collectData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Écouter les événements personnalisés
    window.addEventListener("formSubmitted", collectData)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("formSubmitted", collectData)
    }
  }, [])

  // Composant invisible qui gère la collecte des données
  return null
}
