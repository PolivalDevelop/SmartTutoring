FROM node:14

WORKDIR /smart-tutoring-app
COPY package.json .
RUN npm install
COPY . .
ENV DB_IP=db
ENV FRONTEND_IP=localhost
CMD npm run dev