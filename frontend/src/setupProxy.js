const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.TARGET_BE || 'http://localhost:5000',
            changeOrigin: true,
        })
    );
};