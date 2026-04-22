const db = require('../config/database');

class UserModel {
  static async create({ name, email, hashedPassword, role = 'user' }) {
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await db.query(
      'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  }

  static async emailExists(email) {
    const { rows } = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    return rows.length > 0;
  }

  static async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const { rows } = await db.query(
      `SELECT id, name, email, role, is_active, created_at
       FROM users ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: countRows } = await db.query('SELECT COUNT(*) FROM users');
    return {
      users: rows,
      total: parseInt(countRows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRows[0].count) / limit),
    };
  }

  static async deleteById(id) {
    const { rowCount } = await db.query(
      'DELETE FROM users WHERE id = $1', [id]
    );
    return rowCount > 0;
  }
}

module.exports = UserModel;