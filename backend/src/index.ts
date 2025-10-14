import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import visitorRoutes from './routes/visitor';
import articleRoutes from './routes/article';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaka-website')
  .then(() => console.log('数据库连接成功'))
  .catch((err) => console.error('数据库连接失败:', err));

// 路由
app.use('/api/visitors', visitorRoutes);
app.use('/api/articles', articleRoutes);

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('服务器错误');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});