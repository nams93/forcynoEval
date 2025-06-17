import { NextResponse } from "next/server"

// Simuler une base de données avec un tableau côté serveur
const formResponses: any[] = []

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Ajouter un ID unique et un timestamp
    const responseData = {
      ...data,
      id: `response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      receivedAt: new Date().toISOString(),
    }

    // Ajouter la nouvelle réponse
    formResponses.push(responseData)

    return NextResponse.json({
      success: true,
      message: "Réponse enregistrée avec succès",
      data: responseData,
    })
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la réponse:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'enregistrement de la réponse" },
      { status: 500 },
    )
  }
}

// Endpoint pour récupérer toutes les réponses
export async function GET() {
  return NextResponse.json({
    success: true,
    responses: formResponses,
  })
}
