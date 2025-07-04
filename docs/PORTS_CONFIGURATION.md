# Configuration des ports de l'écosystème unifié
# Fichier de référence pour les ports de tous les services

## Architecture des ports
PORT_BACKEND=3001          # Backend API (Gestion des licences)
PORT_SEARCH_ENGINE=3002    # Search Engine (Next.js)  
PORT_BACKBPMF=3003         # BackBPMF (Fastify API)
PORT_FRONTEND=5173         # Frontend principal (React/Vite)
PORT_FRONTBPMF=5174        # FrontBPMF (React/Vite)
PORT_ADMIN_DASHBOARD=8080  # Admin Dashboard (React/Vite)

## Services et leurs technologies
# Backend (3001)          - Fastify + Prisma + PostgreSQL
# Search Engine (3002)    - Next.js + Middleware licence
# BackBPMF (3003)         - Fastify + Sequelize + Middleware licence
# Frontend (5173)         - React + Vite + Provider licence
# FrontBPMF (5174)        - React + Vite + Provider licence  
# Admin Dashboard (8080)  - React + Vite

## URLs d'accès
# http://localhost:3001 - API Backend
# http://localhost:3002 - Search Engine
# http://localhost:3003 - BackBPMF API
# http://localhost:5173 - Frontend principal
# http://localhost:5174 - FrontBPMF
# http://localhost:8080 - Admin Dashboard

## Configuration appliquée dans
# - backend/src/config/index.js (PORT=3001)
# - search-engine/.env.local (PORT=3002)
# - BackBPMF/.env (PORT=3003) + BackBPMF/server.js
# - frontend/vite.config.js (port: 5173)
# - FrontBPMF/vite.config.js (port: 5174)
# - admin-dashboard/vite.config.js (port: 8080)
# - start.sh et start-all-services.sh mis à jour
# - test-unified-ecosystem-complete.sh mis à jour
