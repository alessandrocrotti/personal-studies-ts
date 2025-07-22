# Base image
FROM node:22.17.1-alpine

# Crea e assegna permessi all'utente node, altrimenti non può scrivere nella directory di lavoro e fare npm install
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set working directory
WORKDIR /home/node/app

# Assicura che l'utente corrente sia node per ragioni di sicurezza
# In questo modo, il container non gira come root, ma come un utente non privilegiato
USER node

# Copy package.json e tsconfig nella directory di lavoro
# --chown=node:node assicura che i file siano di proprietà dell'utente
COPY --chown=node:node package*.json tsconfig.json ./

# Installa le dipendenze
RUN npm install

# Copia il codice sorgente nella directory di lavoro
# --chown=node:node assicura che i file siano di proprietà dell'utente
COPY --chown=node:node ./src ./src

# Compila il codice TypeScript in JavaScript
RUN npm run build

# Espone la porta dell'app (8000)
# Non pubblica la porta, ma la rende disponibile per il container e "documenta" quale porta l'app è in ascolto
EXPOSE 8000

# Avvia l’app con Node usando lo script del package.json: deve esistere un solo CMD per Dockerfile
CMD ["npm", "run", "start"]
