const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const config = require('./config');
const packageJson = require('./package.json');
const { reverseDNSLookup, searchProxy} = require('./utils');
const debug = require('debug')('acprimeserverproxy:boot');

const serverConfig = config.get('server');
const proxyList = config.get('proxys');

const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
    followRedirects: true
});

// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//     proxyReq.setHeader('X-Accentio-Proxy', `${packageJson.name} v${packageJson.version}`);
//     proxyReq.setHeader('X-Accentio-Proxy-App', 'Test');
//     // proxyReq.setHeader('Cache-Control', 'max-age=86400, public');
// });

proxy.on('error', function(e, req, res) {
    console.error('ProxyError', e);
    res.writeHead(503, {
        'content-type': 'text/html',
        'X-Accentio-Proxy': `${serverConfig.name} v${packageJson.version}`
    });
    fs.createReadStream(path.resolve(__dirname, './error.html')).pipe(res);
});

const proxyServer = http.createServer(async function(req, res) {
    const hostRequest = req.headers['host'];
    // const hostRequest = squoosh.accentio.app;
    const addressRequest = req.socket.remoteAddress;
    const target = await searchProxy(proxyList, hostRequest);

    if (target) {
        res.setHeader('X-Accentio-Proxy', `${serverConfig.name} v${packageJson.version}`);
        res.setHeader('X-Accentio-Proxy-App', target.name);

        return proxy.web(req, res, {
            target: target.url.href
        });
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'X-Accentio-Proxy': `${serverConfig.name} v${packageJson.version}`,
            'X-Robots-Tag': 'noindex'
        });
        fs.createReadStream(path.resolve(__dirname, './404.html')).pipe(res);
    }
    


    // reverseDNSLookup('8.8.8.8')
    // .then((response) => {
    //     if(!response.includes(hostRequest) || !response.includes(addressRequest)) {
    //         console.error("SPOOFING!");
    //         res.writeHead(302, {'content-type': 'text/html'});
    //         fs.createReadStream(path.resolve(__dirname, './spoofing.html')).pipe(res);
    //     } else {
    //         proxy.web(req, res, {
    //           target: proxyList[0].target
    //         });
    //     }
    // });

});

const port = process.env.PORT || serverConfig.port;

proxyServer.listen(port);
console.log('port', port);
