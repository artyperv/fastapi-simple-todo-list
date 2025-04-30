FROM node:22.2.0-bullseye-slim as builder
COPY . /data
WORKDIR /data
RUN npm install && npx vite build


FROM nginx:1.25.1
COPY --from=builder /data/dist /www/dist
COPY deploy/nginx/conf.d/simple-todo.conf /etc/nginx/conf.d/default.conf
