import { Request, Response } from 'express';
import pool from '../config/database';
import { getAllUsers, createUser, deleteUser } from '../models/userModel';

// 🔥 Extend Request biar ada user
interface AuthRequest extends Request {
  user?: { id: number; role_id: number };
}

export const listUsers = async (req: AuthRequest, res: Response) => {
  // ❌ belum login
  if (!req.user) {
    return res.redirect('/login');
  }

  const users = await getAllUsers();

  // 🔥 ambil permission user login
  const [rows]: any = await pool.query(`
    SELECT p.name FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = ?
  `, [req.user.id]);

  const permissions = rows.map((row: any) => row.name);

  res.render('layouts/main', {
    title: 'User Management',
    body: 'users/list',
    users,
    permissions, // 🔥 kirim ke view
    userRole: req.user.role_id
  });
};

export const storeUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  await createUser(req.body);
  res.redirect('/users');
};

export const removeUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  await deleteUser(parseInt(req.params.id));
  res.redirect('/users');
};