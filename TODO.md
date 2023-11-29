# TODO
- [ ] backend api response :
```json
{
    // (si ok)
    status: "success",
    data: {/* ... */}
    // (si error)
    status: "error",
    error: {
        type: "MissingParameters",
        code: 400,
        message: "..."
    }
}
```
- [ ] Gestion des messages d'erreur
- [ ] Renommer, partager, supprimer feuille depuis le listing
- [ ] Filtre de recherche
- [ ] Récupérer les feuilles partagées (filtre de gauche)
- [ ] Tester si le token de l'uti est pas expiré à chaque requete
- [ ] socket.io

# FIXME
- [x] Délai de chargement au login
- [x] Renommer champs créateur sheet : sht_idtusr_aut
- [x] Cellules écrasées
- [x] Bug quand on vient de se login, profile et listing inatteignable (demande refresh pour que ça marche) ==> pas une histoire de cache, car on voit l'url s'afficher 0.1s