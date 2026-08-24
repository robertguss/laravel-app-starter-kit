# syntax=docker/dockerfile:1.19

FROM node:22.23.2-bookworm-slim@sha256:d649c27dae7ba0137b3cef5dd75baa422c08dc3d9e3fc0c23dfb172dc3cc6436 AS node

FROM serversideup/php:8.3-fpm-nginx-v4.5.1@sha256:6f231bc747f6866e65d1202b27b55460a3b00edab08a12de543266a7eabce9ad AS build

USER root
WORKDIR /var/www/html

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

COPY composer.json composer.lock ./
RUN composer install \
    --classmap-authoritative \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --prefer-dist

COPY . .

RUN composer dump-autoload --classmap-authoritative --no-dev --no-interaction \
    && npm ci --ignore-scripts \
    && npm run build \
    && rm -rf node_modules

FROM serversideup/php:8.3-fpm-nginx-v4.5.1@sha256:6f231bc747f6866e65d1202b27b55460a3b00edab08a12de543266a7eabce9ad AS runtime

ENV APP_DEBUG=false \
    APP_ENV=production \
    AUTORUN_ENABLED=false \
    HEALTHCHECK_PATH=/up \
    LOG_CHANNEL=stderr \
    PHP_OPCACHE_ENABLE=1 \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS=0 \
    SHOW_WELCOME_MESSAGE=false

USER root
WORKDIR /var/www/html

COPY --from=build --chown=www-data:www-data /var/www/html /var/www/html

RUN mkdir -p \
        bootstrap/cache \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/testing \
        storage/framework/views \
        storage/logs \
    && chown -R www-data:www-data bootstrap/cache storage

STOPSIGNAL SIGTERM

USER www-data

EXPOSE 8080
