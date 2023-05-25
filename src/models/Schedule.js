const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

class Schedule {
  constructor(id, source, destination, cronSchedule) {
    this.id = id;
    this.source = source;
    this.destination = destination;
    this.cronSchedule = cronSchedule;
  }

  static create({ source, destination, cronSchedule }, callback) {
    const sql = `INSERT INTO schedules (source, destination, cronSchedule) VALUES (?, ?, ?)`;
    const params = [source, destination, cronSchedule];

    db.run(sql, params, function(err) {
      callback(err, this.lastID);
    });
  }

  static findAll(callback) {
    const sql = `SELECT * FROM schedules`;

    db.all(sql, function(err, rows) {
      if (err) {
        return callback(err);
      }

      let schedules = rows.map(row => new Schedule(row.id, row.source, row.destination, row.cronSchedule));
      callback(null, schedules);
    });
  }

  static delete(id, callback) {
    const sql = `DELETE FROM schedules WHERE id = ?`;

    db.run(sql, id, function(err) {
      callback(err);
    });
  }
}

// Cria a tabela schedules quando o módulo é carregado
db.run(`
  CREATE TABLE schedules (
    id INTEGER PRIMARY KEY,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    cronSchedule TEXT NOT NULL
  )
`, function(err) {
  if (err) {
    console.error('Error creating schedules table', err);
  }
});

module.exports = Schedule;
