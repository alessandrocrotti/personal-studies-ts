FROM nginx:1.28.0-alpine

WORKDIR /usr/share/nginx/html

# Rimuovi il contenuto predefinito della directory html di Nginx
RUN rm -rf ./*

# Copia i file dentro la directory static dentro il container
COPY static .

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 80

# Prende la variabile d'ambiente API_URL e la inserisce in config.js e lo copia nella directory
# Questo file sovrascrive l'originale e permette di configurare l'API URL dinamicamente quando il container viene avviato
ENTRYPOINT ["./entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]