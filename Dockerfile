# ================================
# ETAPA 1: Construcción (Build)
# ================================
FROM node:20-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm ci --silent

# Copia el resto del código fuente
COPY . .

# Compila la aplicación Angular en modo producción
RUN npm run build -- --configuration production

# ================================
# ETAPA 2: Servidor Web (Nginx)
# ================================
FROM nginx:1.25-alpine

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copia los archivos compilados de Angular
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80 (Nginx escucha en 80, lo mapearemos a 4200)
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
