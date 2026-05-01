import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
interface AuthRequest extends Request {
 user?: { id: number; role_id: number };
}
export const checkPermission = (requiredPermission: string) => {
 return async (req: AuthRequest, res: Response, next: NextFunction) => {
 const userId = req.user?.id;
 if (!userId) return res.status(401).send('Unauthorized');
 const [rows] = await pool.query(`
 SELECT p.name FROM users u
 JOIN roles r ON u.role_id = r.id
 JOIN role_permissions rp ON r.id = rp.role_id
 JOIN permissions p ON rp.permission_id = p.id
 WHERE u.id = ?
 `, [userId]);

 console.log("RAW ROWS:", rows);
 
 const permissions = (rows as any[]).map(row => row.name);
 console.log("PERMISSIONS:", permissions);
console.log("REQUIRED:", requiredPermission);
 if (permissions.includes(requiredPermission)) {
 next();
 } else {
 res.status(403).send('Forbidden: insufficient permissions');
 }
 };
};
