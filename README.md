# TMS-AI — Talend Monitoring System with AI Diagnostics

Plateforme centralisée de monitoring et de supervision des traitements Talend, avec détection automatique des incidents, diagnostic assisté par IA, notifications et escalade.

Projet de Fin d'Études (PFE) — développé pour **BIAT**.

---

## 📋 Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer le projet](#lancer-le-projet)
- [Structure du projet](#structure-du-projet)
- [Roadmap / Prochaines étapes](#roadmap--prochaines-étapes)

---

## Aperçu

Dans les environnements décisionnels et d'intégration de données, les traitements ETL développés avec Talend sont essentiels pour l'alimentation des systèmes d'information. Ce projet vise à développer une plateforme capable de :

- Superviser les exécutions des jobs Talend en temps réel
- Détecter automatiquement les anomalies (jobs échoués, infrastructure indisponible)
- Diagnostiquer l'origine probable d'un incident (règles métier + IA locale)
- Notifier les équipes concernées par e-mail
- Escalader automatiquement les incidents non résolus
- Fournir un tableau de bord avec indicateurs clés (MTTR, taux de réussite, etc.)

> **Note sur les données Talend :** en l'absence d'accès à l'environnement Talend réel de l'entreprise au moment du développement, le module de supervision utilise des données simulées (`fakeTalendResponse`) qui reproduisent fidèlement la structure de l'API publique Talend Cloud (TMC). Un service `TalendService` dédié est déjà scaffoldé et prêt à être connecté à une vraie instance Talend Cloud (voir [Roadmap](#roadmap--prochaines-étapes)).

---

## Stack technique

**Backend**
- [NestJS](https://nestjs.com/) (Node.js / TypeScript)
- [TypeORM](https://typeorm.io/) + PostgreSQL
- JWT (`@nestjs/jwt`, `passport-jwt`) pour l'authentification
- `bcrypt` pour le hachage des mots de passe
- `@nestjs/schedule` pour les tâches planifiées (polling, escalade)
- `nodemailer` pour les notifications e-mail
- [Ollama](https://ollama.com/) (modèle **Llama 3.2** local) pour le diagnostic assisté par IA

**Frontend**
- [Angular](https://angular.dev/) (standalone components)
- Design system maison (palette bleu marine / or, cohérent avec l'identité BIAT)

**Base de données**
- PostgreSQL

---

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│   Angular   │ ─────▶ │      NestJS       │ ─────▶ │  PostgreSQL  │
│  (frontend) │  HTTP  │     (backend)      │  TypeORM│              │
└─────────────┘        └──────────────────┘        └──────────────┘
                              │      │
                    ┌─────────┘      └─────────┐
                    ▼                          ▼
            ┌───────────────┐         ┌────────────────┐
            │ Ollama (IA)   │         │ Nodemailer      │
            │ localhost:11434│        │ (SMTP Gmail)    │
            └───────────────┘         └────────────────┘
```

### Flux de traitement d'un incident

1. **Polling** — un job planifié (`@Cron`) interroge Talend (ou les données simulées) et les vérifications d'infrastructure (base de données, serveur), chaque minute.
2. **Détection** — si un job échoue ou qu'une vérification d'infrastructure échoue, un incident est créé automatiquement (avec déduplication : pas de doublons pour un incident déjà ouvert).
3. **Diagnostic** — deux mécanismes en parallèle :
   - **Basé sur des règles** : corrélation entre le message d'erreur et l'état de l'infrastructure au même moment.
   - **Basé sur l'IA** : un modèle Llama 3.2, exécuté localement via Ollama, analyse le contexte et propose une cause probable + une action recommandée.
4. **Notification** — un e-mail est envoyé automatiquement avec les détails de l'incident.
5. **Escalade** — si l'incident reste `OPEN` au-delà d'un seuil configurable, une alerte d'escalade est envoyée et journalisée dans un historique dédié.
6. **Résolution** — un utilisateur peut résoudre l'incident depuis le tableau de bord ; le délai de résolution alimente le calcul du MTTR.

---

## Fonctionnalités

| Module | Description |
|---|---|
| **Authentification** | Inscription / connexion, mots de passe hachés (bcrypt), sessions JWT, déconnexion automatique après 30 min d'inactivité |
| **Gestion des utilisateurs** | CRUD complet, recherche, gestion des rôles (admin / utilisateur) |
| **Supervision des jobs** | Polling automatique des statuts Talend, historique, recherche/filtre |
| **Contrôle d'infrastructure** | Vérification de la disponibilité de la base de données et des serveurs |
| **Gestion des incidents** | Création automatique, diagnostic (règles + IA), résolution manuelle |
| **Diagnostic IA** | Analyse contextuelle via Ollama (Llama 3.2), exécution 100% locale |
| **Logs système** | Journalisation de tous les événements (jobs, infrastructure), recherche en texte libre |
| **Logs liés à un incident** | Visualisation des entrées de log survenues autour de la création d'un incident |
| **Notifications e-mail** | Alerte automatique à la création d'un incident |
| **Escalade** | Envoi d'une alerte supplémentaire si l'incident reste non résolu, historique d'audit dédié |
| **Tableau de bord** | Statistiques clés (jobs totaux, taux de réussite, incidents ouverts, MTTR) + graphique des incidents sur 7 jours |

---

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/download/)
- [Ollama](https://ollama.com/download) (pour le diagnostic IA)
- Un compte Gmail avec un [mot de passe d'application](https://myaccount.google.com/apppasswords) (pour les notifications)

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### Modèle IA (Ollama)

```bash
ollama pull llama3.2
```

---

## Variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` avec les variables suivantes (**ne jamais commiter ce fichier** — il est déjà exclu via `.gitignore`) :

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_NAME=tms_ai

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=1d

# E-mail (notifications)
EMAIL_USER=
EMAIL_APP_PASSWORD=
EMAIL_TO=

# Talend API (pour une future connexion réelle — voir Roadmap)
TALEND_API_URL=https://api.eu.cloud.talend.com/tmc/v2.6
TALEND_API_TOKEN=
```

---

## Lancer le projet

Trois services doivent tourner en parallèle, dans des terminaux séparés :

**1. Ollama** (généralement démarré automatiquement après installation)

**2. Backend**
```bash
cd backend
npm run start:dev
```
→ disponible sur `http://localhost:3000`

**3. Frontend**
```bash
cd frontend
ng serve
```
→ disponible sur `http://localhost:4200`

---

## Structure du projet

```
TMS-AI/
├── backend/
│   └── src/
│       ├── auth/              # Authentification JWT
│       ├── user/              # Gestion des utilisateurs
│       ├── jobs/               # Supervision des jobs Talend
│       ├── talend/             # Service d'intégration Talend (prêt, non connecté)
│       ├── infrastructure/     # Contrôle DB / serveurs
│       ├── incidents/          # Détection, diagnostic, escalade
│       ├── escalation-logs/    # Historique d'audit des escalades
│       ├── notifications/      # Envoi d'e-mails
│       ├── ai/                 # Diagnostic assisté par IA (Ollama)
│       ├── logs/               # Journalisation système
│       └── dashboard/          # Statistiques et indicateurs
│
└── frontend/
    └── src/app/
        ├── components/          # Pages : jobs, incidents, users, logs, escalations, login...
        ├── services/            # Appels API vers le backend
        ├── guards/              # Protection des routes (auth)
        └── interceptors/        # Injection automatique du token JWT
```

---

## Roadmap / Prochaines étapes

- [ ] Connexion à l'API réelle de Talend Cloud (remplacer les données simulées dans `jobs.service.ts`)
- [ ] Lecture directe des logs Talend / base de données / applicatifs (au-delà des logs générés par l'application elle-même)
- [ ] Notifications Microsoft Teams / SMS
- [ ] Orchestration des appels IA via n8n
- [ ] Classification automatique de la criticité par IA
- [ ] Génération d'un résumé d'incident par IA avant envoi au support

---

## Auteur

Projet réalisé dans le cadre d'un Projet de Fin d'Études (PFE), en collaboration avec BIAT.
