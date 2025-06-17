"use client"

import { useState, useEffect } from "react"
import { WifiOff, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function OfflineStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  // Vérifier l'état de la connexion et le nombre de réponses en attente
  useEffect(() => {
    const checkStatus = () => {
      setIsOnline(navigator.onLine)

      // Vérifier les réponses en attente
      try {
        const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
        const pendingRequests = JSON.parse(localStorage.getItem("pendingRequests") || "[]")

        // Compter uniquement les éléments avec pendingSync = true
        const pendingOfflineCount = offlineResponses.filter((r: any) => r.pendingSync).length
        const pendingRequestsCount = pendingRequests.length

        setPendingCount(pendingOfflineCount + pendingRequestsCount)
      } catch (e) {
        console.error("Erreur lors de la vérification des réponses en attente:", e)
      }
    }

    // Vérifier immédiatement
    checkStatus()

    // Configurer les écouteurs d'événements
    window.addEventListener("online", checkStatus)
    window.addEventListener("offline", checkStatus)
    window.addEventListener("storage", checkStatus)
    window.addEventListener("formSubmitted", checkStatus)

    // Vérifier périodiquement
    const interval = setInterval(checkStatus, 10000)

    return () => {
      window.removeEventListener("online", checkStatus)
      window.removeEventListener("offline", checkStatus)
      window.removeEventListener("storage", checkStatus)
      window.removeEventListener("formSubmitted", checkStatus)
      clearInterval(interval)
    }
  }, [])

  // Fonction pour forcer la synchronisation
  const syncNow = async () => {
    if (!navigator.onLine) {
      toast({
        title: "Impossible de synchroniser",
        description:
          "Vous êtes actuellement hors ligne. Veuillez vous connecter à Internet pour synchroniser vos réponses.",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    toast({
      title: "Synchronisation en cours",
      description: "Tentative de synchronisation des réponses en attente...",
    })

    try {
      // Tenter de synchroniser via le service worker
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register("sync-responses")

        // Attendre un peu pour laisser le temps au service worker de traiter
        setTimeout(() => {
          // Vérifier si la synchronisation a réussi
          const checkIfSynced = () => {
            try {
              const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
              const pendingRequests = JSON.parse(localStorage.getItem("pendingRequests") || "[]")

              const pendingOfflineCount = offlineResponses.filter((r: any) => r.pendingSync).length
              const pendingRequestsCount = pendingRequests.length

              if (pendingOfflineCount + pendingRequestsCount < pendingCount) {
                toast({
                  title: "Synchronisation réussie",
                  description: `${pendingCount - (pendingOfflineCount + pendingRequestsCount)} réponses ont été synchronisées.`,
                })
              } else {
                toast({
                  title: "Synchronisation incomplète",
                  description: "Certaines réponses n'ont pas pu être synchronisées. Réessayez plus tard.",
                  variant: "destructive",
                })
              }

              setPendingCount(pendingOfflineCount + pendingRequestsCount)
            } catch (e) {
              console.error("Erreur lors de la vérification post-synchronisation:", e)
            }

            setIsSyncing(false)
          }

          checkIfSynced()
        }, 3000)
      } else {
        // Synchronisation manuelle si l'API Sync n'est pas disponible
        await manualSync()
        setIsSyncing(false)
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error)
      toast({
        title: "Erreur de synchronisation",
        description: "Une erreur est survenue lors de la synchronisation. Veuillez réessayer.",
        variant: "destructive",
      })
      setIsSyncing(false)
    }
  }

  // Synchronisation manuelle (fallback)
  const manualSync = async () => {
    try {
      // Récupérer les réponses en attente
      const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
      const pendingRequests = JSON.parse(localStorage.getItem("pendingRequests") || "[]")

      let syncedCount = 0

      // Synchroniser les réponses
      for (const response of offlineResponses) {
        if (response.pendingSync) {
          try {
            const result = await fetch("/api/submit-response", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            })

            if (result.ok) {
              response.pendingSync = false
              syncedCount++
            }
          } catch (e) {
            console.error("Erreur lors de la synchronisation d'une réponse:", e)
          }
        }
      }

      // Mettre à jour le localStorage
      localStorage.setItem("offlineResponses", JSON.stringify(offlineResponses))

      // Synchroniser les requêtes en attente
      const remainingRequests = []
      for (const request of pendingRequests) {
        try {
          const result = await fetch(request.url, {
            method: request.method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request.data),
          })

          if (result.ok) {
            syncedCount++
          } else {
            remainingRequests.push(request)
          }
        } catch (e) {
          console.error("Erreur lors de la synchronisation d'une requête:", e)
          remainingRequests.push(request)
        }
      }

      // Mettre à jour le localStorage
      localStorage.setItem("pendingRequests", JSON.stringify(remainingRequests))

      // Notifier l'utilisateur
      if (syncedCount > 0) {
        toast({
          title: "Synchronisation réussie",
          description: `${syncedCount} réponses ont été synchronisées.`,
        })

        // Déclencher l'événement pour mettre à jour les statistiques
        window.dispatchEvent(new Event("formSubmitted"))
      } else {
        toast({
          title: "Aucune synchronisation",
          description: "Aucune réponse n'a pu être synchronisée.",
        })
      }
    } catch (e) {
      console.error("Erreur lors de la synchronisation manuelle:", e)
      throw e
    }
  }

  // Ne rien afficher s'il n'y a pas de problème
  if (isOnline && pendingCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-3 max-w-xs">
        <div className="flex items-start space-x-3">
          {!isOnline ? (
            <WifiOff className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          ) : (
            <RefreshCw
              className={`h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0 ${pendingCount > 0 ? "animate-spin" : ""}`}
            />
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{!isOnline ? "Mode hors ligne" : "Synchronisation"}</h3>

              {pendingCount > 0 && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                  {pendingCount} en attente
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {!isOnline
                ? "Vos réponses sont enregistrées localement et seront synchronisées automatiquement lorsque vous serez en ligne."
                : pendingCount > 0
                  ? "Des réponses sont en attente de synchronisation avec le serveur."
                  : "Toutes les réponses sont synchronisées."}
            </p>

            {isOnline && pendingCount > 0 && (
              <Button size="sm" className="mt-2 w-full" onClick={syncNow} disabled={isSyncing}>
                {isSyncing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Synchroniser maintenant
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
