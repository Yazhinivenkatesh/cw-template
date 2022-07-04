FROM node:14
WORKDIR /src
COPY package.json ./
RUN npm i
COPY . .
CMD ["npm", "start"]
