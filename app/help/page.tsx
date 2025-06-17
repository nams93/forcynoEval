import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"

export default function HelpPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Aide et FAQ</h1>
            <p className="text-gray-600">Réponses aux questions fréquentes</p>
          </div>
        </div>

        {/* Ajouter le bouton de déconnexion si l'utilisateur est connecté */}
        <div className="hidden md:block">
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquemment posées</CardTitle>
              <CardDescription>Trouvez des réponses aux questions les plus courantes</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Comment fonctionne le mode hors ligne ?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-2">
                      Le formulaire utilise les technologies modernes du web pour fonctionner même sans connexion
                      internet :
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Les ressources sont mises en cache lors de votre première visite</li>
                      <li>Lorsque vous êtes hors ligne, vous pouvez quand même remplir et soumettre le formulaire</li>
                      <li>Vos réponses sont stockées localement sur votre appareil</li>
                      <li>
                        Dès que vous retrouvez une connexion internet, vos réponses sont automatiquement synchronisées
                        avec le serveur
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Comment utiliser le QR code ?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-2">
                      Le QR code permet aux participants d'accéder facilement au formulaire :
                    </p>
                    <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                      <li>Accédez au tableau de bord</li>
                      <li>Générez un QR code pointant vers le formulaire</li>
                      <li>Téléchargez-le ou prenez une capture d'écran</li>
                      <li>Partagez-le avec les participants (impression, projection, envoi par email)</li>
                      <li>
                        Les participants scannent le QR code avec leur smartphone pour accéder directement au formulaire
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Comment exporter les données ?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-2">Vous pouvez exporter toutes les réponses au formulaire :</p>
                    <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                      <li>Accédez au tableau de bord</li>
                      <li>Utilisez la section "Exporter les données"</li>
                      <li>Choisissez le format d'exportation (CSV pour Excel ou JSON pour les données brutes)</li>
                      <li>Cliquez sur "Exporter les données"</li>
                      <li>Le fichier sera téléchargé sur votre appareil</li>
                    </ol>
                    <p className="text-gray-700 mt-2">
                      L'exportation inclut toutes les réponses, y compris celles stockées localement.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Les données sont-elles sécurisées ?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-2">Nous prenons la sécurité des données très au sérieux :</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Les données sont stockées localement sur votre appareil et sur nos serveurs sécurisés</li>
                      <li>Les transmissions sont chiffrées via HTTPS</li>
                      <li>Aucune information personnelle identifiable n'est collectée dans le formulaire standard</li>
                      <li>Les données sont uniquement utilisées pour l'analyse des retours sur les formations</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Comment voir les réponses individuelles ?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-2">Pour consulter les réponses individuelles :</p>
                    <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                      <li>Accédez au tableau de bord</li>
                      <li>Cliquez sur le bouton "Voir toutes les réponses"</li>
                      <li>Vous pouvez filtrer les réponses en utilisant la barre de recherche</li>
                      <li>
                        Les réponses sont affichées avec leur date, section, niveau de satisfaction et autres
                        informations clés
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Besoin d'aide supplémentaire ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter.
              </p>
              <Button className="w-full">Contacter le support</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ressources utiles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/form" className="text-blue-600 hover:underline">
                    Accéder au formulaire
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-blue-600 hover:underline">
                    Tableau de bord
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/responses" className="text-blue-600 hover:underline">
                    Voir toutes les réponses
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
