# Exercice 2 — Workflow Git et résolution de conflits

## a) Création de branches parallèles et génération d’un conflit

Depuis `develop`, création de deux branches de fonctionnalité :
- `feature/add-endpoint`
- `feature/update-health`

Pour provoquer un conflit, les deux branches ont modifié la même zone du fichier `backend/server.js` (route `GET /health`) mais avec un contenu différent.

## b) Fusion, conflit, résolution

- Fusion de `feature/update-health` dans `develop` : merge réussi.
- Fusion ensuite de `feature/add-endpoint` dans `develop` : conflit détecté sur `backend/server.js`.

Le conflit a été résolu en conservant les deux apports (endpoints ajoutés) et en unifiant la réponse de `/health`.

## c) Différence entre merge et rebase

**`git merge`** combine deux historiques en créant un commit de merge (si nécessaire). L’historique n’est pas réécrit : c’est plus sûr sur des branches partagées, et cela conserve une trace explicite des fusions.

**`git rebase`** “rejoue” des commits au-dessus d’une autre base, ce qui réécrit l’historique. Cela permet un historique plus linéaire, mais c’est à éviter sur une branche déjà poussée et utilisée par d’autres (risque de divergence et de conflits supplémentaires).

Recommandation : rebase pour nettoyer une branche locale avant PR, merge pour intégrer des branches dans `develop/main` en équipe.

## d) Conventional Commits

Les messages de commits suivent Conventional Commits (ex: `chore: ...`, `feat(api): ...`, `docs: ...`) afin de standardiser l’historique, faciliter la lecture et préparer l’automatisation (release notes/versioning).

