import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, FileText, BarChart3, QrCode, WifiOff, RefreshCw, Download } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-blue-900 text-white p-3 rounded-full mb-6">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Formulaire de satisfaction GPIS</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Plateforme intuitive de collecte et d'analyse des retours sur les formations GPIS
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="border-2 border-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-xl">Remplir le formulaire</CardTitle>
              </div>
              <CardDescription>Donnez votre avis sur la formation que vous avez suivie</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-2 pb-6">
              <Link href="/form" passHref>
                <Button size="lg" className="px-8 py-6 text-base font-medium">
                  Accéder au formulaire
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Tableau de bord</CardTitle>
              </div>
              <CardDescription>Consultez les statistiques et générez des QR codes</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-2 pb-6">
              <Link href="/dashboard" passHref>
                <Button size="lg" variant="outline" className="px-8 py-6 text-base font-medium">
                  Accéder au dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">Fonctionnalités principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start p-4 rounded-lg transition-colors hover:bg-blue-50">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Multi-plateforme</h3>
                  <p className="text-gray-600">Accessible sur tous les appareils (mobile, tablette, ordinateur)</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-lg transition-colors hover:bg-blue-50">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-4">
                  <WifiOff className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mode hors ligne</h3>
                  <p className="text-gray-600">Fonctionne même sans connexion internet</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-lg transition-colors hover:bg-blue-50">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-4">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Synchronisation automatique</h3>
                  <p className="text-gray-600">Les données sont synchronisées lorsque la connexion est rétablie</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-lg transition-colors hover:bg-blue-50">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Statistiques en temps réel</h3>
                  <p className="text-gray-600">Tableau de bord avec analyses et visualisations dynamiques</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-lg transition-colors hover:bg-blue-50">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-4">
                  <QrCode className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Génération de QR codes</h3>
                  <p className="text-gray-600">Accès facile au formulaire via QR code personnalisable</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-lg transition-colors hover:bg-blue-50">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-4">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Exportation des données</h3>
                  <p className="text-gray-600">Exportation des données en CSV ou JSON pour analyse externe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Button */}
        <div className="flex justify-center">
          <Link href="/help">
            <Button variant="outline" size="lg" className="group">
              <HelpCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Centre d'aide
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2024 GPIS - Formulaire de satisfaction</p>
          <p className="text-sm text-gray-500 mt-2">Conçu pour améliorer la qualité des formations</p>
        </div>
      </footer>
    </div>
  )
}
