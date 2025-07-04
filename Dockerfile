# Configuration Docker pour le déploiement

# Dockerfile pour le backend
FROM node:18-alpine AS backend

WORKDIR /app/backend

# Copier les fichiers de configuration
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY backend/src ./src/

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "start"]

# Dockerfile pour le frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copier les fichiers de configuration
COPY frontend/package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY frontend/src ./src/
COPY frontend/public ./public/
COPY frontend/index.html ./
COPY frontend/vite.config.js ./

# Builder l'application
RUN npm run build

# Image de production avec nginx
FROM nginx:alpine AS frontend

# Copier la build
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Dockerfile pour le dashboard admin
FROM node:18-alpine AS admin-build

WORKDIR /app/admin

# Copier les fichiers de configuration
COPY admin-dashboard/package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY admin-dashboard/src ./src/
COPY admin-dashboard/index.html ./
COPY admin-dashboard/vite.config.js ./

# Builder l'application
RUN npm run build

# Image de production avec nginx
FROM nginx:alpine AS admin

# Copier la build
COPY --from=admin-build /app/admin/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
