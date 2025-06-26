import Task from '../models/task.model';
import { TaskAttributes } from '../types/models';
import Member from '../models/member.model';
import { Op, WhereOptions } from 'sequelize';
import { TaskFilterOptions } from '../types/models';
import { ApiError } from '../utils/ApiError';

export const createTask = async (data: TaskAttributes) => {
  return await Task.create(data);
};

export const getTaskById = async (id: number) => {
  return await Task.findOne({
    where: { id },
    include: [
      {
        association: 'Assignee',
        attributes: ['name']
      },
      {
        association: 'Reporter',
        attributes: ['name']
      }
    ]
  });
};

export const updateTask = async (
  id: number,
  updates: Partial<TaskAttributes>
) => {
  const task = await Task.findOne({ where: { id } });
  if (!task) return null;

  if (updates.assignee !== undefined) {
    const assigneeExists = await Member.findOne({ where: { id: updates.assignee } });
    if (!assigneeExists) {
      throw new ApiError(`Assignee with ID ${updates.assignee} not found`, 404);
    }
  }

  if (updates.reporter !== undefined) {
    const reporterExists = await Member.findOne({ where: { id: updates.reporter } });
    if (!reporterExists) {
      throw new ApiError(`Reporter with ID ${updates.reporter} not found`, 404);
    }
  }

  await task.update(updates);
  return task;
};

export const deleteTask = async (id: number) => {
  return await Task.destroy({ where: { id } });
};

export const getAllTasks = async (filters: TaskFilterOptions) => {
  const whereClause: WhereOptions<TaskAttributes> = {};

  if (filters.status) {
    whereClause.status = filters.status as TaskAttributes['status'];
  }

  if (filters.startDate && filters.endDate) {
    whereClause.startDate = {
      [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)],
    };
  } else if (filters.startDate) {
    whereClause.startDate = {
      [Op.gte]: new Date(filters.startDate),
    };
  } else if (filters.endDate) {
    whereClause.startDate = {
      [Op.lte]: new Date(filters.endDate),
    };
  }

  const includes = [];

  if (filters.assigneeName) {
    includes.push({
      model: Member,
      as: 'assigneeDetails',
      where: {
        name: { [Op.iLike]: `%${filters.assigneeName}%` },
      },
      required: true,
      attributes: ['name'],
    });
  } else {
    includes.push({
      model: Member,
      as: 'assigneeDetails',
      attributes: ['name'],
    });
  }

  if (filters.reporterName) {
    includes.push({
      model: Member,
      as: 'reporterDetails',
      where: {
        name: { [Op.iLike]: `%${filters.reporterName}%` },
      },
      required: true,
      attributes: ['name'],
    });
  } else {
    includes.push({
      model: Member,
      as: 'reporterDetails',
      attributes: ['name'],
    });
  }

  const sortOrder = filters.order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const sortField = filters.sortBy || 'updated_at';

  return Task.findAll({
    where: whereClause,
    include: includes,
    order: [[sortField, sortOrder]],
  });
};