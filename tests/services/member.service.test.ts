import path from 'path';
import fs from 'fs';
import Member from '../../src/models/member.model';
import * as memberService from '../../src/services/member.service';
import { compressImage } from '../../src/utils/compressImage';
import { Op } from 'sequelize';
import { Member as MemberType } from '../../src/models';
import { Express } from 'express';

jest.mock('fs');
jest.mock('../../src/models/member.model');
jest.mock('../../src/utils/compressImage');

const mockedMember = Member as jest.Mocked<typeof Member>;
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedCompressImage = compressImage as jest.Mock;

describe('Member service', () => {
    beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1751032354331);
  });
  
    afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a member with full data', async () => {
    const mockMember: MemberType = { id: 1, name: 'Nikhitha', email: 'nik@example.com' } as MemberType;
    mockedMember.create.mockResolvedValue(mockMember);

    const result = await memberService.createMember(
      'Nikhitha', 'nik@example.com', 'pass123', 'niki', '1234567890', true, 'pic.jpg'
    );

    expect(mockedMember.create).toHaveBeenCalledWith({
      name: 'Nikhitha',
      email: 'nik@example.com',
      password: 'pass123',
      username: 'niki',
      phone: '1234567890',
      isActive: true,
      profilePicture: 'pic.jpg'
    });
    expect(result).toEqual(mockMember);
  });

  test('should handle profile picture upload', async () => {
    const mockFile: Express.Multer.File = {
      path: path.join(__dirname, '../../uploads/1751032354331-test.jpg'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      destination: '',
      filename: '',
      fieldname: '',
      size: 1234,
      stream: null as any,
      buffer: Buffer.from(''),
      encoding: '7bit'
    };

    const mockMember: MemberType = {
      id: 1,
      profilePicture: 'old.jpg',
      update: jest.fn()
    } as unknown as MemberType;

    mockedMember.findOne.mockResolvedValue(mockMember);
    mockedCompressImage.mockResolvedValue('uploads/test-compressed.jpg');
    mockedFs.existsSync.mockReturnValue(true);

    const result = await memberService.handleProfilePictureUpload(1, mockFile);

    expect(mockedCompressImage).toHaveBeenCalledWith(mockFile.path);
    expect(mockedFs.unlinkSync).toHaveBeenCalledWith(
      path.join(__dirname, '../../uploads', 'old.jpg')
    );
    expect(mockMember.update).toHaveBeenCalledWith({ profilePicture: 'test-compressed.jpg' });
    expect(result).toBe('test-compressed.jpg');
  });

  test('should return a member by ID', async () => {
    const mockMember: MemberType = { id: 1, name: 'Nikhitha' } as MemberType;
    mockedMember.findOne.mockResolvedValue(mockMember);

    const result = await memberService.getMemberById(1);
    expect(result).toEqual(mockMember);
  });

  test('should return null if member not found', async () => {
    mockedMember.findOne.mockResolvedValue(null);
    const result = await memberService.getMemberById(999);
    expect(result).toBeNull();
  });

  test('should update a member', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(true);
    const mockMember: MemberType = {
      id: 1,
      name: 'Old',
      email: 'old@mail.com',
      update: mockUpdate
    } as unknown as MemberType;

    mockedMember.findOne.mockResolvedValue(mockMember);

    const result = await memberService.updateMember(
      1, 'New', 'new@mail.com', 'newuser', '9876543210', false, 'newpic.jpg'
    );

    expect(mockUpdate).toHaveBeenCalledWith({
      name: 'New',
      email: 'new@mail.com',
      username: 'newuser',
      phone: '9876543210',
      isActive: false,
      profilePicture: 'newpic.jpg'
    });
    expect(result).toEqual(mockMember);
  });

  test('should return null if updating non-existent member', async () => {
    mockedMember.findOne.mockResolvedValue(null);
    const result = await memberService.updateMember(
      1000, 'X', 'x@mail.com', 'xuser', '9999999999', true, 'x.jpg'
    );
    expect(result).toBeNull();
  });

  test('should delete a member and return 1', async () => {
    mockedMember.destroy.mockResolvedValue(1);
    const result = await memberService.deleteMember(1);
    expect(mockedMember.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(1);
  });

  test('should return 0 if no member to delete', async () => {
    mockedMember.destroy.mockResolvedValue(0);
    const result = await memberService.deleteMember(999);
    expect(result).toBe(0);
  });

  test('should search members by filters', async () => {
    const filters = {
      username: 'nik',
      email: 'nik@example.com',
      phone: '123',
      isActive: 'true',
      sort: 'desc'
    };
    const mockResults: MemberType[] = [{ id: 1, name: 'Nikhitha' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should search members by username only', async () => {
    const filters = { username: 'nik' };
    const mockResults: MemberType[] = [{ id: 1, name: 'Nik' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should search members by email only', async () => {
    const filters = { email: 'test@example.com' };
    const mockResults: MemberType[] = [{ id: 2, name: 'Test' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should search members by isActive only', async () => {
    const filters = { isActive: 'false' };
    const mockResults: MemberType[] = [{ id: 3, name: 'Alice' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should search members by phone only', async () => {
    const filters = { phone: '987' };
    const mockResults: MemberType[] = [{ id: 3, name: 'Alice' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should return all members when no filters are provided', async () => {
    const filters = {};
    const mockResults: MemberType[] = [{ id: 5, name: 'John' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should search members by phone and isActive', async () => {
    const filters = { phone: '987', isActive: 'true' };
    const mockResults: MemberType[] = [{ id: 3, name: 'Alice' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should search members by username and email', async () => {
    const filters = { username: 'nik', email: 'nik@example.com' };
    const mockResults: MemberType[] = [{ id: 3, name: 'Alice' } as MemberType];
    mockedMember.findAll.mockResolvedValue(mockResults);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(mockResults);
  });

  test('should return members sorted by updatedAt DESC by default', async () => {
    const filters = {};
    const mockResults: MemberType[] = [
      { id: 1, name: 'member1', updatedAt: new Date('2025-01-01') } as MemberType,
      { id: 2, name: 'member2', updatedAt: new Date('2025-05-01') } as MemberType,
      { id: 3, name: 'member3', updatedAt: new Date('2025-03-01') } as MemberType
    ];

    const expectedSorted = [...mockResults].sort(
      (a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
    );

    mockedMember.findAll.mockResolvedValue(expectedSorted);

    const result = await memberService.searchMembers(filters);
    expect(result).toEqual(expectedSorted);
  });
});
