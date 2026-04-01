# VitalSync — Chaîne CI/CD conteneurisée

Application minimaliste (squelette) de suivi médical et sportif visant à démontrer la mise en place d’une chaîne **CI/CD conteneurisée** autour de 3 services :

- **Backend** : API Node.js/Express (port **3000**)
- **Frontend** : page statique servie par **Nginx** (port **8080** en local via Docker Compose)
- **Database** : **PostgreSQL** (volume persistant)

## Architecture (vue d’ensemble)

```mermaid
flowchart LR
  U[Utilisateur / Navigateur] -->|HTTP :8080| FE[Nginx (frontend)]
  FE -->|/api/* proxy_pass| BE[Node/Express (backend) :3000]
  BE -->|TCP 5432| DB[(PostgreSQL)]
```

## Prérequis (local)

- **Git**
- **Docker Desktop** (Docker Engine + Docker Compose v2)
- (Optionnel) **Node.js 20+** si vous souhaitez lancer le backend sans Docker

## Lancer le projet en local (Docker Compose)

1) Créer le fichier d’environnement (non commité) :

```bash
cp .env.example .env
```

2) Éditer `.env` et définir `POSTGRES_PASSWORD`.

3) Démarrer les services :

```bash
docker compose up -d --build
```

4) Vérifier :

- Front : `http://localhost:8080`
- Health backend : `http://localhost:3000/health`

Arrêt :

```bash
docker compose down
```

## CI/CD (GitHub Actions)

Le workflow est défini dans `/.github/workflows/ci-cd.yml` et s’exécute :
- sur **push** vers `develop`
- sur **pull_request** vers `main`

### Étape 1 — Lint & Tests

- Installation des dépendances du backend
- Exécution d’**ESLint**
- Exécution des tests unitaires (**Jest**)

### Étape 2 — Build & Push Docker

- Build des images **backend** et **frontend**
- Tag des images avec le **SHA du commit** (traçabilité / reproductibilité)
- Push vers **GHCR** (GitHub Container Registry)

### Étape 3 — Déploiement staging (simulé)

- Déploiement via `docker compose up -d` sur le runner
- Vérification de santé via `curl http://localhost:3000/health`
- La pipeline **échoue** si le health check ne répond pas

## Choix techniques (avec justifications)

- **Multi-stage build (backend)** : exécuter tests/build dans un stage puis ne copier en production que le nécessaire réduit la taille de l’image et limite la surface d’attaque.
- **Images Alpine** (`node:20-alpine`, `postgres:16-alpine`, `nginx:1.27-alpine`) : images plus légères, adaptées à la production (moins de packages inutiles).
- **Proxy Nginx `/api/*`** : centralise l’accès via le même origin que le frontend, simplifie l’intégration navigateur et évite les problèmes CORS côté client.
- **Réseau Docker dédié** : isolation des conteneurs de l’extérieur (seuls les ports exposés sont accessibles).
- **Volume Postgres** : persistance des données (sans volume, les données seraient perdues à la suppression du conteneur).
- **Tag par SHA** : évite l’ambiguïté de `latest`, permet de redeployer exactement une version donnée.

