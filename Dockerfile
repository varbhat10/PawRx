FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source
COPY server/ ./

EXPOSE 8080

CMD ["npm", "start"] 