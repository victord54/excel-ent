TODO:
- backend api response :
{
    status: "ok" | "error"
    (si ok)
    data: {...}
    (si error)
    error: {
        type: MissingParameters
        message: "..."
    }
}
- Gestion des messages d'erreur
- Renommer, partager, supprimer feuille depuis le listing
- Filtre de recherche
- Récupérer les feuilles partagées (filtre de gauche)
- Tester si le token de l'uti est pas expiré à chaque requete
- Socket.io

FIXME:
- Délai de chargement au login
- Renommer champs createur sheet : sht_idtusr_aut
- cellules écrasées