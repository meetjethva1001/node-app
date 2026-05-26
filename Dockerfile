FROM node:alpine as Builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

FROM node:alpine

WORKDIR /app

COPY --from=Builder /app .

EXPOSE 3000

CMD ["npm" , "start"]
