# Dockerfile para Frontend Angular
# Multi-stage build para optimizar el tamaño de la imagen

# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de npm
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build -- --configuration production

# Etapa 2: Servidor web Nginx para servir la aplicación
FROM nginx:alpine

# Instalar wget para health check
RUN apk add --no-cache wget

# Copiar los archivos construidos desde la etapa anterior
# Angular CLI genera el build en dist/nombre-proyecto/ o directamente en dist/
# Usamos un script para copiar el contenido correcto automáticamente
COPY --from=build /app/dist /tmp/dist

# Script para copiar el contenido correcto (maneja ambos casos)
RUN if [ -d "/tmp/dist/datta-able-free-angular-admin-template" ]; then \
        cp -r /tmp/dist/datta-able-free-angular-admin-template/* /usr/share/nginx/html/; \
    elif [ -f "/tmp/dist/index.html" ]; then \
        cp -r /tmp/dist/* /usr/share/nginx/html/; \
    else \
        find /tmp/dist -type d -mindepth 1 -maxdepth 1 | head -1 | xargs -I {} cp -r {}/* /usr/share/nginx/html/; \
    fi && \
    rm -rf /tmp/dist

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Health check usando curl (más común en imágenes Alpine)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --spider --quiet http://localhost/ || exit 1

# Nginx se inicia automáticamente
CMD ["nginx", "-g", "daemon off;"]

