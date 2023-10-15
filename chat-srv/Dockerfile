#Base
FROM node:alpine as base
ENV NODE_ENV=production
ENV PATH=/opt/node_modules/.bin:$PATH
WORKDIR /opt
COPY package*.json ./
RUN npm ci\
  && npm cache clean --force

#Build stage
FROM base as build
ENV NODE_ENV=development
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm run build

#Dev stage
FROM base as dev
ENV NODE_ENV=development
RUN apk add --no-cache tini
WORKDIR /opt
RUN npm install --development
WORKDIR /opt/app
COPY . .
ENV POSTGRES_USERNAME=shahab
ENV POSTGRES_ADDRESS=192.168.1.36
ENV POSTGRES_PORT=5432
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["npm", "run", "dev"]

#Production stage
FROM base as prod
RUN apk add --no-cache tini
WORKDIR /opt/app
COPY . .
ENV PORT=4001
EXPOSE 4001
ENTRYPOINT [ "/sbin/tini", "--" ]
COPY --from=build /opt/app/build build/
CMD [ "node", "./build/index.js" ]
