const fs = require('fs');
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

proxy.on('error', function(e) {
    console.error('ProxyError', e);

    res.set({
        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    });
    res.writeHead(503, {'content-type': 'text/html'});
    fs.createReadStream(path.resolve(__dirname, './error.html')).pipe(res);
    res.end();
});

const proxyServer = http.createServer(function(req, res) {
    proxy.web(req, res, {
      target: target
    });
});

proxyServer.listen(process.env.PORT || 8080);