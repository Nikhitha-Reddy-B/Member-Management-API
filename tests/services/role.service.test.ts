import Role from '../../src/models/role.model';
import * as roleService from '../../src/services/role.service';

jest.mock('../../src/models/role.model');
const mockedRole = Role as jest.Mocked<typeof Role>;

describe('Role Service', () =>{
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createRole should create a new role', async () => {
        mockedRole.create.mockResolvedValue({ id: 1, name: 'Admin', description: 'Admin role'} as any);

        const result = await roleService.createRole('Admin', 'Admin role');

        expect(mockedRole.create).toHaveBeenCalledWith({name: 'Admin', description: 'Admin role'});
        expect(result.name).toBe('Admin');
    });

    test('getAllRoles should return all roles', async () => {
        mockedRole.findAll.mockResolvedValue([{id: 1, name: 'Admin'}] as any);

        const result = await roleService.getAllRoles();

        expect(mockedRole.findAll).toHaveBeenCalled();
        expect(result.length).toBe(1);
    });

    test('getRoleById should return a role with given ID', async () => {
        mockedRole.findOne.mockResolvedValue({ id: 2, name: 'User' } as any);

        const result = await roleService.getRoleById(2);

        expect(mockedRole.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
        expect(result?.name).toBe('User');
    });

    test('getRoleById should return null if role not found', async () => {
        mockedRole.findOne.mockResolvedValue(null);

        const result = await roleService.getRoleById(99);

        expect(mockedRole.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
        expect(result).toBeNull();
    });

    test('updateRole should update and return the role', async () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);
        const mockRole = { id: 3, name: 'Old', description: 'Old desc', update: mockUpdate };
        mockedRole.findOne.mockResolvedValue(mockRole as any);

        const result = await roleService.updateRole(3, 'New', 'New desc');

        expect(mockedRole.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
        expect(mockUpdate).toHaveBeenCalledWith({ name: 'New', description: 'New desc' });
        expect(result).toBe(mockRole);
    });

    test('updateRole should return null if role not found', async () => {
        mockedRole.findOne.mockResolvedValue(null);

        const result = await roleService.updateRole(999, 'Guest', 'Guest role');

        expect(mockedRole.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
        expect(result).toBeNull();
    });

    test('deleteRole should delete the role', async () => {
        mockedRole.destroy.mockResolvedValue(1);

        const result = await roleService.deleteRole(4);

        expect(mockedRole.destroy).toHaveBeenCalledWith({ where: { id: 4 } });
        expect(result).toBe(1);
    });

    test('deleteRole should return 0 if no role was deleted', async () => {
        mockedRole.destroy.mockResolvedValue(0);

        const result = await roleService.deleteRole(123);

        expect(mockedRole.destroy).toHaveBeenCalledWith({ where: { id: 123 } });
        expect(result).toBe(0);
    });

});