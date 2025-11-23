# Etapa 1: Construcción
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- CORRECCIÓN AGRESIVA DE URLS ---
# Buscamos en TODOS los archivos .ts (servicios, componentes, entornos)
# y reemplazamos cualquier rastro de 'http://localhost:8081/clinica/v1' por '/clinica/v1'
RUN find src -name "*.ts" -type f -exec sed -i 's|http://localhost:8081/clinica/v1|/clinica/v1|g' {} +
# -----------------------------------

RUN npm run build --configuration=production

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiamos el build (ajustado a tu angular.json)
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos la configuración del Proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80