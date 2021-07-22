const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/', createProxyMiddleware({ target: 'http://www.example.org', changeOrigin: true }));
app.listen(3000);