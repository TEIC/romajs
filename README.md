# RomaJS - [romabeta.tei-c.org](https://romabeta.tei-c.org)

[![Build Status](https://travis-ci.com/TEIC/romajs.svg?branch=dev)](https://travis-ci.com/TEIC/romajs)
[![Docker Build Status](https://img.shields.io/docker/build/teic/romajs.svg)](https://hub.docker.com/r/teic/romajs/)

RomaJS is a web app for creating and editing ODD documents to customize and generate schemata for the [Text Encoding Initiative](http://www.tei-c.org/).

This web app is written in React/Redux and is designed to be easily compiled and deployed as a static site. Some key transformations are handled online via the API provide by [OxGarage](https://wiki.tei-c.org/index.php/OxGarage), a TEI maintained online service. TEI data comes from the [TEI Vault](www.tei-c.org/Vault/).

## How to deploy

Download the latest build from the [release page](https://github.com/TEIC/romajs/releases). Serve the static site from a simple server. You will need to set up a rewrite to index.html to make sure URL routes will work. For example in Apache 2:

```
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.html [L,QSA]
```

You can also deploy it via [Docker](https://hub.docker.com/r/teic/romajs).

## How to develop

Make sure node.js is installed then:

```
$ npm install --legacy-peer-deps
```

### Important notice to new developers / maintainers

RomaJS was largely developed between 2017-2018 using technology available at the time. While we have little concerns about the longevity of the compiled tool, over time there will be issues with using outdated libraries when developing new features or fixing bugs. We will try to fix ostensibly broken dependencies, but otherwise will stick to the versions that worked when this tool was developed.

In particular, adding or fixing HTML components can be tricky: we used an early version of the Material Components Web library (v 0.43.0). The closest documentation is currently [available here](https://material-components.github.io/material-components-web-catalog/) ([Wayback machine link](https://web.archive.org/web/20221224181054/https://material-components.github.io/material-components-web-catalog/)).

### Test

```
$ npm test
```

### Serve locally for development
```
$ npm start
```

### Build static assets
```
$ npm run build
```

### Change URL to OxGarage service and TEI static data (TEI Vault)

Edit `src/utils/urls.js` and rebuild.
Alternatively, these variables can also be overridden from the Docker configuration.
