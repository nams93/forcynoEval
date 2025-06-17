import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Rediriger vers la nouvelle API
    const response = await fetch(`${request.url.split("/api/")[0]}/api/active-connections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "register",
        ...data,
      }),
    })

    const responseData = await response.json()
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la connexion:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'enregistrement de la connexion" },
      { status: 500 },
    )
  }
}
