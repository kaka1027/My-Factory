import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import sequelize from './config/database';
import visitorRoutes from './routes/visitor';
import articleRoutes from './routes/article';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// 连接数据库并同步模型
sequelize.authenticate()
  .then(() => {
    console.log('MySQL 数据库连接成功');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('数据库表同步完成');
  })
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