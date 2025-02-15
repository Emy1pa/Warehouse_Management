# 📱 Application Mobile de Gestion de Stock

## 📋 Description
Application mobile intuitive conçue pour simplifier la gestion des stocks en magasin. Elle permet aux magasiniers de gérer leurs produits en temps réel via un scanner de code-barres ou une saisie manuelle.

## ✨ Fonctionnalités Principales

### 🔐 Authentification
- Système de connexion sécurisé avec code secret personnel
- Gestion des sessions utilisateurs

### 📦 Gestion des Produits
- Scanner de code-barres intégré (expo-barcode-scanner)
- Saisie manuelle des codes-barres
- Gestion des quantités par entrepôt
- Formulaire de création de nouveaux produits avec :
  - Informations de base (nom, type, prix)
  - Gestion des fournisseurs
  - Upload d'images
  - Gestion des quantités initiales

### 📊 Interface de Gestion
- Liste détaillée des produits avec indicateurs visuels
- Système de filtrage et recherche avancé
- Tri dynamique des produits
- Tableau de bord avec statistiques en temps réel

### 📈 Statistiques
- Nombre total de produits
- Inventaire par ville
- Suivi des ruptures de stock
- Valeur totale des stocks
- Historique des mouvements récents

### 💾 Export et Sauvegarde
- Génération de rapports PDF (expo-print)
- Sauvegarde automatique des données

## 🛠 Installation

### Prérequis
```bash
# Installation de Node.js et npm
# Minimum requis : Node.js v14+

# Installation des dépendances globales
npm install -g json-server
```

### Configuration Backend
```bash
# Cloner le repository
git clone [https://github.com/Emy1pa/Warehouse_Management.git]

# Installation des dépendances
cd [warehouseManagement]
npm install

# Démarrer le serveur JSON
npx json-server db.json
```

### Configuration Frontend
```bash
# Installation des dépendances frontend
npm install

# Démarrer l'application
npm start
```

## 🔧 Technologies Utilisées
- React Native / Expo
- JSON Server (Backend)
- expo-barcode-scanner
- expo-print
- Autres dépendances (voir package.json)

## 🤝 Contribution
1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request
   
---
Développé avec ❤️ pour la gestion efficace des stocks en magasin
