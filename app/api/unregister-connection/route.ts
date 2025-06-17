import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // Rediriger vers la nouvelle API
    const response = await fetch(`${request.url.split("/api/")[0]}/api/active-connections`, {
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
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    return NextResponse.json({ success: false, message: "Erreur lors de la déconnexion" }, { status: 500 })
  }
}
