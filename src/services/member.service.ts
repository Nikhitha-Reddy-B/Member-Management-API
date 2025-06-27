import Member from '../models/member.model';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { compressImage } from '../utils/compressImage';
import { ApiError } from '../utils/ApiError';

export const createMember = async (
  name: string,
  email: string,
  password: string,
  username: string,
  phone: string,
  isActive: boolean = true,
  profilePicture?: string
) => {
  return await Member.create({ name, email, password, username, phone, isActive, profilePicture });
};

export const getMemberById = async (id: number) => {
  return await Member.findOne({ where: { id } });
};

export const updateMember = async (
  id: number,
  name: string,
  email: string,
  username: string,
  phone: string,
  isActive: boolean,
  profilePicture: string
) => {
  const member = await Member.findOne({ where: { id } });
  if (!member) return null;

  await member.update({ name, email, username, phone, isActive, profilePicture });
  return member;
};

export const deleteMember = async (id: number) => {
  return await Member.destroy({ where: { id } });
};

export const searchMembers = async (filters: any) => {
  const whereClause: any = {};

  if (filters.username) {
    whereClause.username = { [Op.iLike]: `%${filters.username}%` };
  }

  if (filters.email) {
    whereClause.email = { [Op.iLike]: `%${filters.email}%` };
  }

  if (filters.phone) {
    whereClause.phone = { [Op.iLike]: `${filters.phone}%` };
  }

  if (filters.isActive !== undefined) {
    whereClause.isActive = filters.isActive === 'true';
  }

  const sortOrder = filters.sort?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  return Member.findAll({
    where: whereClause,
    order: [['updatedAt', sortOrder]],
  });
};

export const handleProfilePictureUpload = async(
  memberId: number,
  file: Express.Multer.File | undefined
): Promise<string> => {
   const member = await Member.findOne({ where: {id: memberId} });
   if(!member) {
     throw new ApiError('Member not found', 404);
   }

   if(!file) {
    throw new ApiError('No file uploaded', 400);
   }

   const uploadDir = path.join(__dirname, '../../uploads');
   if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
   }

   const originalFileName = `${Date.now()}-${file.originalname}`;
   const filePath = path.join(uploadDir, originalFileName);
   fs.writeFileSync(filePath, file.buffer);

   const compressedPath = await compressImage(filePath);

   if(member.profilePicture){
    const oldFilePath = path.join(uploadDir, path.basename(member.profilePicture));
    if(fs.existsSync(oldFilePath)){
      fs.unlinkSync(oldFilePath);
    }
   }

   const filename = path.basename(compressedPath);
   member.profilePicture = filename;
   await member.save();

   return filename;
};