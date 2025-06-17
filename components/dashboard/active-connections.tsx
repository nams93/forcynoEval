"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCcw, UserX, Users, Activity, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ActiveConnections() {
  const [connections, setConnections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const { toast } = useToast()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchConnections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/active-connections")
      const data = await response.json()

      if (data.success) {
        // Ajouter un indicateur de temps écoulé depuis la connexion
        const connectionsWithTime = data.connections.map((conn: any) => {
          const connTime = new Date(conn.timestamp).getTime()
          const now = new Date().getTime()
          const elapsedSeconds = Math.floor((now - connTime) / 1000)

          return {
            ...conn,
            elapsedTime: elapsedSeconds,
            status: conn.lastActivity && now - new Date(conn.lastActivity).getTime() < 60000 ? "active" : "idle",
          }
        })

        setConnections(connectionsWithTime)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les connexions actives",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des connexions:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les connexions actives",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()

    // Configurer l'intervalle de rafraîchissement automatique
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchConnections, 5000) // Rafraîchir toutes les 5 secondes
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatElapsedTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} sec`
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} min`
    } else {
      return `${Math.floor(seconds / 3600)} h ${Math.floor((seconds % 3600) / 60)} min`
    }
  }

  const disconnectUser = async (sessionId: string) => {
    try {
      const response = await fetch("/api/active-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "unregister",
          sessionId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succès",
          description: "L'utilisateur a été déconnecté",
        })

        // Mettre à jour la liste des connexions
        setConnections(connections.filter((conn) => conn.sessionId !== sessionId))
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de déconnecter l'utilisateur",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const disconnectAllUsers = async () => {
    setIsDisconnecting(true)
    try {
      const response = await fetch("/api/active-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "unregister_all",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succès",
          description: "Tous les utilisateurs ont été déconnectés",
        })

        // Mettre à jour la liste des connexions
        setConnections([])
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de déconnecter tous les utilisateurs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion de tous les utilisateurs:", error)
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter tous les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setIsDisconnecting(false)
    }
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  return (
    <Card className="border-2 border-blue-100 shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Connexions actives
          </CardTitle>
          <CardDescription className="text-blue-100">Utilisateurs actuellement connectés au formulaire</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={autoRefresh ? "secondary" : "outline"}
            size="sm"
            onClick={toggleAutoRefresh}
            className={autoRefresh ? "bg-white/20 text-white hover:bg-white/30" : "bg-white text-blue-600"}
          >
            <Activity className="h-4 w-4 mr-2" />
            {autoRefresh ? "Actualisation auto" : "Actualisation manuelle"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchConnections}
            disabled={isLoading}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={disconnectAllUsers}
            disabled={isLoading || isDisconnecting || connections.length === 0}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <UserX className="h-4 w-4 mr-2" />
            Déconnecter tous
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center p-12 text-gray-500 flex flex-col items-center">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">Aucune connexion active</p>
            <p className="text-sm text-gray-400 mt-1">Les utilisateurs connectés apparaîtront ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold">Section</TableHead>
                  <TableHead className="font-semibold">Connexion</TableHead>
                  <TableHead className="font-semibold">Durée</TableHead>
                  <TableHead className="font-semibold">Appareil</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.sessionId} className="hover:bg-gray-50">
                    <TableCell>
                      <Badge
                        variant={connection.status === "active" ? "default" : "secondary"}
                        className={`flex items-center gap-1 ${
                          connection.status === "active"
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : "bg-gradient-to-r from-gray-400 to-gray-500"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${connection.status === "active" ? "bg-white" : "bg-gray-200"}`}
                        ></span>
                        {connection.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {connection.section || <span className="text-gray-400 italic">Non spécifiée</span>}
                    </TableCell>
                    <TableCell>{formatDate(connection.timestamp)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-3 w-3 mr-1 text-blue-500" />
                        {formatElapsedTime(connection.elapsedTime)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{connection.deviceInfo || connection.userAgent}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => disconnectUser(connection.sessionId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Déconnecter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
