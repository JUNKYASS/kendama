const db = require('../utils/db.js');

const tableName = 'system_holder';

class Holder {
  constructor() {
    // this.tableName = 'system_holder';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${tableName} (
        holder_uid_id INT NOT NULL AUTO_INCREMENT,
        holder_chr_name VARCHAR(255) NOT NULL,
        holder_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        holder_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (holder_uid_id),
        UNIQUE INDEX holder_chr_name_UNIQUE (holder_chr_name ASC) VISIBLE
      ) ENGINE = InnoDB, DEFAULT CHARACTER SET = utf8, COLLATE = utf8_general_ci;`;

      const [result] = await db.execute(query)

      if(result.warningStatus == 0) {
        return `Table ${tableName.toUpperCase()} has been created...`;
      } else {
        return `Table ${tableName.toUpperCase()} is ready...`;
      }
    } catch(e) {
      console.error(`ERROR on creating ${this.tableName.toUpperCase()} table: ${e.sqlMessage}`);
    }
  }

  static async select() {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE TRUE ORDER BY holder_uid_id ASC`);
    } catch(e) {
      console.error(e);

      return e;
    }
  }

  static async selectById(id) {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE holder_uid_id = ?`, [id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async insert(body) {
    try {
      return await db.execute(`INSERT INTO ${tableName} (holder_chr_name) VALUES (?)`, [body.holder_chr_name]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async delete(body) {
    try {
      return await db.execute(`DELETE FROM ${tableName} WHERE holder_uid_id = (?)`, [body.id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async update(newRow) {
    try {
      const [curRow] = await Holder.selectById(newRow.holder_uid_id);
      delete curRow[0].holder_smp_create; // Удаляем системные поля, которые нам в базе апдейтить не нужно
      delete curRow[0].holder_smp_update;
      delete newRow.moduleTable;

      for(let key in curRow[0]) { // Перебираем полученные из selectById данные и модифицируем данные в newRow, создавая объек, который будем загружать в базу
        if(!(key in newRow) || typeof newRow[key] === 'undefined') newRow[key] = curRow[0][key]; // Вставляем в новый массив то, что не было передавно или передано со значение undefined (подробнее: Если значение полученное из базы не имеется в newRow или в newRow значение равно undefined, то в newRow записываем значение из базы)
        if(newRow[key] === '') newRow[key] = null; // Меняем все значения раные '' на null
      }

      return await db.execute(`UPDATE ${tableName} SET holder_chr_name = ? WHERE holder_uid_id = ?`, [newRow.holder_chr_name ? newRow.holder_chr_name : null, newRow.holder_uid_id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }
}

module.exports = Holder;
