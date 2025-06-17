import { NextResponse } from "next/server"

// Simuler une base de données pour les connexions actives
// Dans une application réelle, cela serait stocké dans une base de données
let activeConnections: any[] = []

export async function GET() {
  try {
    // Nettoyer les connexions inactives depuis plus de 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    activeConnections = activeConnections.filter((conn) => conn.timestamp > thirtyMinutesAgo)

    return NextResponse.json({
      success: true,
      connections: activeConnections,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des connexions actives:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des connexions actives" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Vérifier si la requête est un beacon
    const contentType = request.headers.get("Content-Type") || ""
    let data

    if (contentType.includes("application/json")) {
      data = await request.json()
    } else {
      // Gérer les requêtes sendBeacon qui peuvent être en texte brut
      const text = await request.text()
      try {
        data = JSON.parse(text)
      } catch (e) {
        return NextResponse.json({ success: false, message: "Format de données invalide" }, { status: 400 })
      }
    }

    const { action, sessionId, section, deviceInfo, lastActivity } = data

    if (action === "register") {
      const connectionData = {
        sessionId,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || "Unknown",
        section: section || "Non spécifiée",
        deviceInfo: deviceInfo || null,
        lastActivity: lastActivity || new Date().toISOString(),
      }

      // Vérifier si la connexion existe déjà
      const existingIndex = activeConnections.findIndex((conn) => conn.sessionId === sessionId)
      if (existingIndex >= 0) {
        activeConnections[existingIndex] = {
          ...activeConnections[existingIndex],
          ...connectionData,
        }
      } else {
        activeConnections.push(connectionData)
      }

      return NextResponse.json({
        success: true,
        message: "Connexion enregistrée",
      })
    } else if (action === "update_activity") {
      // Mettre à jour l'activité d'une connexion existante
      const existingIndex = activeConnections.findIndex((conn) => conn.sessionId === sessionId)
      if (existingIndex >= 0) {
        activeConnections[existingIndex].lastActivity = new Date().toISOString()
        if (section) {
          activeConnections[existingIndex].section = section
        }
        return NextResponse.json({
          success: true,
          message: "Activité mise à jour",
        })
      }
      return NextResponse.json(
        {
          success: false,
          message: "Session non trouvée",
        },
        { status: 404 },
      )
    } else if (action === "unregister") {
      // Supprimer la connexion
      activeConnections = activeConnections.filter((conn) => conn.sessionId !== sessionId)

      return NextResponse.json({
        success: true,
        message: "Connexion supprimée",
      })
    } else if (action === "unregister_all") {
      // Supprimer toutes les connexions
      activeConnections = []

      return NextResponse.json({
        success: true,
        message: "Toutes les connexions ont été supprimées",
      })
    }

    return NextResponse.json({ success: false, message: "Action non reconnue" }, { status: 400 })
  } catch (error) {
    console.error("Erreur lors de la gestion des connexions:", error)
    return NextResponse.json({ success: false, message: "Erreur lors de la gestion des connexions" }, { status: 500 })
  }
}
