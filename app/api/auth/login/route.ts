import { NextResponse } from "next/server"

// Mot de passe pour accéder au tableau de bord
const DASHBOARD_PASSWORD = "2/He$@gJr3iwU"

export async function POST(request: Request) {
  try {
    // Extraire le mot de passe de la requête
    const body = await request.json()
    const { password } = body

    // Vérifier si le mot de passe est correct
    if (password === DASHBOARD_PASSWORD) {
      // Créer un simple code d'accès (timestamp actuel)
      const accessCode = Date.now().toString()

      return NextResponse.json({
        success: true,
        message: "Connexion réussie",
        accessCode,
      })
    } else {
      // Mot de passe incorrect
      return NextResponse.json(
        {
          success: false,
          message: "Mot de passe incorrect",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la connexion",
      },
      { status: 500 },
    )
  }
}
