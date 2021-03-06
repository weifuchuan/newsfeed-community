const proxy = require('http-proxy-middleware');

module.exports = proxy('/api/', {
  target: "http://localhost:80",
  changeOrigin: true,
  ws: true,
  pathRewrite: function (path, req) {
    return path.substring(4); 
  }
});