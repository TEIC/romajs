#!/bin/sh

# overwrite the OxGarage protocol variable
sed -i -e "s+exports.OXGARAGE_PROTOCOL\s*=\s*['\'].*['\']\s*;+exports.OXGARAGE_PROTOCOL = '${OXGARAGE_PROTOCOL}';+" /usr/share/nginx/html/romajs_*

# overwrite the OxGarage location variable
sed -i -e "s+exports.OXGARAGE_LOCATION\s*=\s*['\"].*['\"]\s*;+exports.OXGARAGE_LOCATION = '${OXGARAGE_LOCATION}';+" /usr/share/nginx/html/romajs_*

# overwrite the TEI data source protocol variable
sed -i -e "s+exports.DATASOURCES_PROTOCOL\s*=\s*['\"].*['\"]\s*;+exports.DATASOURCES_PROTOCOL = '${DATASOURCES_PROTOCOL}';+" /usr/share/nginx/html/romajs_*

# overwrite the TEI data source location variable
sed -i -e "s+exports.DATASOURCES_LOCATION\s*=\s*['\"].*['\"]\s*;+exports.DATASOURCES_LOCATION = '${DATASOURCES_LOCATION}';+" /usr/share/nginx/html/romajs_*

# overwrite the TEI presets protocol variable
sed -i -e "s+exports.PRESETS_PROTOCOL\s*=\s*['\"].*['\"]\s*;+exports.PRESETS_PROTOCOL = '${PRESETS_PROTOCOL}';+" /usr/share/nginx/html/romajs_*

# overwrite the TEI presets location variable
sed -i -e "s+exports.PRESETS_LOCATION\s*=\s*['\"].*['\"]\s*;+exports.PRESETS_LOCATION = '${PRESETS_LOCATION}';+" /usr/share/nginx/html/romajs_*

# call the command given in the (original) Dockerfile as CMD
exec "$@"
