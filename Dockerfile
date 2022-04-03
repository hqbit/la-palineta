FROM node:16

# Create app directory
WORKDIR /usr/src/app


# Dependencies
COPY Backend/package*.json ./
RUN npm install -g nodemon ts-node
RUN npm install

# Bundle app
COPY . .

EXPOSE 5000 8999


CMD ["ts-node", "Backend/server.ts"]