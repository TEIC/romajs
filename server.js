require('babel-register')()
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')
const distDir = path.join(__dirname, 'dist')
const htmlFile = path.join(distDir, 'index.html')

const isDevelopment = process.env.NODE_ENV !== 'production'
const express = require('express')
const app = express()
const port = 3000

app.use('/fakeData', express.static('test/fakeData'))

if (isDevelopment) {
  config.devtool = 'inline-source-map'
  config.entry.push(`webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr&reload=true`)
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
  app.use(webpackHotMiddleware(compiler))
  app.get('*', (req, res) => {
    res.write(compiler.outputFileSystem.readFileSync(htmlFile))
    res.end()
  })
} else {
  app.use(express.static(distDir))
  app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')))
}


app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
