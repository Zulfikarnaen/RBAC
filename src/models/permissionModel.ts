import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
export interface Permission extends RowDataPacket {
 id: number;
 name: string;
 resource: string;
 action: string;
}
export const getAllPermissions = async (): Promise<Permission[]> => {
 const [rows] = await pool.query<Permission[]>('SELECT * FROM permissions');
 return rows;
};
export const assignPermissionToRole = async (roleId: number, permissionId:
number) => {
 const [result] = await pool.query<ResultSetHeader>(
 'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
 [roleId, permissionId]
 );
 return result;
};
