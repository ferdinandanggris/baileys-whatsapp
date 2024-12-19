# Gunakan image Node.js resmi sebagai base image
FROM node:18 AS build

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk menginstal dependensi
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Build aplikasi TypeScript
RUN npm run build

# Gunakan image Node.js lagi sebagai base untuk produksi
FROM node:18-slim

# Set working directory di dalam container
WORKDIR /app

# Salin dependensi dari stage build
COPY --from=build /app /app

# Ekspose port yang digunakan aplikasi (misalnya 3000)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]