# 构建阶段
FROM node:16-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# 生产阶段
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./
RUN yarn install --production

EXPOSE 8080
CMD ["node", "dist/index.js"]