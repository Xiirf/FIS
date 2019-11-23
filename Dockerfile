FROM node:9-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY index.js .
COPY contacts.json .
ENV NODE_ENV=production
EXPOSE 3000
CMD npm start