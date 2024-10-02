FROM node:18.16.1

WORKDIR /app
COPY ./backend .

RUN npm install

EXPOSE 3001

CMD npm run build && npm run start:prod
