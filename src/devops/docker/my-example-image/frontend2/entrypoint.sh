#!/bin/sh

cat <<EOF > /home/node/app/dist/config.js
window.APP_CONFIG = {
  API_URL: "${API_URL}"
};
EOF

# Serve ad eseguire il comando passato come argomento del CMD
exec "$@"
