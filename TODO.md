TODO:
[ ] backend api response :
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
[ ] Gestion des messages d'erreur
[ ] Renommer, partager, supprimer feuille depuis le listing
[ ] Filtre de recherche
[ ] Récupérer les feuilles partagées (filtre de gauche)
[ ] Tester si le token de l'uti est pas expiré à chaque requete
[ ] socket.io

FIXME:
[ ] Délai de chargement au login
[ ] Renommer champs createur sheet : sht_idtusr_aut
[ ] Cellules écrasées
[ ] Bug quand on vient de se login, profile et listing inatteignable (demande refresh pour que ça marche) -> pas une histoire de cache, car on voit l'url s'afficher 0.1s