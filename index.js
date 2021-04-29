const fs = require('fs');
const path = require('path');
require('dotenv').config()

const packageJson = require('./package.json');

const http = require('http'),
    httpProxy = require('http-proxy');

const target = process.env.target;

const proxy = httpProxy.createProxyServer({
    followRedirects: true
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    // proxyReq.setHeader('X-Accentio-Proxy', `${packageJson.name} v${packageJson.version}`);
    // proxyReq.setHeader('Cache-Control', 'max-age=86400, public');
});

proxy.on('error', function(e, req, res) {
    console.error('ProxyError', e);
    res.writeHead(503, {'content-type': 'text/html'});
    fs.createReadStream(path.resolve(__dirname, './error.html')).pipe(res);
});

const proxyServer = http.createServer(function(req, res) {
    res.setHeader('X-Accentio-Proxy', `${packageJson.name} v${packageJson.version}`);
    // res.setHeader('Cache-Control', 'max-age=86400, public');
    proxy.web(req, res, {
      target: target
    });
});

proxyServer.listen(process.env.PORT || 8081);