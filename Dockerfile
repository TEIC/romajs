#########################################
# multi stage Dockerfile for creating a Romajs Docker image
# 1. set up the (node) build environment and build the bundle.js
# 2. install a NGinx server with the web application from step 1
#########################################

FROM node:12 as builder
LABEL maintainer="Raffaele Viglianti and Peter Stadler for the TEI Council"

WORKDIR /var/romajs

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build

#########################################
# step 2
#########################################

FROM nginx:alpine

# You can overwrite the variable of the oxgarage protocol and location 
# by setting docker ENV variables
ENV OXGARAGE_PROTOCOL="https"
ENV OXGARAGE_LOCATION="oxgarage.tei-c.org"

# You can overwrite the variable of TEI data sources protocol and location
# by setting docker ENV variables
ENV DATASOURCES_PROTOCOL="https"
ENV DATASOURCES_LOCATION="tei-c.org/Vault/P5/current/xml/tei/odd"

# You can overwrite the variable of TEI customization presets protocol and location
# by setting docker ENV variables
ENV PRESETS_PROTOCOL="https"
ENV PRESETS_LOCATION="tei-c.org/Vault/P5/current/xml/tei/Exemplars"

COPY --from=builder /var/romajs/dist/* /usr/share/nginx/html/
COPY docker-entrypoint.sh /usr/bin/
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
