import Member from '../../src/models/member.model';
import * as memberService from '../../src/services/member.service';
import { Op } from 'sequelize';

jest.mock('../../src/models/member.model');
const mockedMember = Member as jest.Mocked<typeof Member>;

describe('Member service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a member with full data', async () => {
        const mockMember = {id: 1, name: 'Nikhitha', email: 'nik@example.com'};
        mockedMember.create.mockResolvedValue(mockMember as any);

        const result  = await memberService.createMember(
            'Nikhitha', 'nik@example.com', 'pass123',
            'niki', '1234567890', true, 'pic.jpg'
        );

        expect(mockedMember.create).toHaveBeenCalledWith({
            name: 'Nikhitha',
            email: 'nik@example.com',
            password: 'pass123',
            username: 'niki',
            phone: '1234567890',
            isActive: true,
            profilePicture: 'pic.jpg',
        });
        expect(result).toEqual(mockMember);
    });

    test('should return a member by ID', async() => {
        const mockMember = {id: 1, name: 'Nikhitha'};
        mockedMember.findOne.mockResolvedValue(mockMember as any);
        
        const result = await memberService.getMemberById(1);

        expect(mockedMember.findOne).toHaveBeenCalledWith({where: {id: 1}});
        expect(result).toEqual(mockMember);
    });

    test('should return null if member not found', async() => {
        mockedMember.findOne.mockResolvedValue(null);
        const result = await memberService.getMemberById(999);
        expect(result).toBeNull();
    });

    test('should update a member', async () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);
        const mockMember = {
            id: 1,
            name: 'Old',
            email: 'old@mail.com',
            update: mockUpdate,
        };
        mockedMember.findOne.mockResolvedValue(mockMember as any);
        const result = await memberService.updateMember(
            1, 'New', 'new@mail.com', 'newuser', '9876543210', false, 'newpic.jpg'
        );
        
        expect(mockedMember.findOne).toHaveBeenCalledWith( { where: { id: 1}});
        expect(mockUpdate).toHaveBeenCalledWith({
            name: 'New',
            email: 'new@mail.com',
            username: 'newuser',
            phone: '9876543210',
            isActive: false,
            profilePicture: 'newpic.jpg',
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
        expect(mockedMember.destroy).toHaveBeenCalledWith({where: {id: 1}});
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
            sort: 'desc',
        };

        const mockResults = [{id: 1, name: 'Nikhitha'}];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);
        
        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {
                username: { [Op.iLike]: '%nik%' },
                email: { [Op.iLike]: '%nik@example.com%'},
                phone: { [Op.iLike]: '123%'},
                isActive: true,
            },
            order: [['updatedAt', 'DESC']],
        });

        expect(result).toEqual(mockResults);
    });

    test('should search members by username only', async () => {
        const filters = { username: 'nik' };
        const mockResults = [{ id: 1, name: 'Nik' }];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {
                username: { [Op.iLike]: '%nik%' }
         },
         order: [['updatedAt', 'DESC']],
        });

        expect(result).toEqual(mockResults);
    });

    test('should search members by email only', async () => {
        const filters = { email: 'test@example.com' };
        const mockResults = [{ id: 2, name: 'Test' }];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {
                email: { [Op.iLike]: '%test@example.com%' }
        },
        order: [['updatedAt', 'DESC']],
    });

        expect(result).toEqual(mockResults);
    });

    test('should search members by isActive only', async () => {
        const filters = { isActive: 'false' };
        const mockResults = [{ id: 3, name: 'Alice' }];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {
                isActive: false
            },
            order: [['updatedAt', 'DESC']],
        });
        expect(result).toEqual(mockResults);
    });

    test('should search members by phone only', async () => {
        const filters = { phone: '987' };
        const mockResults = [{ id: 3, name: 'Alice' }];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {
                phone: { [Op.iLike]: '987%'}
            },
            order: [['updatedAt', 'DESC']],
        });
        expect(result).toEqual(mockResults);
    });

    test('should return all members when no filters are provided', async () => {
        const filters = {};
        const mockResults = [{ id: 5, name: 'John' }];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {},
            order: [['updatedAt', 'DESC']],
        });

        expect(result).toEqual(mockResults);
    });

    test('should search members by phone and isActive', async () => {
        const filters = { phone: '987', isActive: 'true' };
        const mockResults = [{ id: 3, name: 'Alice' }];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {
                phone: { [Op.iLike]: '987%'},
                isActive: true
            },
            order: [['updatedAt', 'DESC']],
        });
        expect(result).toEqual(mockResults);
    });

    test('should search members by username and email', async () => {
        const filters = { username: 'nik', email: 'nik@example.com' };
        const mockResults = [{ id: 3, name: 'Alice' }];
        mockedMember.findAll.mockResolvedValue(mockResults as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {
                username: { [Op.iLike]: '%nik%'},
                email: { [Op.iLike]: '%nik@example.com%'}
            },
            order: [['updatedAt', 'DESC']],
        });
        expect(result).toEqual(mockResults);
    });

    test('should return members sorted by updatedAt DESC by default', async () => {
        const filters = {};

        const mockResults = [
            { id: 1, name: 'member1', updatedAt: new Date('2025-01-01') },
            { id: 2, name: 'member2', updatedAt: new Date('2025-05-01') },
            { id: 3, name: 'member3', updatedAt: new Date('2025-03-01') },
        ];

        const expectedSorted = [...mockResults].sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );

        mockedMember.findAll.mockResolvedValue(expectedSorted as any);

        const result = await memberService.searchMembers(filters);

        expect(mockedMember.findAll).toHaveBeenCalledWith({
            where: {},
            order: [['updatedAt', 'DESC']],
        });
        expect(result).toEqual(expectedSorted);
    })

});