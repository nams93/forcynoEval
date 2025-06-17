"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

// Le code correct pour accéder au dashboard
const CORRECT_PIN = "244993"

export function PinLogin() {
  const [pin, setPin] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fonction pour vérifier le code PIN
  const verifyPin = () => {
    setIsLoading(true)

    // Vérifier si le code est correct
    if (pin === CORRECT_PIN) {
      // Stocker l'accès dans le localStorage
      localStorage.setItem("dashboard_access", "pin_verified")

      toast({
        title: "Accès autorisé",
        description: "Vous êtes maintenant connecté au tableau de bord.",
      })

      // Rediriger vers le dashboard
      window.location.href = "/dashboard"
    } else {
      toast({
        title: "Code incorrect",
        description: "Le code que vous avez saisi n'est pas valide.",
        variant: "destructive",
      })

      // Réinitialiser le code
      setPin("")
    }

    setIsLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyPin()
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord GPIS</h1>
        <p className="text-gray-600">Entrez le code à 6 chiffres pour accéder au tableau de bord</p>
      </div>

      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Entrez le code à 6 chiffres"
              className="text-center text-xl py-6"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setPin("")}
              disabled={pin.length === 0 || isLoading}
              className="px-6 py-2 text-base font-medium"
            >
              Effacer
            </Button>
            <Button
              type="submit"
              disabled={pin.length < 6 || isLoading}
              className="px-6 py-2 text-base font-medium bg-black hover:bg-gray-800 text-white"
            >
              Vérifier
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
