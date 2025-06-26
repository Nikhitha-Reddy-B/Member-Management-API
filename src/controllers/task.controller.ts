import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { TaskFilterOptions } from '../types/models'; 
import { ApiError } from '../utils/ApiError';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const filters = req.query as TaskFilterOptions;
    const tasks = await taskService.getAllTasks(filters);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const task = await taskService.getTaskById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const updatedTask = await taskService.updateTask(id, req.body);

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const deleted = await taskService.deleteTask(id);
    if (deleted === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
