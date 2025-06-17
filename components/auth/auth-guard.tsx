"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { PinLogin } from "@/components/auth/pin-login"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier si l'accès au dashboard est autorisé
      const accessCode = localStorage.getItem("dashboard_access")

      if (accessCode === "pin_verified" || accessCode === "direct_access") {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [toast])

  // Afficher un indicateur de chargement pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  // Si non authentifié, afficher le formulaire de connexion par code PIN
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <PinLogin />
      </div>
    )
  }

  // Si authentifié, afficher le contenu protégé
  return <>{children}</>
}
