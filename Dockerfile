FROM --platform=linux/amd64 node:18

ENV DATABASE_URL="DATABASE_URL"
ENV JWT_SECRET="JWT_SECRET"

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma generate

EXPOSE 3001

CMD yarn prisma migrate dev && yarn dev


