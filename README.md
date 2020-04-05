# Broadway API

![travis](https://travis-ci.org/ungdev/broadway-api.svg?branch=master)
API du site de l'assocation Broadway UTT

## Installation

### Prérequis

- NodeJS
- Yarn
- MySQL

### Base de données

Créer la base de données broadway

```
CREATE DATABASE broadway CHARACTER SET utf8;
```

### Installation de l'API et des dépendances

```
git clone https://github.com/ungdev/broadway-api
cp .env.example .env
yarn
yarn seed
```

## Développement

### Démarrer l'API en développement

```
yarn dev
```

### Avant de commit

Afin de garder une certaine cohérence dans le code, on utilise EsLint et Prettier. Il faut donc bien lint le code avant de commit

```
yarn lint-fix
```

### Démarrer l'API en production

```
yarn build
yarn start
```

### Documentation

Le modèle de la base de donnée est situé [ici](https://dbdiagram.io/d/5e24e0719e76504e0ef06dd9)

### Licence

Le code est sous licence MIT.
