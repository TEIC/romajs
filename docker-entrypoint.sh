#!/bin/sh

# overwrite the OxGarage location variable
sed -i -e "s+var location\s*=\s*['\"].*['\"]\s*;+var location = '${OXGARAGE_LOCATION}';+" /usr/share/nginx/html/bundle.js

# call the command given in the (original) Dockerfile as CMD
exec "$@"
