FROM node:22-alpine
WORKDIR /app
COPY build /app/build/
ENTRYPOINT [ "node", "build" ]
