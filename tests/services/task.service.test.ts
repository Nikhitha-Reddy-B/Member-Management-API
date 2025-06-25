import Task from '../../src/models/task.model';
import Member from '../../src/models/member.model';
import * as taskService from '../../src/services/task.service';
import { Op } from 'sequelize';
import { TaskAttributes, TaskFilterOptions } from '../../src/types/models';

jest.mock('../../src/models/task.model');
jest.mock('../../src/models/member.model');

const mockedTask = Task as jest.Mocked<typeof Task>;

  describe('Task Service', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });


    const taskCreationPayload = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo' as const,
      assignee: 1,
      reporter: 2,
      startDate: new Date('2023-10-27T10:00:00.000Z'),
      endDate: new Date('2023-10-28T10:00:00.000Z'),
    };


    const mockTaskInstance = {
      id: 1,
      ...taskCreationPayload,
      created_at: new Date('2023-10-27T10:00:00.000Z'),
      updated_at: new Date('2023-10-27T10:00:00.000Z'),
      deleted_at: null,
      update: jest.fn().mockResolvedValue(undefined),
    };

    test('should create a new task', async () => {
      mockedTask.create.mockResolvedValue(mockTaskInstance as unknown as Task);

      const result = await taskService.createTask(taskCreationPayload as any);

      expect(mockedTask.create).toHaveBeenCalledWith(taskCreationPayload);
      expect(result).toEqual(mockTaskInstance);
    });

    test('should return task by ID with assignee and reporter names', async () => {
      mockedTask.findOne.mockResolvedValue(mockTaskInstance as unknown as Task);

      const result = await taskService.getTaskById(1);

      expect(mockedTask.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 }, 
        include: [{ association: 'Assignee', attributes: ['name'] }, 
                  { association: 'Reporter', attributes: ['name'] }] 
        });
      expect(result).toEqual(mockTaskInstance);
    });

    test('should return null if task not found on get by ID', async () => {
      mockedTask.findOne.mockResolvedValue(null);

      const result = await taskService.getTaskById(99);

      expect(result).toBeNull();
    });


    test('should update task if exists', async () => {
      mockedTask.findOne.mockResolvedValue(mockTaskInstance as unknown as Task);

      const updates: Partial<TaskAttributes> = { status: 'done' };
      const result = await taskService.updateTask(1, updates);

      expect(mockedTask.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockTaskInstance.update).toHaveBeenCalledWith(updates);
      expect(result).toEqual(mockTaskInstance);
    });

    test('should return null if task not found on update', async () => {
      mockedTask.findOne.mockResolvedValue(null);

      const result = await taskService.updateTask(99, { status: 'done' });

      expect(result).toBeNull();
    });

    test('should delete task by ID', async () => {
      mockedTask.destroy.mockResolvedValue(1);

      const result = await taskService.deleteTask(1);

      expect(mockedTask.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });

    test('should return 0 if task not found on delete', async () => {
      mockedTask.destroy.mockResolvedValue(0);

      const result = await taskService.deleteTask(1);

      expect(mockedTask.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(0);
    });

    test('should return filtered tasks with includes', async () => {
      const filters: TaskFilterOptions = {
        status: 'todo',
        assigneeName: 'John',
        reporterName: 'Jane',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        sortBy: 'updated_at',
        order: 'asc'
      };

      mockedTask.findAll.mockResolvedValue([mockTaskInstance] as unknown as Task[]);

      const result = await taskService.getAllTasks(filters);

      expect(mockedTask.findAll).toHaveBeenCalledWith({
        where: {
          status: 'todo',
          startDate: {
            [Op.between]: [new Date(filters.startDate!), new Date(filters.endDate!)],
          },
        },
        include: [{
          model: Member,
          as: 'assigneeDetails',
          where: { name: { [Op.iLike]: `%${filters.assigneeName}%` } },
          required: true,
          attributes: ['name']
        }, {
          model: Member,
          as: 'reporterDetails',
          where: { name: { [Op.iLike]: `%${filters.reporterName}%` } },
          required: true,
          attributes: ['name']
        }],
        order: [['updated_at', 'ASC']],
      });
      expect(result).toEqual([mockTaskInstance]);
    });
  });
