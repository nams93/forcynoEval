// Taille maximale approximative pour le stockage local (en octets)
const MAX_STORAGE_SIZE = 4 * 1024 * 1024 // 4 MB

/**
 * Vérifie si le localStorage est disponible et fonctionnel
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = "test"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Estime la taille actuelle utilisée par le localStorage
 */
export function estimateLocalStorageSize(): number {
  let totalSize = 0

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key) || ""
      totalSize += key.length + value.length
    }
  }

  return totalSize * 2 // Approximation (caractères UTF-16)
}

/**
 * Vérifie si l'ajout de données dépasserait la limite de stockage
 */
export function willExceedStorageLimit(dataToAdd: string): boolean {
  const currentSize = estimateLocalStorageSize()
  const dataSize = dataToAdd.length * 2 // Approximation

  return currentSize + dataSize > MAX_STORAGE_SIZE
}

/**
 * Nettoie les anciennes données si nécessaire pour faire de la place
 */
export function cleanupOldData(bytesNeeded: number): boolean {
  try {
    // Récupérer les réponses hors ligne
    const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")

    // Si pas de réponses, impossible de nettoyer
    if (offlineResponses.length === 0) {
      return false
    }

    // Trier par date (plus ancien en premier)
    offlineResponses.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp || a.createdAt).getTime()
      const dateB = new Date(b.timestamp || b.createdAt).getTime()
      return dateA - dateB
    })

    // Supprimer les plus anciennes réponses jusqu'à libérer assez d'espace
    let bytesFreed = 0
    const cleanedResponses = [...offlineResponses]

    while (bytesFreed < bytesNeeded && cleanedResponses.length > 0) {
      const removed = cleanedResponses.shift()
      if (removed) {
        // Estimer la taille de cette réponse
        const itemSize = JSON.stringify(removed).length * 2
        bytesFreed += itemSize
      }
    }

    // Sauvegarder les réponses restantes
    localStorage.setItem("offlineResponses", JSON.stringify(cleanedResponses))

    return bytesFreed >= bytesNeeded
  } catch (e) {
    console.error("Erreur lors du nettoyage des anciennes données:", e)
    return false
  }
}

/**
 * Sauvegarde des données en mode hors ligne de manière sécurisée
 */
export function saveOfflineData(key: string, data: any): boolean {
  try {
    if (!isLocalStorageAvailable()) {
      console.error("localStorage n'est pas disponible")
      return false
    }

    const serializedData = JSON.stringify(data)

    // Vérifier si l'ajout dépasserait la limite
    if (willExceedStorageLimit(serializedData)) {
      // Tenter de nettoyer pour faire de la place
      const bytesNeeded = serializedData.length * 2
      const cleaned = cleanupOldData(bytesNeeded)

      if (!cleaned) {
        console.error("Impossible de libérer assez d'espace de stockage")
        return false
      }
    }

    // Sauvegarder les données
    localStorage.setItem(key, serializedData)
    return true
  } catch (e) {
    console.error(`Erreur lors de la sauvegarde des données hors ligne (${key}):`, e)
    return false
  }
}

/**
 * Récupère des données stockées en mode hors ligne
 */
export function getOfflineData<T>(key: string, defaultValue: T): T {
  try {
    if (!isLocalStorageAvailable()) {
      return defaultValue
    }

    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (e) {
    console.error(`Erreur lors de la récupération des données hors ligne (${key}):`, e)
    return defaultValue
  }
}

/**
 * Ajoute un élément à un tableau stocké en mode hors ligne
 */
export function addToOfflineArray<T>(key: string, item: T): boolean {
  try {
    const currentArray = getOfflineData<T[]>(key, [])
    currentArray.push(item)
    return saveOfflineData(key, currentArray)
  } catch (e) {
    console.error(`Erreur lors de l'ajout à un tableau hors ligne (${key}):`, e)
    return false
  }
}
