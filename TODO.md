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
- [x] Renommer, partager, supprimer feuille depuis le listing
- [x] Afficher bouton supprimer ssi l'utilisateur est l'auteur
- [x] Filtre de recherche
- [x] Récupérer les feuilles partagées dans le Listing
- [ ] Vérifier injections SQL
- [x] Feuille : Check si l'user est l'auteur, si non check si la feuille est partagé -> Si non agir en conséquence, si oui -> add l'utilisateur dans la table des feuilles partagés si pas déjà présent
- [ ] Tester si le token de l'uti est pas expiré à chaque requete
- [x] socket.io
- [x] Ajout dans la route getAllFromUser la liste des feuilles partagées + auteur + tri par date récent + pseudo
- [x] Route pour vérifier si une feuille est accessible par l'user /sheet/check/:uuid (retourne true ou false)
- [x] Table des invitations temporaires (30min) : idtsht, lien_invit, date_exp
- [x] Route pour créer une invitation temporaire /sheet/invite/:idsht body {lien} (check si lien invit existe deja)
- [x] Ajouter check si le lien est tjrs valide dans /share/:id
- [x] Route pour sharing
- [x] Route pour recherche de sheet par nom
- [x] Update la date de modification des feuilles
- [x] Table pour dire qui a lock telle case -> bloquer la case en front
- [ ] Dire qui est co sur une feuille

# FIXME
- [x] Délai de chargement au login
- [x] Renommer champs créateur sheet : sht_idtusr_aut
- [x] Cellules écrasées
- [x] Bug quand on vient de se login, profile et listing inatteignable (demande refresh pour que ça marche) ==> pas une histoire de cache, car on voit l'url s'afficher 0.1s