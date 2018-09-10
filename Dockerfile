#########################################
# multi stage Dockerfile for creating a Romajs Docker image
# 1. set up the (node) build environment and build the bundle.js
# 2. install a NGinx server with the web application from step 1
#########################################

FROM node:8 as builder
LABEL maintainer="Peter Stadler for the TEI Council"

WORKDIR /var/romajs

COPY . .

RUN npm install 
RUN npm run build

#########################################
# step 2
#########################################

FROM nginx:alpine

# You can overwrite the variable of the oxgarage location 
# by setting a docker ENV variable
ENV OXGARAGE_LOCATION="oxgarage.euryanthe.de"

COPY --from=builder /var/romajs/dist/* /usr/share/nginx/html/
COPY docker-entrypoint.sh /usr/bin/

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]