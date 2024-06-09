
FROM node:20-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY src ./src/
COPY .env ./
COPY bill.js ./
RUN npm install --only=production
EXPOSE 8080
CMD [ "npm", "start"]
