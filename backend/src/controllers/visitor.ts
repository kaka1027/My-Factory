import { Request, Response } from 'express';
import Visitor, { IVisitor } from '../models/visitor';
import { Op } from 'sequelize';

export const recordVisitor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: '访客名称是必需的' });
    }

    // 查找或创建访客记录
    const [visitor, created] = await Visitor.findOrCreate({
      where: { name },
      defaults: { name }
    });

    if (!created) {
      visitor.lastVisit = new Date();
      visitor.visitCount += 1;
      await visitor.save();
    }

    res.status(200).json(visitor);
  } catch (error) {
    console.error('记录访客错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

export const getVisitors = async (req: Request, res: Response) => {
  try {
    const visitors = await Visitor.findAll({
      order: [['lastVisit', 'DESC']]
    });
    res.status(200).json(visitors);
  } catch (error) {
    console.error('获取访客列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取访客总数
export const getVisitorCount = async (req: Request, res: Response) => {
  try {
    const count = await Visitor.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: '获取访客总数失败' });
  }
};

// 获取今日访问数
export const getTodayVisits = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Visitor.count({
      where: {
        lastVisit: {
          [Op.gte]: today
        }
      }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: '获取今日访问数失败' });
  }
};