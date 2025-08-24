# 🏠 UAE Home Services Platform

Une plateforme SaaS moderne pour connecter les prestataires de services à domicile avec les clients aux Émirats Arabes Unis.

## 🚀 Fonctionnalités Principales

### Pour les Clients

- **Recherche intuitive** : Trouvez rapidement des prestataires par service, localisation et disponibilité
- **Réservation simplifiée** : Réservez en quelques clics avec prix transparent
- **Paiement sécurisé** : Intégration de solutions de paiement locales et internationales
- **Suivi en temps réel** : Notifications et communication directe avec les prestataires
- **Système d'avis** : Notations et commentaires pour maintenir la qualité

### Pour les Prestataires

- **Profil professionnel** : Mise en valeur de vos services et tarifs
- **Gestion de planning** : Calendrier intelligent avec synchronisation
- **Tableau de bord financier** : Suivi des revenus et des commissions
- **Notifications instantanées** : Alertes pour nouvelles réservations
- **Vérification d'identité** : Processus de validation pour instaurer la confiance

### Pour les Administrateurs

- **Dashboard complet** : Vue d'ensemble de la plateforme
- **Gestion des utilisateurs** : Modération et validation des comptes
- **Analytics avancées** : Rapports détaillés et métriques de performance
- **Support client** : Outils de gestion des litiges et FAQ

## 🛠 Stack Technique

### Frontend & Backend

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Authentification** : NextAuth.js

### Base de Données & Services

- **Database** : MongoDB Atlas (Free Tier)
- **File Storage** : Vercel Blob Storage
- **Email** : Resend (Free Tier)
- **Maps** : Google Maps API
- **Payments** : Stripe + Telr (UAE local)

### Déploiement & Infrastructure

- **Hosting** : Vercel (Free Plan)
- **Domain** : Vercel Domains
- **Analytics** : Vercel Analytics
- **Monitoring** : Vercel Speed Insights

## 🏗 Architecture

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Routes d'authentification
│   │   ├── (client)/          # Interface client
│   │   ├── (provider)/        # Interface prestataire
│   │   ├── (admin)/           # Dashboard admin
│   │   └── api/               # API Routes
│   ├── components/            # Composants réutilisables
│   │   ├── ui/                # shadcn/ui components
│   │   ├── forms/             # Formulaires
│   │   ├── layout/            # Layout components
│   │   └── features/          # Composants métier
│   ├── lib/                   # Utilitaires et configurations
│   │   ├── auth.ts           # Configuration NextAuth
│   │   ├── db.ts             # Connexion MongoDB
│   │   ├── validations/       # Schémas Zod
│   │   └── utils.ts          # Fonctions utilitaires
│   ├── types/                 # Types TypeScript
│   └── hooks/                 # Custom React hooks
├── public/                    # Assets statiques
└── prisma/                   # Schémas de base de données (optionnel)
```

## 🌍 Fonctionnalités Locales UAE

- **Langues** : Anglais et Arabe (RTL support)
- **Devise** : Dirham des Émirats (AED)
- **Paiements locaux** : Intégration Telr
- **Géolocalisation** : Focus sur les 7 émirats
- **Conformité** : Respect des réglementations locales

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte MongoDB Atlas (gratuit)
- Compte Vercel (gratuit)

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/uae-home-services.git
cd uae-home-services

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Démarrer en développement
npm run dev
```

### Variables d'Environnement

```env
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Payment
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
TELR_STORE_ID=...
TELR_AUTH_KEY=...

# Maps
GOOGLE_MAPS_API_KEY=...

# Email
RESEND_API_KEY=...
```

## 📱 Fonctionnalités par Version

### Phase 1 - MVP (2-3 mois)

- ✅ Authentification (Google, Email)
- ✅ Profils clients et prestataires
- ✅ Système de réservation basique
- ✅ Paiements Stripe
- ✅ Interface responsive

### Phase 2 - Croissance (1-2 mois)

- 🔄 Application mobile (PWA)
- 🔄 Système de notifications
- 🔄 Chat en temps réel
- 🔄 Géolocalisation avancée
- 🔄 Intégration Telr

### Phase 3 - Expansion (2-3 mois)

- ⏳ Multi-langues (AR/EN)
- ⏳ Analytics avancées
- ⏳ API publique
- ⏳ Programme de fidélité
- ⏳ Marketplace étendu

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

- **Email** : contact@uae-homeservices.com
- **Website** : https://uae-homeservices.vercel.app
- **Support** : https://uae-homeservices.vercel.app/support

---

**Made with ❤️ for the UAE community**
