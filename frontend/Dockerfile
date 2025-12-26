# frontend/Dockerfile

# -- Giai đoạn 1: Build React --
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# THÊM 2 DÒNG NÀY VÀO TRƯỚC LỆNH BUILD
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# -- Giai đoạn 2: Chạy Nginx --
FROM nginx:alpine
# Copy file đã build sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]