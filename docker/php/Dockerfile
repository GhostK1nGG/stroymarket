FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libonig-dev libzip-dev libpng-dev \
 && docker-php-ext-install intl pdo pdo_mysql opcache

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
