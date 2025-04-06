FROM node:20
WORKDIR /app
COPY package*.json ./
COPY . .
ENV VITE_API_URL=http://localhost:8000
EXPOSE 3000
CMD ["npm", "run", "dev"]