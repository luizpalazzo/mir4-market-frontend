#!/bin/sh
# Script para iniciar nginx com porta dinâmica da Railway

# Se a variável PORT estiver definida, substituir no nginx.conf
if [ -n "$PORT" ]; then
  sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/conf.d/default.conf
fi

# Iniciar nginx
exec nginx -g 'daemon off;'

