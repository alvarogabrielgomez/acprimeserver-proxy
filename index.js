require('dotenv').config()

const packageJson = require('./package.json');

const http = require('http'),
    httpProxy = require('http-proxy');

const target = process.env.target;

const proxy = httpProxy.createProxyServer({
    followRedirects: true
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('X-Accentio-Proxy', `${packageJson.name} v${packageJson.version}`);
});

const proxyServer = http.createServer(function(req, res) {
    proxy.web(req, res, {
      target: target
    });
});

proxyServer.listen(8000);