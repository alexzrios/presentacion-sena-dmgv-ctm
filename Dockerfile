FROM caddy:2-alpine

WORKDIR /srv
COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html styles.css app.js ./
COPY assets ./assets

EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
