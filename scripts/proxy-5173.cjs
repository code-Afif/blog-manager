const http = require('http');

const targetPort = 3000;
const listenPort = 5173;

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502);
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxyReq, { end: true });
});

server.on('upgrade', (req, socket, head) => {
  const proxyReq = http.request({
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  });

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write(
      `HTTP/${proxyRes.httpVersion} ${proxyRes.statusCode} ${proxyRes.statusMessage}\r\n` +
      Object.entries(proxyRes.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n') +
      '\r\n\r\n'
    );
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', () => {
    socket.destroy();
  });

  proxyReq.end();
});

server.listen(listenPort, () => {
  console.log(`Port 5173 proxying to ${targetPort}`);
});
