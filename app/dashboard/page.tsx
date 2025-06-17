import { SatisfactionStats } from "@/components/dashboard/satisfaction-stats"
import { QRCodeGenerator } from "@/components/dashboard/qr-code-generator"
import { ExportData } from "@/components/dashboard/export-data"
import { ActiveConnections } from "@/components/dashboard/active-connections"
import { LogoutButton } from "@/components/auth/logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ListFilter, BarChart3, QrCode, Download, Users, ArrowLeft } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-2 group">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Accueil
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Tableau de bord GPIS
            </h1>
            <p className="text-gray-600">Suivi des réponses au formulaire de satisfaction</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/responses">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                <ListFilter className="mr-2 h-4 w-4" />
                Voir toutes les réponses
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Cartes de navigation rapide */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white flex items-center transition-transform hover:scale-105">
            <div className="bg-white/20 p-3 rounded-full mr-3">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Statistiques</h3>
              <p className="text-sm text-blue-100">Analyse des réponses</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md p-4 text-white flex items-center transition-transform hover:scale-105">
            <div className="bg-white/20 p-3 rounded-full mr-3">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">QR Code</h3>
              <p className="text-sm text-indigo-100">Générer un accès</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-4 text-white flex items-center transition-transform hover:scale-105">
            <div className="bg-white/20 p-3 rounded-full mr-3">
              <Download className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Exportation</h3>
              <p className="text-sm text-purple-100">Télécharger les données</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white flex items-center transition-transform hover:scale-105">
            <div className="bg-white/20 p-3 rounded-full mr-3">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Connexions</h3>
              <p className="text-sm text-green-100">Utilisateurs actifs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SatisfactionStats />
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
              <h2 className="text-xl font-semibold mb-4 text-blue-900 flex items-center">
                <QrCode className="h-5 w-5 mr-2 text-blue-600" />
                QR Code du formulaire
              </h2>
              <p className="text-gray-600 mb-4">Scannez ce QR code pour accéder au formulaire de satisfaction</p>
              <QRCodeGenerator />
            </div>

            <ExportData />

            <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Instructions</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <p className="text-gray-700">Partagez le QR code avec les participants</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    2
                  </div>
                  <p className="text-gray-700">Les participants peuvent scanner le code pour accéder au formulaire</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    3
                  </div>
                  <p className="text-gray-700">Les réponses sont collectées en temps réel</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    4
                  </div>
                  <p className="text-gray-700">Les statistiques sont mises à jour automatiquement</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    5
                  </div>
                  <p className="text-gray-700">Le formulaire fonctionne même hors ligne</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ajout de la section des connexions actives */}
        <div className="mt-8">
          <ActiveConnections />
        </div>
      </div>
    </div>
  )
}
