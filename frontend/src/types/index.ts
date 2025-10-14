export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  createTime: string;
  updateTime: string;
}

export interface Category {
  name: string;
  count: number;
}

export interface Visitor {
  id: string;
  name: string;
  timestamp: string;
  lastVisit: string;
  visitCount: number;
}