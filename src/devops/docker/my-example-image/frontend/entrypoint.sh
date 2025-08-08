#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.API_URL = "${API_URL}";
EOF

# Estende l'entrypoint di Nginx per eseguire il comando passato come argomento del CMD
# Questo permette di mantenere il comportamento predefinito di Nginx
# e di eseguire il comando specificato nel Dockerfile o nel docker-compose
exec /docker-entrypoint.sh "$@"