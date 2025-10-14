import { Request, Response } from 'express';
import Visitor, { IVisitor } from '../models/visitor';

export const recordVisitor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: '访客名称是必需的' });
    }

    // 查找或创建访客记录
    let visitor = await Visitor.findOne({ name });
    
    if (visitor) {
      visitor.lastVisit = new Date();
      visitor.visitCount += 1;
      await visitor.save();
    } else {
      visitor = await Visitor.create({ name });
    }

    res.status(200).json(visitor);
  } catch (error) {
    console.error('记录访客错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

export const getVisitors = async (req: Request, res: Response) => {
  try {
    const visitors = await Visitor.find().sort({ lastVisit: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    console.error('获取访客列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};