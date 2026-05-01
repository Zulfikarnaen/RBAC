import pool from "../config/database";

export const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

export const createUser = async (data: any) => {
  const { username, password, role_id } = data;

  await pool.query(
    "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)",
    [username, password, role_id]
  );
};

export const deleteUser = async (id: number) => {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
};