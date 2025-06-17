"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface SatisfactionFormProps {
  onSubmit: (data: any) => void
  onSectionChange?: (section: string) => void
}

// Fonction utilitaire pour stocker les données hors ligne de manière sécurisée
const saveOfflineData = (key: string, data: any): boolean => {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
    return true
  } catch (e) {
    console.error("Erreur lors de la sauvegarde des données hors ligne:", e)
    return false
  }
}

// Fonction utilitaire pour récupérer les données hors ligne de manière sécurisée
const getOfflineData = (key: string, defaultValue: any): any => {
  try {
    const serializedData = localStorage.getItem(key)
    return serializedData ? JSON.parse(serializedData) : defaultValue
  } catch (e) {
    console.error("Erreur lors de la récupération des données hors ligne:", e)
    return defaultValue
  }
}

export function SatisfactionForm({ onSubmit, onSectionChange }: SatisfactionFormProps) {
  // Lieux de la formation
  const [lieuGlobal, setLieuGlobal] = useState<string>("")
  const [lieuAdapte, setLieuAdapte] = useState<string>("")
  const [lieuRealite, setLieuRealite] = useState<string>("")
  const [commentaireLieu, setCommentaireLieu] = useState<string>("")

  // La formation et son contenue
  const [scenarios, setScenarios] = useState<string>("")
  const [misesEnSituation, setMisesEnSituation] = useState<string>("")
  const [difficulte, setDifficulte] = useState<string>("")
  const [evolutionDifficulte, setEvolutionDifficulte] = useState<string>("")
  const [rythme, setRythme] = useState<string>("")
  const [duree, setDuree] = useState<string>("")
  const [objectifsClairs, setObjectifsClairs] = useState<string>("")
  const [ameliorationAnalyse, setAmeliorationAnalyse] = useState<string>("")
  const [articulationExercices, setArticulationExercices] = useState<string>("")
  const [miseEnSituationSouhaite, setMiseEnSituationSouhaite] = useState<string>("")
  const [miseEnSituationMoinsInteresse, setMiseEnSituationMoinsInteresse] = useState<string>("")
  const [horaires, setHoraires] = useState<string>("")
  const [attentes, setAttentes] = useState<string>("")
  const [reponseProblematiques, setReponseProblematiques] = useState<string>("")
  const [applicationMethodes, setApplicationMethodes] = useState<string>("")

  // Les formateurs
  const [complementariteFormateurs, setComplementariteFormateurs] = useState<string>("")
  const [pedagogie, setPedagogie] = useState<string>("")
  const [qualiteReponses, setQualiteReponses] = useState<string>("")
  const [disponibiliteFormateurs, setDisponibiliteFormateurs] = useState<string>("")
  const [pertinenceDebriefings, setPertinenceDebriefings] = useState<string>("")
  const [satisfactionJournee, setSatisfactionJournee] = useState<string>("")
  const [interetNouvelleFormation, setInteretNouvelleFormation] = useState<string>("")
  const [commentaireLibre, setCommentaireLibre] = useState<string>("")

  const [session, setSession] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  // Notifier le parent lorsque la section change
  useEffect(() => {
    if (onSectionChange && session) {
      onSectionChange(session)
    }
  }, [session, onSectionChange])

  // Surveiller l'état de la connexion
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Définir l'état initial
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!session) newErrors.session = "Veuillez indiquer votre section."

    // Lieux de la formation
    if (!lieuGlobal) newErrors.lieuGlobal = "Ce champ est obligatoire."
    if (!lieuAdapte) newErrors.lieuAdapte = "Ce champ est obligatoire."
    if (!lieuRealite) newErrors.lieuRealite = "Ce champ est obligatoire."
    // Commentaire libre est optionnel, mais si on veut le rendre obligatoire:
    // if (!commentaireLieu.trim()) newErrors.commentaireLieu = "Ce champ est obligatoire."

    // La formation et son contenu
    if (!scenarios) newErrors.scenarios = "Ce champ est obligatoire."
    if (!misesEnSituation) newErrors.misesEnSituation = "Ce champ est obligatoire."
    if (!difficulte) newErrors.difficulte = "Ce champ est obligatoire."
    if (!evolutionDifficulte) newErrors.evolutionDifficulte = "Ce champ est obligatoire."
    if (!rythme) newErrors.rythme = "Ce champ est obligatoire."
    if (!duree) newErrors.duree = "Ce champ est obligatoire."
    if (!objectifsClairs) newErrors.objectifsClairs = "Ce champ est obligatoire."
    if (!ameliorationAnalyse) newErrors.ameliorationAnalyse = "Ce champ est obligatoire."
    if (!articulationExercices) newErrors.articulationExercices = "Ce champ est obligatoire."
    // if (!miseEnSituationSouhaite.trim()) newErrors.miseEnSituationSouhaite = "Ce champ est obligatoire."
    // if (!miseEnSituationMoinsInteresse.trim()) newErrors.miseEnSituationMoinsInteresse = "Ce champ est obligatoire."
    if (!horaires) newErrors.horaires = "Ce champ est obligatoire."
    if (!attentes) newErrors.attentes = "Ce champ est obligatoire."
    if (!reponseProblematiques) newErrors.reponseProblematiques = "Ce champ est obligatoire."
    if (!applicationMethodes) newErrors.applicationMethodes = "Ce champ est obligatoire."

    // Les formateurs
    if (!complementariteFormateurs) newErrors.complementariteFormateurs = "Ce champ est obligatoire."
    if (!pedagogie) newErrors.pedagogie = "Ce champ est obligatoire."
    if (!qualiteReponses) newErrors.qualiteReponses = "Ce champ est obligatoire."
    if (!disponibiliteFormateurs) newErrors.disponibiliteFormateurs = "Ce champ est obligatoire."
    if (!pertinenceDebriefings) newErrors.pertinenceDebriefings = "Ce champ est obligatoire."
    if (!satisfactionJournee) newErrors.satisfactionJournee = "Ce champ est obligatoire."
    if (!interetNouvelleFormation) newErrors.interetNouvelleFormation = "Ce champ est obligatoire."
    // if (!commentaireLibre.trim()) newErrors.commentaireLibre = "Ce champ est obligatoire."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez répondre à toutes les questions obligatoires.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = {
        // Lieux de la formation
        lieuGlobal,
        lieuAdapte,
        lieuRealite,
        commentaireLieu,

        // La formation et son contenue
        scenarios,
        misesEnSituation,
        difficulte,
        evolutionDifficulte,
        rythme,
        duree,
        objectifsClairs,
        ameliorationAnalyse,
        articulationExercices,
        miseEnSituationSouhaite,
        miseEnSituationMoinsInteresse,
        horaires,
        attentes,
        reponseProblematiques,
        applicationMethodes,

        // Les formateurs
        complementariteFormateurs,
        pedagogie,
        qualiteReponses,
        disponibiliteFormateurs,
        pertinenceDebriefings,
        satisfactionJournee,
        interetNouvelleFormation,
        commentaireLibre,

        session,
        timestamp: new Date().toISOString(),
        satisfactionFormation: attentes === "Très satisfait" || attentes === "Plutôt satisfait" ? "Oui" : "Non",
      }

      // Si hors ligne, stocker dans IndexedDB
      if (!isOnline) {
        // Stocker dans IndexedDB
        const offlineData = {
          ...formData,
          id: `offline-${Date.now()}`,
          createdAt: new Date().toISOString(),
          pendingSync: true,
        }

        // Utiliser notre nouvelle fonction de stockage sécurisé
        const saved = saveOfflineData("offlineResponses", [...getOfflineData("offlineResponses", []), offlineData])

        if (!saved) {
          // Gérer l'échec de sauvegarde
          toast({
            title: "Problème de stockage",
            description:
              "Impossible de stocker votre réponse localement. Veuillez libérer de l'espace de stockage ou réessayer plus tard.",
            variant: "destructive",
          })
          return
        }

        // Enregistrer pour synchronisation ultérieure
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          try {
            const registration = await navigator.serviceWorker.ready
            await registration.sync.register("sync-responses")
          } catch (e) {
            console.error("Erreur lors de l'enregistrement pour synchronisation:", e)
          }
        }

        toast({
          title: "Réponse enregistrée hors ligne",
          description: "Votre réponse sera synchronisée automatiquement lorsque vous serez en ligne.",
        })

        // Déclencher l'événement pour mettre à jour les statistiques
        window.dispatchEvent(new Event("formSubmitted"))
      } else {
        // Envoyer normalement
        await onSubmit(formData)

        // Stocker également dans le localStorage du dashboard
        const dashboardResponses = localStorage.getItem("dashboard_responses")
          ? JSON.parse(localStorage.getItem("dashboard_responses") || "[]")
          : []

        dashboardResponses.push({
          ...formData,
          id: `response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        })

        localStorage.setItem("dashboard_responses", JSON.stringify(dashboardResponses))

        // Déclencher un événement pour mettre à jour les statistiques
        window.dispatchEvent(new Event("formSubmitted"))
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)

      // Sauvegarder localement en cas d'erreur
      const offlineData = {
        // Toutes les données du formulaire
        lieuGlobal,
        lieuAdapte,
        lieuRealite,
        commentaireLieu,
        scenarios,
        misesEnSituation,
        difficulte,
        evolutionDifficulte,
        rythme,
        duree,
        objectifsClairs,
        ameliorationAnalyse,
        articulationExercices,
        miseEnSituationSouhaite,
        miseEnSituationMoinsInteresse,
        horaires,
        attentes,
        reponseProblematiques,
        applicationMethodes,
        complementariteFormateurs,
        pedagogie,
        qualiteReponses,
        disponibiliteFormateurs,
        pertinenceDebriefings,
        satisfactionJournee,
        interetNouvelleFormation,
        commentaireLibre,
        session,

        id: `error-${Date.now()}`,
        createdAt: new Date().toISOString(),
        pendingSync: true,
        satisfactionFormation: attentes === "Très satisfait" || attentes === "Plutôt satisfait" ? "Oui" : "Non",
      }

      // Récupérer les réponses existantes
      let offlineResponses = []
      try {
        const storedResponses = localStorage.getItem("offlineResponses")
        if (storedResponses) {
          offlineResponses = JSON.parse(storedResponses)
        }
      } catch (e) {
        console.error("Erreur lors de la récupération des réponses hors ligne", e)
      }

      // Ajouter la nouvelle réponse
      offlineResponses.push(offlineData)

      // Sauvegarder les réponses
      localStorage.setItem("offlineResponses", JSON.stringify(offlineResponses))

      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'envoi du formulaire. Vos réponses ont été sauvegardées localement.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-2 border-blue-100 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-xl font-bold">Votre avis compte</h2>
            <p className="text-blue-100">Aidez-nous à améliorer nos formations</p>
          </div>

          <div className="p-6 space-y-8">
            {!isOnline && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-amber-800 text-sm">
                  Vous êtes actuellement hors ligne. Votre réponse sera enregistrée localement et synchronisée
                  automatiquement lorsque vous serez connecté à Internet.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session" className="text-base font-medium flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-xs font-bold">
                    1
                  </span>
                  Votre section
                </Label>
                <Select value={session} onValueChange={setSession}>
                  <SelectTrigger className="w-full border-2 focus:border-blue-500 h-12">
                    <SelectValue placeholder="Sélectionnez votre section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SECTION 1">SECTION 1</SelectItem>
                    <SelectItem value="SECTION 2">SECTION 2</SelectItem>
                    <SelectItem value="SECTION 3">SECTION 3</SelectItem>
                    <SelectItem value="SECTION 4">SECTION 4</SelectItem>
                  </SelectContent>
                </Select>
                {errors.session && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.session}
                  </p>
                )}
              </div>

              <div className="space-y-6 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-blue-900">Lieux de la formation</h2>
                </div>

                <div className="space-y-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="lieuGlobal" className="text-base">
                      Appréciation globale du lieu
                    </Label>
                    <Select value={lieuGlobal} onValueChange={setLieuGlobal}>
                      <SelectTrigger className="w-full border focus:border-blue-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                        <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                        <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                        <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.lieuGlobal && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lieuGlobal}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lieuAdapte" className="text-base">
                      Le lieu était-il adapté à la formation ?
                    </Label>
                    <Select value={lieuAdapte} onValueChange={setLieuAdapte}>
                      <SelectTrigger className="w-full border focus:border-blue-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oui, parfaitement">Oui, parfaitement</SelectItem>
                        <SelectItem value="Oui, avec quelques réserves">Oui, avec quelques réserves</SelectItem>
                        <SelectItem value="Non, pas vraiment">Non, pas vraiment</SelectItem>
                        <SelectItem value="Non, pas du tout">Non, pas du tout</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.lieuAdapte && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lieuAdapte}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lieuRealite" className="text-base">
                      Le lieu correspondait-il à la réalité opérationnelle ?
                    </Label>
                    <Select value={lieuRealite} onValueChange={setLieuRealite}>
                      <SelectTrigger className="w-full border focus:border-blue-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oui, parfaitement">Oui, parfaitement</SelectItem>
                        <SelectItem value="Oui, avec quelques différences">Oui, avec quelques différences</SelectItem>
                        <SelectItem value="Non, assez différent">Non, assez différent</SelectItem>
                        <SelectItem value="Non, complètement différent">Non, complètement différent</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.lieuRealite && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lieuRealite}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commentaireLieu" className="text-base">
                      Commentaires sur le lieu
                    </Label>
                    <Textarea
                      id="commentaireLieu"
                      value={commentaireLieu}
                      onChange={(e) => setCommentaireLieu(e.target.value)}
                      placeholder="Vos commentaires sur le lieu de formation..."
                      className="min-h-[100px] border-2 focus:border-blue-500"
                    />
                    {errors.commentaireLieu && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.commentaireLieu}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-600 text-white p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-indigo-900">La formation et son contenu</h2>
                </div>

                <div className="space-y-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="scenarios" className="text-base">
                      Pertinence des scénarios
                    </Label>
                    <Select value={scenarios} onValueChange={setScenarios}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très pertinents">Très pertinents</SelectItem>
                        <SelectItem value="Plutôt pertinents">Plutôt pertinents</SelectItem>
                        <SelectItem value="Peu pertinents">Peu pertinents</SelectItem>
                        <SelectItem value="Pas du tout pertinents">Pas du tout pertinents</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.scenarios && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.scenarios}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="misesEnSituation" className="text-base">
                      Qualité des mises en situation
                    </Label>
                    <Select value={misesEnSituation} onValueChange={setMisesEnSituation}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellente">Excellente</SelectItem>
                        <SelectItem value="Bonne">Bonne</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Insuffisante">Insuffisante</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.misesEnSituation && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.misesEnSituation}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulte" className="text-base">
                      Niveau de difficulté
                    </Label>
                    <Select value={difficulte} onValueChange={setDifficulte}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trop facile">Trop facile</SelectItem>
                        <SelectItem value="Facile">Facile</SelectItem>
                        <SelectItem value="Adapté">Adapté</SelectItem>
                        <SelectItem value="Difficile">Difficile</SelectItem>
                        <SelectItem value="Trop difficile">Trop difficile</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.difficulte && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.difficulte}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evolutionDifficulte" className="text-base">
                      Évolution de la difficulté
                    </Label>
                    <Select value={evolutionDifficulte} onValueChange={setEvolutionDifficulte}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Progression trop rapide">Progression trop rapide</SelectItem>
                        <SelectItem value="Progression adaptée">Progression adaptée</SelectItem>
                        <SelectItem value="Progression trop lente">Progression trop lente</SelectItem>
                        <SelectItem value="Pas de progression claire">Pas de progression claire</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.evolutionDifficulte && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.evolutionDifficulte}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rythme" className="text-base">
                      Rythme de la formation
                    </Label>
                    <Select value={rythme} onValueChange={setRythme}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trop lent">Trop lent</SelectItem>
                        <SelectItem value="Adapté">Adapté</SelectItem>
                        <SelectItem value="Trop rapide">Trop rapide</SelectItem>
                        <SelectItem value="Irrégulier">Irrégulier</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.rythme && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.rythme}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duree" className="text-base">
                      Durée de la formation
                    </Label>
                    <Select value={duree} onValueChange={setDuree}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trop courte">Trop courte</SelectItem>
                        <SelectItem value="Adaptée">Adaptée</SelectItem>
                        <SelectItem value="Trop longue">Trop longue</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.duree && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.duree}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectifsClairs" className="text-base">
                      Clarté des objectifs
                    </Label>
                    <Select value={objectifsClairs} onValueChange={setObjectifsClairs}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très clairs">Très clairs</SelectItem>
                        <SelectItem value="Plutôt clairs">Plutôt clairs</SelectItem>
                        <SelectItem value="Peu clairs">Peu clairs</SelectItem>
                        <SelectItem value="Pas du tout clairs">Pas du tout clairs</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.objectifsClairs && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.objectifsClairs}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ameliorationAnalyse" className="text-base">
                      Amélioration de votre capacité d'analyse
                    </Label>
                    <Select value={ameliorationAnalyse} onValueChange={setAmeliorationAnalyse}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Forte amélioration">Forte amélioration</SelectItem>
                        <SelectItem value="Amélioration notable">Amélioration notable</SelectItem>
                        <SelectItem value="Légère amélioration">Légère amélioration</SelectItem>
                        <SelectItem value="Aucune amélioration">Aucune amélioration</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.ameliorationAnalyse && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.ameliorationAnalyse}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="articulationExercices" className="text-base">
                      Articulation entre les exercices
                    </Label>
                    <Select value={articulationExercices} onValueChange={setArticulationExercices}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très cohérente">Très cohérente</SelectItem>
                        <SelectItem value="Plutôt cohérente">Plutôt cohérente</SelectItem>
                        <SelectItem value="Peu cohérente">Peu cohérente</SelectItem>
                        <SelectItem value="Pas du tout cohérente">Pas du tout cohérente</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.articulationExercices && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.articulationExercices}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="miseEnSituationSouhaite" className="text-base">
                      Mise en situation que vous auriez souhaité voir
                    </Label>
                    <Textarea
                      id="miseEnSituationSouhaite"
                      value={miseEnSituationSouhaite}
                      onChange={(e) => setMiseEnSituationSouhaite(e.target.value)}
                      placeholder="Décrivez une mise en situation que vous auriez aimé voir..."
                      className="min-h-[100px] border-2 focus:border-indigo-500"
                    />
                    {errors.miseEnSituationSouhaite && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.miseEnSituationSouhaite}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="miseEnSituationMoinsInteresse" className="text-base">
                      Mise en situation qui vous a le moins intéressé
                    </Label>
                    <Textarea
                      id="miseEnSituationMoinsInteresse"
                      value={miseEnSituationMoinsInteresse}
                      onChange={(e) => setMiseEnSituationMoinsInteresse(e.target.value)}
                      placeholder="Décrivez une mise en situation qui vous a le moins intéressé..."
                      className="min-h-[100px] border-2 focus:border-indigo-500"
                    />
                    {errors.miseEnSituationMoinsInteresse && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.miseEnSituationMoinsInteresse}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horaires" className="text-base">
                      Satisfaction concernant les horaires
                    </Label>
                    <Select value={horaires} onValueChange={setHoraires}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                        <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                        <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                        <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.horaires && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.horaires}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attentes" className="text-base">
                      La formation a-t-elle répondu à vos attentes ?
                    </Label>
                    <Select value={attentes} onValueChange={setAttentes}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                        <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                        <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                        <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.attentes && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.attentes}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reponseProblematiques" className="text-base">
                      La formation a-t-elle répondu à vos problématiques ?
                    </Label>
                    <Select value={reponseProblematiques} onValueChange={setReponseProblematiques}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oui, totalement">Oui, totalement</SelectItem>
                        <SelectItem value="Oui, partiellement">Oui, partiellement</SelectItem>
                        <SelectItem value="Non, pas vraiment">Non, pas vraiment</SelectItem>
                        <SelectItem value="Non, pas du tout">Non, pas du tout</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.reponseProblematiques && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.reponseProblematiques}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationMethodes" className="text-base">
                      Pensez-vous pouvoir appliquer les méthodes apprises ?
                    </Label>
                    <Select value={applicationMethodes} onValueChange={setApplicationMethodes}>
                      <SelectTrigger className="w-full border focus:border-indigo-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oui, facilement">Oui, facilement</SelectItem>
                        <SelectItem value="Oui, avec quelques adaptations">Oui, avec quelques adaptations</SelectItem>
                        <SelectItem value="Difficilement">Difficilement</SelectItem>
                        <SelectItem value="Non, pas applicable">Non, pas applicable</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.applicationMethodes && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.applicationMethodes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 text-white p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-purple-900">Les formateurs</h2>
                </div>

                <div className="space-y-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="complementariteFormateurs" className="text-base">
                      Complémentarité des formateurs
                    </Label>
                    <Select value={complementariteFormateurs} onValueChange={setComplementariteFormateurs}>
                      <SelectTrigger className="w-full border focus:border-purple-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellente">Excellente</SelectItem>
                        <SelectItem value="Bonne">Bonne</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Insuffisante">Insuffisante</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.complementariteFormateurs && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.complementariteFormateurs}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pedagogie" className="text-base">
                      Qualité de la pédagogie
                    </Label>
                    <Select value={pedagogie} onValueChange={setPedagogie}>
                      <SelectTrigger className="w-full border focus:border-purple-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très bien">Très bien</SelectItem>
                        <SelectItem value="Bien">Bien</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="À améliorer">À améliorer</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.pedagogie && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.pedagogie}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualiteReponses" className="text-base">
                      Qualité des réponses aux questions
                    </Label>
                    <Select value={qualiteReponses} onValueChange={setQualiteReponses}>
                      <SelectTrigger className="w-full border focus:border-purple-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très satisfaisante">Très satisfaisante</SelectItem>
                        <SelectItem value="Satisfaisante">Satisfaisante</SelectItem>
                        <SelectItem value="Peu satisfaisante">Peu satisfaisante</SelectItem>
                        <SelectItem value="Insatisfaisante">Insatisfaisante</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.qualiteReponses && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.qualiteReponses}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disponibiliteFormateurs" className="text-base">
                      Disponibilité des formateurs
                    </Label>
                    <Select value={disponibiliteFormateurs} onValueChange={setDisponibiliteFormateurs}>
                      <SelectTrigger className="w-full border focus:border-purple-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très disponibles">Très disponibles</SelectItem>
                        <SelectItem value="Disponibles">Disponibles</SelectItem>
                        <SelectItem value="Peu disponibles">Peu disponibles</SelectItem>
                        <SelectItem value="Pas du tout disponibles">Pas du tout disponibles</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.disponibiliteFormateurs && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.disponibiliteFormateurs}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pertinenceDebriefings" className="text-base">
                      Pertinence des debriefings
                    </Label>
                    <Select value={pertinenceDebriefings} onValueChange={setPertinenceDebriefings}>
                      <SelectTrigger className="w-full border focus:border-purple-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très pertinents">Très pertinents</SelectItem>
                        <SelectItem value="Pertinents">Pertinents</SelectItem>
                        <SelectItem value="Peu pertinents">Peu pertinents</SelectItem>
                        <SelectItem value="Pas du tout pertinents">Pas du tout pertinents</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.pertinenceDebriefings && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.pertinenceDebriefings}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="satisfactionJournee" className="text-base">
                      Satisfaction globale de la journée
                    </Label>
                    <Select value={satisfactionJournee} onValueChange={setSatisfactionJournee}>
                      <SelectTrigger className="w-full border focus:border-purple-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                        <SelectItem value="Satisfait">Satisfait</SelectItem>
                        <SelectItem value="Peu satisfait">Peu satisfait</SelectItem>
                        <SelectItem value="Pas du tout satisfait">Pas du tout satisfait</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.satisfactionJournee && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.satisfactionJournee}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interetNouvelleFormation" className="text-base">
                      Intérêt pour une nouvelle formation
                    </Label>
                    <Select value={interetNouvelleFormation} onValueChange={setInteretNouvelleFormation}>
                      <SelectTrigger className="w-full border focus:border-purple-500">
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très intéressé">Très intéressé</SelectItem>
                        <SelectItem value="Intéressé">Intéressé</SelectItem>
                        <SelectItem value="Peu intéressé">Peu intéressé</SelectItem>
                        <SelectItem value="Pas du tout intéressé">Pas du tout intéressé</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.interetNouvelleFormation && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.interetNouvelleFormation}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commentaireLibre" className="text-base">
                      Commentaire libre
                    </Label>
                    <Textarea
                      id="commentaireLibre"
                      value={commentaireLibre}
                      onChange={(e) => setCommentaireLibre(e.target.value)}
                      placeholder="Vos commentaires, suggestions ou remarques..."
                      className="min-h-[150px] border-2 focus:border-purple-500"
                    />
                    {errors.commentaireLibre && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.commentaireLibre}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Envoyer mon avis
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
