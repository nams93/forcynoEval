// Fonction pour récupérer des données du localStorage
export function getLocalStorage(key: string): any {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error)
    return null
  }
}

// Fonction pour enregistrer des données dans le localStorage
export function setLocalStorage(key: string, value: any): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement de ${key} dans localStorage:`, error)
    return false
  }
}

// Fonction pour supprimer des données du localStorage
export function removeLocalStorage(key: string): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key} du localStorage:`, error)
    return false
  }
}
