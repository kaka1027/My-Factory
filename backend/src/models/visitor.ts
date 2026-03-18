import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface IVisitor {
  id?: number;
  name: string;
  timestamp?: Date;
  lastVisit?: Date;
  visitCount?: number;
}

class Visitor extends Model<IVisitor> implements IVisitor {
  public id!: number;
  public name!: string;
  public timestamp!: Date;
  public lastVisit!: Date;
  public visitCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Visitor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    lastVisit: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    visitCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  },
  {
    sequelize,
    tableName: 'visitors',
    timestamps: true
  }
);

export default Visitor;