// Charger localforage pour le stockage hors ligne
document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script")
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js"
  script.integrity = "sha512-+DHgAc7lN1XWJIi8FkOPiKAm/LbYjKIT/537nh1tNfv4JqfOUZbJ0Vv4n+4+5F+VNJM+8iHZZS3VKhGHSzwCUQ=="
  script.crossOrigin = "anonymous"
  script.referrerPolicy = "no-referrer"
  document.head.appendChild(script)
})
