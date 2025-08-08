# Runtime stage
FROM node:22.17.1-alpine
WORKDIR /home/node/app

# Copia i file nell'immagine
COPY . .
# Installa le dipendenze
RUN npm install
# Compila il progetto
RUN npm run build
# Copia il file entrypoint.sh che sarà usato come entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

# Prende la variabile d'ambiente API_URL e la inserisce in config.js e lo copia nella directory dist
# Questo file sovrascrive l'originale e permette di configurare l'API URL dinamicamente quando il container viene avviato
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start"]