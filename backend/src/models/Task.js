const db = require('../config/database');

class TaskModel {
  static async create({ userId, title, description, status, priority, dueDate }) {
    const { rows } = await db.query(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, title, description || null, status || 'todo', priority || 'medium', dueDate || null]
    );
    return rows[0];
  }

  static async findByUserId(userId, { page = 1, limit = 10, status, priority } = {}) {
    const offset = (page - 1) * limit;
    const conditions = ['user_id = $1'];
    const params = [userId];
    let idx = 2;

    if (status)   { conditions.push(`status = $${idx++}`);   params.push(status); }
    if (priority) { conditions.push(`priority = $${idx++}`); params.push(priority); }

    params.push(limit, offset);
    const whereStr = conditions.join(' AND ');

    const { rows } = await db.query(
      `SELECT * FROM tasks WHERE ${whereStr}
       ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    const countParams = params.slice(0, idx - 1);
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM tasks WHERE ${whereStr}`, countParams
    );

    return {
      tasks: rows,
      total: parseInt(countRows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRows[0].count) / limit),
    };
  }

  static async findAll({ page = 1, limit = 10, status } = {}) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (status) { conditions.push(`status = $${idx++}`); params.push(status); }

    const whereStr = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const { rows } = await db.query(
      `SELECT t.*, u.name as user_name, u.email as user_email
       FROM tasks t JOIN users u ON t.user_id = u.id
       ${whereStr}
       ORDER BY t.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    const countParams = params.slice(0, idx - 1);
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM tasks ${whereStr}`, countParams
    );

    return {
      tasks: rows,
      total: parseInt(countRows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRows[0].count) / limit),
    };
  }

  static async findByIdAndUser(id, userId) {
    const { rows } = await db.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await db.query(
      `SELECT t.*, u.name as user_name FROM tasks t
       JOIN users u ON t.user_id = u.id WHERE t.id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  static async updateById(id, userId, updates, isAdmin = false) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.title !== undefined)       { fields.push(`title = $${idx++}`);       values.push(updates.title); }
    if (updates.description !== undefined) { fields.push(`description = $${idx++}`); values.push(updates.description); }
    if (updates.status !== undefined)      { fields.push(`status = $${idx++}`);      values.push(updates.status); }
    if (updates.priority !== undefined)    { fields.push(`priority = $${idx++}`);    values.push(updates.priority); }
    if (updates.due_date !== undefined)    { fields.push(`due_date = $${idx++}`);    values.push(updates.due_date); }

    if (!fields.length) return null;

    values.push(id);
    const userCondition = isAdmin ? '' : ` AND user_id = $${idx + 1}`;
    if (!isAdmin) values.push(userId);

    const { rows } = await db.query(
      `UPDATE tasks SET ${fields.join(', ')}
       WHERE id = $${idx}${userCondition}
       RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  static async deleteById(id, userId, isAdmin = false) {
    const query = isAdmin
      ? 'DELETE FROM tasks WHERE id = $1'
      : 'DELETE FROM tasks WHERE id = $1 AND user_id = $2';
    const params = isAdmin ? [id] : [id, userId];
    const { rowCount } = await db.query(query, params);
    return rowCount > 0;
  }
}

module.exports = TaskModel;