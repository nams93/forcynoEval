"use client"

import { useState, useEffect, useRef } from "react"
import { SatisfactionForm } from "@/components/satisfaction-form"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FormPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(true)
  const [pendingResponses, setPendingResponses] = useState<any[]>([])
  const initialized = useRef(false)
  const [formSubmittedEvent, setFormSubmittedEvent] = useState<Event | null>(null)
  const [redirectToHome, setRedirectToHome] = useState(false) // State for redirection
  const activityInterval = useRef<NodeJS.Timeout | null>(null)
  const [section, setSection] = useState<string>("")

  // Créer l'événement une seule fois après le montage du composant
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormSubmittedEvent(new Event("formSubmitted"))
    }
  }, [])

  // Générer un ID de session unique pour suivre cet utilisateur
  useEffect(() => {
    // Éviter les exécutions multiples avec useRef
    if (initialized.current) return
    initialized.current = true

    const newSessionId = uuidv4()
    setSessionId(newSessionId)

    // Récupérer les réponses en attente du localStorage
    const storedResponses = localStorage.getItem("pendingResponses")
    if (storedResponses) {
      try {
        setPendingResponses(JSON.parse(storedResponses))
      } catch (e) {
        console.error("Erreur lors de la récupération des réponses en attente:", e)
      }
    }

    // Détecter le type d'appareil
    const getDeviceInfo = () => {
      const userAgent = navigator.userAgent
      let deviceInfo = "Ordinateur"

      if (/Android/i.test(userAgent)) {
        deviceInfo = "Android"
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceInfo = "iOS"
      } else if (/Windows Phone/i.test(userAgent)) {
        deviceInfo = "Windows Phone"
      } else if (/Windows/i.test(userAgent)) {
        deviceInfo = "Windows"
      } else if (/Macintosh/i.test(userAgent)) {
        deviceInfo = "Mac"
      } else if (/Linux/i.test(userAgent)) {
        deviceInfo = "Linux"
      }

      return deviceInfo
    }

    // Enregistrer la connexion
    const registerConnection = async () => {
      try {
        const response = await fetch("/api/active-connections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "register",
            sessionId: newSessionId,
            timestamp: new Date().toISOString(),
            deviceInfo: getDeviceInfo(),
            online: navigator.onLine,
          }),
        })

        if (!response.ok) {
          // Si hors ligne, stocker pour synchronisation ultérieure
          const connectionData = {
            sessionId: newSessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            deviceInfo: getDeviceInfo(),
            type: "connection",
          }
          const updatedResponses = [...pendingResponses, connectionData]
          setPendingResponses(updatedResponses)
          localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))
        }
      } catch (error) {
        // Si hors ligne, stocker pour synchronisation ultérieure
        const connectionData = {
          sessionId: newSessionId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          deviceInfo: getDeviceInfo(),
          type: "connection",
        }
        const updatedResponses = [...pendingResponses, connectionData]
        setPendingResponses(updatedResponses)
        localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))
      }
    }

    registerConnection()

    // Configurer l'intervalle pour envoyer des mises à jour d'activité
    activityInterval.current = setInterval(() => {
      if (navigator.onLine) {
        fetch("/api/active-connections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update_activity",
            sessionId: newSessionId,
            section: section,
            lastActivity: new Date().toISOString(),
          }),
        }).catch((err) => console.error("Erreur lors de la mise à jour de l'activité:", err))
      }
    }, 30000) // Toutes les 30 secondes

    // Nettoyer à la fermeture
    return () => {
      // Nettoyer l'intervalle d'activité
      if (activityInterval.current) {
        clearInterval(activityInterval.current)
      }

      // Enregistrer la déconnexion si possible
      if (typeof window !== "undefined" && navigator.onLine) {
        // Utiliser sendBeacon pour une déconnexion plus fiable lors de la fermeture de la page
        const data = JSON.stringify({
          action: "unregister",
          sessionId: newSessionId,
        })

        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/active-connections", data)
        } else {
          // Fallback si sendBeacon n'est pas disponible
          fetch("/api/active-connections", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: data,
            keepalive: true,
          }).catch(() => {
            // Ignorer les erreurs de déconnexion
          })
        }
      }
    }
  }, [])

  // Mettre à jour la section lorsqu'elle change
  useEffect(() => {
    if (sessionId && section && navigator.onLine) {
      fetch("/api/active-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update_activity",
          sessionId,
          section,
          lastActivity: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Erreur lors de la mise à jour de la section:", err))
    }
  }, [sessionId, section])

  // Surveiller l'état de la connexion
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)

      // Si de retour en ligne, essayer de synchroniser les réponses en attente
      if (navigator.onLine && pendingResponses.length > 0) {
        synchronizePendingResponses()
      }
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Définir l'état initial
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [pendingResponses])

  // Fonction pour synchroniser les réponses en attente
  const synchronizePendingResponses = async () => {
    const newPendingResponses = [...pendingResponses]
    let hasChanges = false

    for (let i = 0; i < newPendingResponses.length; i++) {
      const item = newPendingResponses[i]

      try {
        let endpoint = ""
        if (item.type === "connection") {
          endpoint = "/api/register-connection"
        } else if (item.type === "response") {
          endpoint = "/api/submit-response"
        }

        if (!endpoint) continue

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        })

        if (response.ok) {
          // Supprimer de la liste des réponses en attente
          newPendingResponses.splice(i, 1)
          i--
          hasChanges = true
        }
      } catch (error) {
        // Continuer avec la prochaine réponse
        console.error("Erreur lors de la synchronisation:", error)
      }
    }

    if (hasChanges) {
      setPendingResponses(newPendingResponses)
      localStorage.setItem("pendingResponses", JSON.stringify(newPendingResponses))
    }
  }

  const handleSubmit = async (data: any) => {
    // Mettre à jour la section
    if (data.session) {
      setSection(data.session)
    }

    // Ajouter l'ID de session aux données
    const formData = {
      ...data,
      sessionId,
      timestamp: new Date().toISOString(),
      type: "response",
    }

    try {
      if (isOnline) {
        const response = await fetch("/api/submit-response", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi de la réponse")
        }

        // Déclencher un événement personnalisé pour mettre à jour les statistiques
        if (formSubmittedEvent && typeof window !== "undefined") {
          window.dispatchEvent(formSubmittedEvent)
        }

        // Mettre à jour le localStorage pour les composants qui écoutent les changements de stockage
        const currentResponses = JSON.parse(localStorage.getItem("responses") || "[]")
        localStorage.setItem("responses", JSON.stringify([...currentResponses, formData]))
      } else {
        // Stocker la réponse localement pour synchronisation ultérieure
        const updatedResponses = [...pendingResponses, formData]
        setPendingResponses(updatedResponses)
        localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))

        // Stocker également dans offlineResponses pour les statistiques
        const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
        const offlineData = {
          ...formData,
          id: `offline-${Date.now()}`,
          createdAt: new Date().toISOString(),
          pendingSync: true,
        }
        localStorage.setItem("offlineResponses", JSON.stringify([...offlineResponses, offlineData]))

        // Déclencher l'événement de mise à jour
        if (formSubmittedEvent && typeof window !== "undefined") {
          window.dispatchEvent(formSubmittedEvent)
        }
      }

      // Afficher l'écran de remerciement
      setSubmitted(true)

      // Afficher un toast de confirmation
      toast({
        title: "Merci pour votre participation !",
        description: isOnline
          ? "Votre réponse a été enregistrée avec succès."
          : "Votre réponse sera envoyée dès que vous serez connecté à Internet.",
      })
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)

      // Stocker la réponse localement en cas d'erreur
      const updatedResponses = [...pendingResponses, formData]
      setPendingResponses(updatedResponses)
      localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))

      // Stocker également dans offlineResponses pour les statistiques
      const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
      const offlineData = {
        ...formData,
        id: `error-${Date.now()}`,
        createdAt: new Date().toISOString(),
        pendingSync: true,
      }
      localStorage.setItem("offlineResponses", JSON.stringify([...offlineResponses, offlineData]))

      // Afficher l'écran de remerciement quand même
      setSubmitted(true)

      toast({
        title: "Merci pour votre participation !",
        description: "Votre réponse sera envoyée dès que possible.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        // Enregistrer la déconnexion
        if (navigator.onLine) {
          fetch("/api/active-connections", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "unregister",
              sessionId,
            }),
          }).catch(() => {
            // Ignorer les erreurs de déconnexion
          })
        }

        // Rediriger vers la page d'accueil
        setRedirectToHome(true)
      }, 30000) // 30 secondes

      return () => clearTimeout(timer)
    }
  }, [submitted, sessionId])

  useEffect(() => {
    if (redirectToHome) {
      window.location.href = "/"
    }
  }, [redirectToHome])

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg border border-green-200">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Merci d'avoir participé !</h2>
            <p className="mt-2 text-gray-600">Votre avis est important pour nous aider à améliorer nos services.</p>
            {!isOnline && (
              <p className="mt-4 text-sm px-4 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                Vous êtes actuellement hors ligne. Votre réponse sera envoyée automatiquement dès que vous serez
                connecté à Internet.
              </p>
            )}
            <div className="mt-8 flex flex-col space-y-3">
              <p className="text-sm text-gray-500">Vous serez automatiquement redirigé dans 30 secondes.</p>
              <Button onClick={() => (window.location.href = "/")} className="w-full bg-blue-600 hover:bg-blue-700">
                Retourner à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4 group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Formulaire de satisfaction GPIS</h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              Merci de prendre quelques instants pour nous donner votre avis. Vos commentaires nous aident à améliorer
              continuellement nos formations.
            </p>
            {!isOnline && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md max-w-lg mx-auto">
                <p className="text-sm text-amber-700 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Vous êtes actuellement hors ligne. Votre réponse sera enregistrée localement et envoyée
                  automatiquement dès que vous serez connecté à Internet.
                </p>
              </div>
            )}
          </div>
          <SatisfactionForm onSubmit={handleSubmit} onSectionChange={setSection} />
        </div>
      </div>
    </div>
  )
}
