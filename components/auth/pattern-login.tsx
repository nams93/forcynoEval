"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Le pattern correct pour accéder au dashboard
const CORRECT_PATTERN = "0-4-8-6-2"

export function PatternLogin() {
  const [selectedDots, setSelectedDots] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [nextDotHint, setNextDotHint] = useState<number | null>(null)
  const { toast } = useToast()

  // Fonction pour gérer la sélection d'un point
  const handleDotClick = (index: number) => {
    if (selectedDots.includes(index)) {
      // Si le point est déjà sélectionné, ne rien faire
      return
    }

    // Ajouter le point à la sélection
    setSelectedDots([...selectedDots, index])

    // Réinitialiser l'indice
    setNextDotHint(null)
  }

  // Fonction pour vérifier le pattern
  const verifyPattern = () => {
    setIsLoading(true)

    // Convertir la sélection en chaîne de caractères pour la comparaison
    const patternString = selectedDots.join("-")

    // Vérifier si le pattern est correct
    if (patternString === CORRECT_PATTERN) {
      // Stocker l'accès dans le localStorage
      localStorage.setItem("dashboard_access", "pattern_verified")

      toast({
        title: "Accès autorisé",
        description: "Vous êtes maintenant connecté au tableau de bord.",
      })

      // Rediriger vers le dashboard
      window.location.href = "/dashboard"
    } else {
      toast({
        title: "Pattern incorrect",
        description: "Le schéma que vous avez dessiné n'est pas valide.",
        variant: "destructive",
      })

      // Réinitialiser la sélection
      setSelectedDots([])
    }

    setIsLoading(false)
  }

  // Fonction pour réinitialiser le pattern
  const resetPattern = () => {
    setSelectedDots([])
    setNextDotHint(null)
  }

  // Fonction pour afficher un indice (pour la démo)
  const showHint = () => {
    if (selectedDots.length < 5) {
      const correctPattern = CORRECT_PATTERN.split("-").map(Number)
      setNextDotHint(correctPattern[selectedDots.length])
    }
  }

  // Double-cliquer sur le titre pour afficher un indice (fonctionnalité cachée)
  useEffect(() => {
    const title = document.getElementById("pattern-title")
    if (title) {
      title.addEventListener("dblclick", showHint)
      return () => {
        title.removeEventListener("dblclick", showHint)
      }
    }
  }, [selectedDots])

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="text-center mb-6">
        <h1 id="pattern-title" className="text-3xl font-bold mb-2">
          Tableau de bord GPIS
        </h1>
        <p className="text-gray-600">Dessinez le schéma pour accéder au tableau de bord</p>
      </div>

      <CardContent className="p-0">
        <div className="grid grid-cols-3 gap-6 mx-auto w-full max-w-xs mb-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <button
              key={index}
              className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedDots.includes(index)
                  ? "bg-blue-500 border-blue-500 text-white"
                  : nextDotHint === index
                    ? "bg-white border-red-500 text-red-500"
                    : "bg-white border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleDotClick(index)}
              disabled={isLoading}
            >
              {selectedDots.includes(index) && (
                <span className="text-xl font-medium">{selectedDots.indexOf(index) + 1}</span>
              )}
              {nextDotHint === index && (
                <div className="relative">
                  <span className="text-2xl font-medium text-red-500">5</span>
                  <div className="absolute -right-8 -top-6">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 30L30 10" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round" />
                      <path d="M30 10L20 5" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="text-center text-gray-600 mb-6">
          {selectedDots.length > 0 ? (
            <p>{`${selectedDots.length} point${selectedDots.length > 1 ? "s" : ""} sélectionné${selectedDots.length > 1 ? "s" : ""}`}</p>
          ) : (
            <p>Sélectionnez les points dans l'ordre correct</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={resetPattern}
            disabled={selectedDots.length === 0 || isLoading}
            className="px-6 py-2 text-base font-medium"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={verifyPattern}
            disabled={selectedDots.length === 0 || isLoading}
            className="px-6 py-2 text-base font-medium bg-black hover:bg-gray-800 text-white"
          >
            Vérifier
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
