import { Request, Response } from 'express';
import Article from '../models/article';
import { Op } from 'sequelize';
import sequelize from '../config/database';

// 获取文章总数
export const getArticleCount = async (req: Request, res: Response) => {
  try {
    const count = await Article.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: '获取文章总数失败' });
  }
};

// 获取最近文章
export const getRecentArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.findAll({
      attributes: ['id', 'title', 'createTime', 'category'],
      order: [['createTime', 'DESC']],
      limit: 5
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: '获取最近文章失败' });
  }
};

// 获取文章列表（分页）
export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const category = req.query.category as string;

    const whereClause = category ? { category } : {};
    const offset = (page - 1) * pageSize;

    const { count, rows: articles } = await Article.findAndCountAll({
      where: whereClause,
      order: [['createTime', 'DESC']],
      offset,
      limit: pageSize
    });

    res.json({
      articles,
      total: count,
      page,
      pageSize
    });
  } catch (error) {
    res.status(500).json({ error: '获取文章列表失败' });
  }
};

// 获取分类列表
export const getCategories = async (req: Request, res: Response) => {
  try {
    const results = await Article.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      raw: true
    });
    const categories = results.map((r: any) => r.category);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: '获取分类列表失败' });
  }
};
