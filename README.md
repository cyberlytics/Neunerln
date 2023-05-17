# team-weiß - Neuerln

This project consists of two main components: the frontend and the backend. The frontend is located in the app folder under sys-src and the backend is located in the server folder also under sys-src.

## Prerequisites

Before you get started, you need to have the following software installed on your machine:

1. Node.js - v18.x.x or higher
2. npm - v9.x.x or higher
3. Git - v2.x.x or higher

#### Install NodeJS

Visit the offical website to download and install [NodeJS](https://nodejs.org/en).

#### Update npm

To update npm to the latest version, run the following command:

```bash
npm install -g npm@latest
```

#### Install git

Visit the offical website to download and install [git](https://git-scm.com/downloads).

#### Update git

To update git to the latest version, run the following command:

```bash
git update
```

## Structur

```
.
├─sys-doc/
│ ├─ {YYYYMMDD}_TeamWeiß_Architektur.pdf
│ └─ concept/      # Concept Paper-Folder
├─sys-src/
│ ├─ app/          # Frontend-Folder
│ └─ server/       # Backend-Folder
├─ .gitignore
└─ README.md
```

## Frontend

```bash
cd sys-src/app
npm install
npm run dev
```

This starts the development server for the fronted in vue. By default, it is accessible at http://localhost:5173/

## Backend

```bash
cd sys-src/server
npm install
npm run start
```

This starts the development server for the backend. By default, it is accessible at http://localhost:3000/
