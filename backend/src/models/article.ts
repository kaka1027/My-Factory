import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IArticle {
  id?: number;
  title: string;
  content: string;
  category: string;
  createTime?: Date;
  updateTime?: Date;
}

class Article extends Model<IArticle> implements IArticle {
  public id!: number;
  public title!: string;
  public content!: string;
  public category!: string;
  public createTime!: Date;
  public updateTime!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Article.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: '未分类'
    },
    createTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'articles',
    timestamps: true
  }
);

export default Article;
