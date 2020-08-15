const {createProxyMiddleware} = require('http-proxy-middleware');

const targetBE = 'http://localhost:5000';

if(process.env.NODE_ENV === 'production') {
    targetBE = 'https://t2-student-ride-sharing.herokuapp.com/';
}

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target:  targetBE,
            changeOrigin: true,
        })
    );
};
