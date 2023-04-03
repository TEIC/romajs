#!/bin/sh

# overwrite the TEIGarage protocol variable
sed -i -e "s+exports.TEIGARAGE_PROTOCOL\s*=\s*['\'].*['\']\s*;+exports.TEIGARAGE_PROTOCOL = '${TEIGARAGE_PROTOCOL}';+" /usr/share/nginx/html/romajs_*

# overwrite the TEIGarage location variable
sed -i -e "s+exports.TEIGARAGE_LOCATION\s*=\s*['\"].*['\"]\s*;+exports.TEIGARAGE_LOCATION = '${TEIGARAGE_LOCATION}';+" /usr/share/nginx/html/romajs_*

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
