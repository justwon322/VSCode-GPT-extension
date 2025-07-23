FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run compile
CMD ["npm", "run", "compile"]
