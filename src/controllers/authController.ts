import { Request, Response } from 'express';
import pool from '../config/database';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const [rows]: any = await pool.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );

  if (rows.length === 0) {
    return res.send('Login gagal');
  }

  const user = rows[0];

  // simpan ke session
  (req.session as any).user = {
    id: user.id,
    role_id: user.role_id
  };

  res.redirect('/users');
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};