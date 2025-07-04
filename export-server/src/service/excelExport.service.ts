import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import { Member, Task } from '../../../src/models';

const exportFolder = path.resolve(__dirname, '../../exports');
if (!fs.existsSync(exportFolder)) {
  fs.mkdirSync(exportFolder);
}

export const generateExcelFile = async (type: string): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Export');
  let fileName = '';

  if (type === 'members') {
    const members = await Member.findAll();

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Is Active', key: 'isActive', width: 12 },
      { header: 'Phone', key: 'phone', width: 15 },
    ];

    members.forEach((member) => {
      worksheet.addRow({
        id: member.id,
        name: member.name,
        username: member.username,
        email: member.email,
        isActive: member.isActive,
        phone: member.phone,
      });
    });

    fileName = `members_export_${Date.now()}.xlsx`;
  } else if (type === 'tasks') {
    const tasks = await Task.findAll({
      include: [
        { model: Member, as: 'assigneeDetails' },
        { model: Member, as: 'reporterDetails' },
      ],
    }) as (Task & {
      assigneeDetails?: Member;
      reporterDetails?: Member;
    })[];

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 20 },
      { header: 'End Date', key: 'endDate', width: 20 },
      { header: 'Assignee', key: 'assignee', width: 20 },
      { header: 'Reporter', key: 'reporter', width: 20 },
    ];

    tasks.forEach((task) => {
      worksheet.addRow({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate,
        assignee: task.assigneeDetails ? task.assigneeDetails.name : '',
        reporter: task.reporterDetails ? task.reporterDetails.name : '',
      });
    });

    fileName = `tasks_export_${Date.now()}.xlsx`;
  } else if (type === 'member_tasks') {
    const members = await Member.findAll({
      include: [
        {
          model: Task,
          as: 'assignedTasks',
          include: [{ model: Member, as: 'reporterDetails' }],
        },
      ],
    }) as (Member & { assignedTasks: (Task & { reporterDetails: Member })[] })[];

    const membersWithTasks = members.filter((m) => m.assignedTasks && m.assignedTasks.length > 0);

    worksheet.columns = [
      { header: 'Member ID', key: 'memberId', width: 12 },
      { header: 'Member Name', key: 'name', width: 20 },
      { header: 'Task Title', key: 'taskTitle', width: 25 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 20 },
      { header: 'End Date', key: 'endDate', width: 20 },
      { header: 'Reporter Name', key: 'reporter', width: 20 },
    ];

    membersWithTasks.forEach((member) => {
      member.assignedTasks.forEach((task) => {
        worksheet.addRow({
          memberId: member.id,
          name: member.name,
          taskTitle: task.title,
          description: task.description,
          status: task.status,
          startDate: task.startDate,
          endDate: task.endDate,
          reporter: task.reporterDetails ? task.reporterDetails.name : '',
        });
      });
    });

    fileName = `members_tasks_export_${Date.now()}.xlsx`;
  } else {
    throw new Error('Invalid type. Use "members", "tasks", or "member_tasks".');
  }

  const filePath = path.join(exportFolder, fileName);
  await workbook.xlsx.writeFile(filePath);

  return fileName;
};
