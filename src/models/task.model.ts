import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Member from './member.model';

export interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  assignee: number;
  reporter?: number;
  startDate: Date;
  endDate: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: 'todo' | 'inprogress' | 'done';
  public assignee!: number;
  public reporter?: number;
  public startDate!: Date;
  public endDate!: Date;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isWithinWordLimit(value: string) {
          const wordCount = value.trim().split(/\s+/).length;
          if (wordCount > 300) {
            throw new Error('Description must be less than 300 words.');
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM('todo', 'inprogress', 'done'),
      allowNull: false,
      defaultValue: 'todo',
    },
    assignee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Member,
        key: 'id',
      },
    },
    reporter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Member,
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    modelName: 'Task',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  }
);

export default Task;
