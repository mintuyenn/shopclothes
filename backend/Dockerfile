# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json và cài thư viện
COPY package*.json ./
RUN npm install --production

# Copy toàn bộ code
COPY . .

# Backend chạy port 5000
EXPOSE 5000

# Lệnh chạy server
CMD ["npm", "start"]