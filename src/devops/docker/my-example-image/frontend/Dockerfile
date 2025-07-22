FROM nginx:1.28.0-alpine

# Rimuovi il contenuto predefinito della directory html di Nginx
RUN rm -rf /usr/share/nginx/html

# Copia i file dentro la directory static dentro il container
COPY static /usr/share/nginx/html