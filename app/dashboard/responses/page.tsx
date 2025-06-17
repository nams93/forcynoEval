"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLocalStorage } from "@/lib/local-storage"
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"
import Link from "next/link"

export default function ResponsesPage() {
  const [responses, setResponses] = useState<any[]>([])
  const [filteredResponses, setFilteredResponses] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [sections, setSections] = useState<string[]>([])
  const [selectedSection, setSelectedSection] = useState<string>("Toutes")
  const responsesPerPage = 10

  useEffect(() => {
    // Charger les données
    const loadData = () => {
      setIsLoading(true)

      // Récupérer toutes les données
      const storedResponses = getLocalStorage("responses") || []
      let offlineResponses = []
      try {
        const storedOfflineResponses = localStorage.getItem("offlineResponses")
        if (storedOfflineResponses) {
          offlineResponses = JSON.parse(storedOfflineResponses)
        }
      } catch (e) {
        console.error("Erreur lors de la récupération des réponses hors ligne", e)
      }

      // Combiner et trier par date (plus récent en premier)
      const allResponses = [...storedResponses, ...offlineResponses].sort((a, b) => {
        const dateA = new Date(a.timestamp || a.createdAt).getTime()
        const dateB = new Date(b.timestamp || b.createdAt).getTime()
        return dateB - dateA
      })

      // Extraire toutes les sections uniques
      const uniqueSections = ["Toutes", ...new Set(allResponses.map((r: any) => r.session).filter(Boolean))]
      setSections(uniqueSections)

      setResponses(allResponses)
      setFilteredResponses(allResponses)
      setIsLoading(false)
    }

    loadData()

    // Configurer un intervalle pour rafraîchir les données
    const interval = setInterval(loadData, 30000)

    return () => clearInterval(interval)
  }, [])

  // Filtrer les réponses lorsque le terme de recherche ou la section change
  useEffect(() => {
    let filtered = [...responses]

    // Filtrer par section si nécessaire
    if (selectedSection !== "Toutes") {
      filtered = filtered.filter((response) => response.session === selectedSection)
    }

    // Filtrer par terme de recherche si nécessaire
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((response) => {
        // Rechercher dans toutes les propriétés de texte
        return Object.entries(response).some(([key, value]) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(term)
          }
          return false
        })
      })
    }

    setFilteredResponses(filtered)
    setCurrentPage(1) // Revenir à la première page après un filtrage
  }, [searchTerm, selectedSection, responses])

  // Pagination
  const totalPages = Math.ceil(filteredResponses.length / responsesPerPage)
  const indexOfLastResponse = currentPage * responsesPerPage
  const indexOfFirstResponse = indexOfLastResponse - responsesPerPage
  const currentResponses = filteredResponses.slice(indexOfFirstResponse, indexOfLastResponse)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Réponses individuelles</h1>
          <p className="text-gray-600">Consultez toutes les réponses au formulaire de satisfaction</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">Retour au tableau de bord</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtrer les réponses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher dans les réponses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrer par section" />
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="text-center p-8 text-gray-500">Aucune réponse trouvée</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Difficulté</TableHead>
                      <TableHead>Pédagogie</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentResponses.map((response, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(response.timestamp || response.createdAt)}</TableCell>
                        <TableCell>{response.session || "Non spécifié"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              response.satisfactionFormation === "Oui"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {response.satisfactionFormation || "Non spécifié"}
                          </span>
                        </TableCell>
                        <TableCell>{response.difficulte || "Non spécifié"}</TableCell>
                        <TableCell>{response.pedagogie || "Non spécifié"}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {response.commentaireLibre
                            ? response.commentaireLibre.length > 50
                              ? response.commentaireLibre.substring(0, 50) + "..."
                              : response.commentaireLibre
                            : "Aucun commentaire"}
                        </TableCell>
                        <TableCell>
                          {response.pendingSync ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                              En attente de synchronisation
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Synchronisé
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-500">
                  Affichage de {indexOfFirstResponse + 1} à {Math.min(indexOfLastResponse, filteredResponses.length)}{" "}
                  sur {filteredResponses.length} réponses
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
