import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Extraire le code d'accès de la requête
    const body = await request.json()
    const { accessCode } = body

    if (!accessCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Code d'accès non fourni",
        },
        { status: 401 },
      )
    }

    // Vérifier simplement que le code d'accès existe
    // Dans une vraie application, vous voudriez vérifier sa validité
    return NextResponse.json({
      success: true,
      message: "Accès autorisé",
    })
  } catch (error) {
    console.error("Erreur lors de la vérification:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la vérification",
      },
      { status: 500 },
    )
  }
}
