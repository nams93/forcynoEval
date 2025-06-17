"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function SatisfactionStats() {
  const [stats, setStats] = useState({
    totalResponses: 0,
    satisfactionData: [] as any[],
    difficulteData: [] as any[],
    pedagogieData: [] as any[],
    commentairesRecents: [] as any[],
  })
  const [selectedSection, setSelectedSection] = useState<string>("Toutes")
  const [sections, setSections] = useState<string[]>([])
  const [comparaisonMode, setComparaisonMode] = useState<boolean>(false)
  const [comparaisonData, setComparaisonData] = useState<any>({})

  // Fonction pour charger les données
  const loadData = () => {
    // Récupérer les données des réponses
    const responses = localStorage.getItem("dashboard_responses")
      ? JSON.parse(localStorage.getItem("dashboard_responses") || "[]")
      : []

    // Vérifier s'il y a des réponses hors ligne à intégrer
    let offlineResponses = []
    try {
      const storedResponses = localStorage.getItem("offlineResponses")
      if (storedResponses) {
        offlineResponses = JSON.parse(storedResponses)
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des réponses hors ligne", e)
    }

    // Combiner les réponses
    const allResponses = [...responses, ...offlineResponses]

    // Extraire toutes les sections uniques
    const uniqueSections = ["Toutes", ...new Set(allResponses.map((r: any) => r.session).filter(Boolean))]
    setSections(uniqueSections)

    // Filtrer les réponses par section si nécessaire
    const filteredResponses =
      selectedSection === "Toutes" ? allResponses : allResponses.filter((r: any) => r.session === selectedSection)

    // Calculer les statistiques
    const totalResponses = filteredResponses.length

    // Données de satisfaction
    const satisfactionCounts = filteredResponses.reduce((acc: any, response: any) => {
      const value = response.satisfactionFormation || "Non spécifié"
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    const satisfactionData = Object.keys(satisfactionCounts).map((key) => ({
      name: key,
      value: satisfactionCounts[key],
    }))

    // Données de difficulté
    const difficulteCounts = filteredResponses.reduce((acc: any, response: any) => {
      const value = response.difficulte || "Non spécifié"
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    const difficulteData = Object.keys(difficulteCounts).map((key) => ({
      name: key,
      value: difficulteCounts[key],
    }))

    // Données de pédagogie
    const pedagogieCounts = filteredResponses.reduce((acc: any, response: any) => {
      const value = response.pedagogie || "Non spécifié"
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    const pedagogieData = Object.keys(pedagogieCounts).map((key) => ({
      name: key,
      value: pedagogieCounts[key],
    }))

    // Commentaires récents
    const commentairesRecents = filteredResponses
      .filter((response: any) => response.commentaireLibre && response.commentaireLibre.trim() !== "")
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime(),
      )
      .slice(0, 5)
      .map((response: any) => ({
        commentaire: response.commentaireLibre,
        date: new Date(response.createdAt || response.timestamp).toLocaleDateString("fr-FR"),
        satisfaction: response.satisfactionFormation,
        section: response.session || "Non spécifié",
      }))

    setStats({
      totalResponses,
      satisfactionData,
      difficulteData,
      pedagogieData,
      commentairesRecents,
    })

    // Préparer les données de comparaison si le mode comparaison est activé
    if (comparaisonMode) {
      // Exclure "Toutes" de la liste des sections pour la comparaison
      const sectionsToCompare = uniqueSections.filter((s) => s !== "Toutes")

      // Préparer les données de comparaison pour chaque métrique
      const compData = {
        satisfaction: sectionsToCompare.map((section) => {
          const sectionResponses = allResponses.filter((r: any) => r.session === section)
          const satisfiedCount = sectionResponses.filter((r: any) => r.satisfactionFormation === "Oui").length
          const percentage = sectionResponses.length ? (satisfiedCount / sectionResponses.length) * 100 : 0

          return {
            name: section,
            value: Math.round(percentage),
            count: sectionResponses.length,
          }
        }),

        difficulte: sectionsToCompare.map((section) => {
          const sectionResponses = allResponses.filter((r: any) => r.session === section)
          const counts: any = {}

          sectionResponses.forEach((r: any) => {
            const value = r.difficulte || "Non spécifié"
            counts[value] = (counts[value] || 0) + 1
          })

          return {
            name: section,
            ...Object.keys(counts).reduce((acc: any, key) => {
              acc[key] = counts[key]
              return acc
            }, {}),
            count: sectionResponses.length,
          }
        }),

        pedagogie: sectionsToCompare.map((section) => {
          const sectionResponses = allResponses.filter((r: any) => r.session === section)
          const counts: any = {}

          sectionResponses.forEach((r: any) => {
            const value = r.pedagogie || "Non spécifié"
            counts[value] = (counts[value] || 0) + 1
          })

          return {
            name: section,
            ...Object.keys(counts).reduce((acc: any, key) => {
              acc[key] = counts[key]
              return acc
            }, {}),
            count: sectionResponses.length,
          }
        }),
      }

      setComparaisonData(compData)
    }
  }

  // Charger les données au chargement du composant
  useEffect(() => {
    loadData()

    // Configurer un intervalle pour rafraîchir les données toutes les 10 secondes
    const interval = setInterval(loadData, 10000)

    // Écouter les événements de stockage pour détecter les changements
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "responses" || event.key === "offlineResponses") {
        loadData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Écouter les événements personnalisés pour les mises à jour
    const handleCustomEvent = () => {
      loadData()
    }

    window.addEventListener("formSubmitted", handleCustomEvent)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("formSubmitted", handleCustomEvent)
    }
  }, [selectedSection, comparaisonMode])

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#ff7300"]

  // Formater le pourcentage pour le graphique en camembert
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    )
  }

  return (
    <div className="space-y-6 satisfaction-stats-container">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="section-filter" className="text-sm font-medium">
            Filtrer par section:
          </label>
          <Select value={selectedSection} onValueChange={setSelectedSection} disabled={comparaisonMode}>
            <SelectTrigger id="section-filter" className="w-[180px]">
              <SelectValue placeholder="Sélectionner une section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="comparaison-toggle" className="text-sm font-medium cursor-pointer">
            Mode comparaison des sections:
          </label>
          <input
            type="checkbox"
            id="comparaison-toggle"
            checked={comparaisonMode}
            onChange={() => setComparaisonMode(!comparaisonMode)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      {!comparaisonMode ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total des réponses</CardTitle>
                {selectedSection !== "Toutes" && <CardDescription>Section: {selectedSection}</CardDescription>}
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stats.totalResponses}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {stats.satisfactionData.find((item) => item.name === "Oui")?.value || 0}
                  <span className="text-lg text-gray-500 ml-2">
                    (
                    {stats.totalResponses
                      ? Math.round(
                          ((stats.satisfactionData.find((item) => item.name === "Oui")?.value || 0) /
                            stats.totalResponses) *
                            100,
                        )
                      : 0}
                    %)
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Difficulté moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {stats.difficulteData.find((item) => item.name === "Facile")?.value || 0}
                  <span className="text-lg text-gray-500 ml-2">
                    (
                    {stats.totalResponses
                      ? Math.round(
                          ((stats.difficulteData.find((item) => item.name === "Facile")?.value || 0) /
                            stats.totalResponses) *
                            100,
                        )
                      : 0}
                    %)
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Pédagogie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {stats.pedagogieData.find((item) => item.name === "Très bien")?.value || 0}
                  <span className="text-lg text-gray-500 ml-2">
                    (
                    {stats.totalResponses
                      ? Math.round(
                          ((stats.pedagogieData.find((item) => item.name === "Très bien")?.value || 0) /
                            stats.totalResponses) *
                            100,
                        )
                      : 0}
                    %)
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="satisfaction" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
              <TabsTrigger value="difficulte">Difficulté</TabsTrigger>
              <TabsTrigger value="pedagogie">Pédagogie</TabsTrigger>
              <TabsTrigger value="commentaires">Commentaires</TabsTrigger>
            </TabsList>

            <TabsContent value="satisfaction">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition de la satisfaction</CardTitle>
                  <CardDescription>
                    Pourcentage des participants satisfaits de la formation
                    {selectedSection !== "Toutes" && ` - Section: ${selectedSection}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.satisfactionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.satisfactionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="difficulte">
              <Card>
                <CardHeader>
                  <CardTitle>Niveau de difficulté perçu</CardTitle>
                  <CardDescription>
                    Répartition des avis sur la difficulté de la formation
                    {selectedSection !== "Toutes" && ` - Section: ${selectedSection}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.difficulteData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Nombre de réponses" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pedagogie">
              <Card>
                <CardHeader>
                  <CardTitle>Qualité de la pédagogie</CardTitle>
                  <CardDescription>
                    Évaluation de la qualité pédagogique de la formation
                    {selectedSection !== "Toutes" && ` - Section: ${selectedSection}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.pedagogieData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Nombre de réponses" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commentaires">
              <Card>
                <CardHeader>
                  <CardTitle>Commentaires récents</CardTitle>
                  <CardDescription>
                    Les 5 derniers commentaires laissés par les participants
                    {selectedSection !== "Toutes" && ` - Section: ${selectedSection}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.commentairesRecents.length > 0 ? (
                    <div className="space-y-4">
                      {stats.commentairesRecents.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-sm text-gray-500">{item.date}</span>
                              {selectedSection === "Toutes" && (
                                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {item.section}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                item.satisfaction === "Oui" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.satisfaction === "Oui" ? "Satisfait" : "Non satisfait"}
                            </span>
                          </div>
                          <p className="text-gray-700">{item.commentaire}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">Aucun commentaire disponible pour le moment</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        // Mode comparaison
        <Tabs defaultValue="satisfaction" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            <TabsTrigger value="difficulte">Difficulté</TabsTrigger>
            <TabsTrigger value="pedagogie">Pédagogie</TabsTrigger>
          </TabsList>

          <TabsContent value="satisfaction">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison de la satisfaction par section</CardTitle>
                <CardDescription>Pourcentage des participants satisfaits de la formation par section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparaisonData.satisfaction}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "Satisfaction (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${value}%`, "Satisfaction"]} />
                      <Legend />
                      <Bar dataKey="value" name="Taux de satisfaction" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 text-center">
                    Le graphique montre le pourcentage de participants satisfaits pour chaque section. Nombre total de
                    réponses par section indiqué dans les info-bulles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="difficulte">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison de la difficulté perçue par section</CardTitle>
                <CardDescription>Répartition des avis sur la difficulté de la formation par section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparaisonData.difficulte}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Facile" stackId="a" fill="#0088FE" />
                      <Bar dataKey="Adapté" stackId="a" fill="#00C49F" />
                      <Bar dataKey="Difficile" stackId="a" fill="#FFBB28" />
                      <Bar dataKey="Trop difficile" stackId="a" fill="#FF8042" />
                      <Bar dataKey="Trop facile" stackId="a" fill="#8884d8" />
                      <Bar dataKey="Non spécifié" stackId="a" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 text-center">
                    Le graphique montre la répartition des niveaux de difficulté perçus pour chaque section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pedagogie">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison de la qualité pédagogique par section</CardTitle>
                <CardDescription>Évaluation de la qualité pédagogique de la formation par section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparaisonData.pedagogie}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Très bien" stackId="a" fill="#0088FE" />
                      <Bar dataKey="Bien" stackId="a" fill="#00C49F" />
                      <Bar dataKey="Moyenne" stackId="a" fill="#FFBB28" />
                      <Bar dataKey="À améliorer" stackId="a" fill="#FF8042" />
                      <Bar dataKey="Non spécifié" stackId="a" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 text-center">
                    Le graphique montre la répartition des évaluations de la qualité pédagogique pour chaque section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
