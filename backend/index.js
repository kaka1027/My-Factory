const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// 允许跨域请求
app.use(cors());

// 简单的健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── 启动服务器 ────────────────────────────────────────────────────

const PORT = 1027;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
