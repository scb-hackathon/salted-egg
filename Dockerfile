ARG APP_PATH=/opt/app/

FROM node:12.4-alpine AS build
WORKDIR $APP_PATH
COPY package.json ./
COPY yarn.lock ./
COPY src .
RUN yarn
RUN yarn build

FROM node:12.4-alpine
ARG APP_PATH
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=build $APP_PATH/package.json .
COPY --from=build $APP_PATH/yarn.lock .
COPY --from=build $APP_PATH/build/main.js .
RUN yarn --production
CMD ["node main.js"]
