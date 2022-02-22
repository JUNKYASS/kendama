const { db } = require('../utils/db.js');

const tableName = 'user';

class User {
  constructor() {
    // this.tableName = 'user';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${tableName} (
        user_uid_id INT NOT NULL AUTO_INCREMENT,
        user_hld_holder INT NULL DEFAULT 0,
        user_chr_email VARCHAR(255) NOT NULL,
        user_chr_pass VARCHAR(255) NOT NULL,
        user_chr_passtoken VARCHAR(255) NULL,
        user_chr_passtokenexp DATE NULL,
        user_chr_name VARCHAR(255) NULL,
        user_chr_phone VARCHAR(255) NULL,
        user_chr_city VARCHAR(255) NULL,
        user_chr_address VARCHAR(255) NULL,
        user_chr_postcode VARCHAR(255) NULL,
        user_int_value INT NULL,
        user_chr_info VARCHAR(255) NULL,
        user_ind_index SMALLINT(5) NOT NULL DEFAULT 1000,
        user_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        user_enm_flag ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
        user_enm_sub ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
        user_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (user_uid_id),
        FOREIGN KEY (user_hld_holder) REFERENCES system_holder (holder_uid_id) ON DELETE SET NULL,
        INDEX name_INDEX (user_chr_name ASC) VISIBLE,
        INDEX email_INDEX (user_chr_email ASC) VISIBLE,
        INDEX holder_INDEX (user_hld_holder ASC) VISIBLE,
        INDEX enmactive_INDEX (user_enm_active ASC) VISIBLE,
        INDEX enmflag_INDEX (user_enm_flag ASC) VISIBLE,
        INDEX enmsub_INDEX (user_enm_sub ASC) VISIBLE,
        INDEX email_enmactive_INDEX (user_chr_email, user_enm_active) VISIBLE,
        UNIQUE INDEX email_UNIQUE_INDEX (user_chr_email ASC) VISIBLE
      ) ENGINE = InnoDB, DEFAULT CHARACTER SET = utf8, COLLATE = utf8_general_ci;`;

      const [result] = await db.execute(query)

      if(result.warningStatus == 0) {
        return `Table ${tableName.toUpperCase()} has been created...`;
      } else {
        return `Table ${tableName.toUpperCase()} is ready...`;
      }
    } catch(e) {
      console.error(`ERROR on creating ${tableName.toUpperCase()} table: ${e.sqlMessage}`);
    }
  }

  // static tableName = 'user';

  static async select() {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE TRUE ORDER BY user_uid_id ASC`);
    } catch(e) {
      console.error(e);

      return e;
    }
  }

  static async selectByEmail(email) {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE user_chr_email = ?`, [email]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async selectById(id) {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE user_uid_id = ?`, [id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async insert(body, callback) {
    try {
      return await db.execute(
        `
        INSERT INTO ${tableName}
        (
          user_hld_holder,
          user_chr_email,
          user_chr_pass
        ) VALUES (?, ?, ?)
        `,
        [
          body.holder,
          body.user_chr_email,
          body.hashedPass
        ]
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return {err}; // Возвращаем объект с ошибкой
    }
  }

  static async delete(body) {
    try {
      return await db.execute(`DELETE FROM ${tableName} WHERE user_uid_id = (?)`, [body.id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }
}

module.exports = User;
