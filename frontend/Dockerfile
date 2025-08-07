FROM node:22.2.0-bullseye-slim as builder
# Install pnpm globally
RUN npm install -g pnpm

COPY . /data
WORKDIR /data

RUN pnpm install
RUN pnpx vite build


FROM nginx:1.25.1
COPY --from=builder /data/dist /www/dist
COPY deploy/nginx/conf.d/simple-todo.conf /etc/nginx/conf.d/default.conf
