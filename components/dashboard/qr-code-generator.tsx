"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, Smartphone, Copy, Check } from "lucide-react"
import { toCanvas } from "qrcode"
import { useToast } from "@/components/ui/use-toast"

export function QRCodeGenerator() {
  const [url, setUrl] = useState("")
  const [customUrl, setCustomUrl] = useState("")
  const [qrSize, setQrSize] = useState(200)
  const [activeTab, setActiveTab] = useState("default")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const qrCodeRef = useRef<HTMLCanvasElement>(null)

  // Générer l'URL par défaut basée sur l'emplacement actuel
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin
      setUrl(`${baseUrl}/form`)
    }
  }, [])

  // Mettre à jour l'URL lorsque l'onglet change
  useEffect(() => {
    if (activeTab === "default" && typeof window !== "undefined") {
      const baseUrl = window.location.origin
      setUrl(`${baseUrl}/form`)
    } else if (activeTab === "custom") {
      setUrl(customUrl)
    }
  }, [activeTab, customUrl])

  useEffect(() => {
    const generateQR = async () => {
      if (qrCodeRef.current && url) {
        try {
          await toCanvas(qrCodeRef.current, url, {
            width: qrSize,
            margin: 4,
            errorCorrectionLevel: "H",
          })
        } catch (err) {
          console.error("Erreur lors de la génération du QR code:", err)
        }
      }
    }

    generateQR()
  }, [url, qrSize])

  // Télécharger le QR code
  const downloadQRCode = () => {
    const canvas = qrCodeRef.current
    if (canvas) {
      try {
        const pngUrl = canvas.toDataURL("image/png")

        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = "formulaire-satisfaction-qrcode.png"

        document.body.appendChild(downloadLink)
        downloadLink.click()

        // Utiliser setTimeout pour éviter les problèmes de suppression immédiate
        setTimeout(() => {
          if (document.body.contains(downloadLink)) {
            document.body.removeChild(downloadLink)
          }
        }, 100)

        toast({
          title: "Téléchargement réussi",
          description: "Le QR code a été téléchargé avec succès",
        })
      } catch (error) {
        console.error("Erreur lors du téléchargement du QR code:", error)
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le QR code",
          variant: "destructive",
        })
      }
    }
  }

  // Copier l'URL dans le presse-papier
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)

      toast({
        title: "URL copiée",
        description: "L'URL du formulaire a été copiée dans le presse-papier",
      })

      // Réinitialiser l'état après 2 secondes
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de la copie:", error)
      toast({
        title: "Erreur",
        description: "Impossible de copier l'URL",
        variant: "destructive",
      })
    }
  }

  // Partager le QR code ou l'URL
  const shareQRCode = async () => {
    try {
      // Vérifier si l'API Web Share est disponible et si nous sommes dans un contexte sécurisé
      if (navigator.share && window.isSecureContext) {
        try {
          // Utiliser l'API Web Share
          await navigator.share({
            title: "Formulaire de satisfaction GPIS",
            text: "Scannez ce QR code ou cliquez sur le lien pour accéder au formulaire de satisfaction",
            url: url,
          })

          toast({
            title: "Partage réussi",
            description: "Le lien a été partagé avec succès",
          })
        } catch (shareError) {
          console.error("Erreur lors du partage via Web Share API:", shareError)

          // Si l'erreur est liée aux permissions, utiliser le fallback
          if (shareError instanceof Error && shareError.message.includes("Permission denied")) {
            await copyToClipboard()
          } else {
            throw shareError
          }
        }
      } else {
        // Fallback: copier l'URL dans le presse-papier
        await copyToClipboard()
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)
      toast({
        title: "Erreur de partage",
        description: "Impossible de partager le QR code. Essayez de copier l'URL manuellement.",
        variant: "destructive",
      })
    }
  }

  // Tester le QR code
  const testQRCode = () => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">URL par défaut</TabsTrigger>
          <TabsTrigger value="custom">URL personnalisée</TabsTrigger>
        </TabsList>

        <TabsContent value="default">
          <p className="text-sm text-gray-500 mb-2">Utilise l'URL par défaut du formulaire</p>
        </TabsContent>

        <TabsContent value="custom">
          <div className="space-y-2">
            <Label htmlFor="custom-url">URL personnalisée</Label>
            <Input
              id="custom-url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://votre-url.com/form"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col items-center space-y-4">
        <Card className="p-4 w-full flex justify-center bg-white">
          <canvas id="qr-code" ref={qrCodeRef} width={qrSize} height={qrSize} className="border rounded-md" />
        </Card>

        <div className="w-full space-y-2">
          <Label htmlFor="qr-size">Taille du QR code</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="qr-size"
              type="range"
              min="100"
              max="300"
              step="10"
              value={qrSize}
              onChange={(e) => setQrSize(Number.parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500 w-12">{qrSize}px</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full">
          <Button onClick={downloadQRCode} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button onClick={copyToClipboard} variant="outline" className="w-full">
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copier URL
              </>
            )}
          </Button>
          <Button onClick={testQRCode} variant="secondary" className="w-full">
            <Smartphone className="h-4 w-4 mr-2" />
            Tester
          </Button>
        </div>

        <div className="w-full p-3 bg-gray-50 border rounded-md">
          <p className="text-xs text-gray-500 text-center mb-1">URL du formulaire:</p>
          <p className="text-sm font-medium text-center break-all">{url || "Aucune URL spécifiée"}</p>
          <div className="mt-2 flex justify-center">
            <Button variant="ghost" size="sm" onClick={shareQRCode} className="text-xs flex items-center">
              <Share2 className="h-3 w-3 mr-1" />
              Partager via les options de votre appareil
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
