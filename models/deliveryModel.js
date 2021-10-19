const { db } = require('../utils/db.js');

class Delivery {
  constructor() {
    this.tableName = 'delivery';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${this.tableName} (
        delivery_uid_id INT NOT NULL AUTO_INCREMENT,
        delivery_chr_name VARCHAR(255) NOT NULL,
        delivery_chr_info1 VARCHAR(255) NULL,
        delivery_chr_info2 VARCHAR(255) NULL,
        delivery_int_value1 INT NULL,
        delivery_int_value2 INT NULL,
        delivery_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        delivery_ind_index SMALLINT(6) NOT NULL DEFAULT 1000,
        delivery_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delivery_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (delivery_uid_id),
        INDEX enmactive_INDEX (delivery_enm_active ASC) VISIBLE,
        INDEX id_enmactive_INDEX (delivery_uid_id, delivery_enm_active) VISIBLE,
        UNIQUE INDEX name_UNIQUE_INDEX (delivery_chr_name ASC) VISIBLE
      ) ENGINE = InnoDB, DEFAULT CHARACTER SET = utf8, COLLATE = utf8_general_ci;`;

      const [result] = await db.execute(query)

      if (result.warningStatus == 0) {
        return `Table ${this.tableName.toUpperCase()} has been created...`;
      } else {
        return `Table ${this.tableName.toUpperCase()} is ready...`;
      }
    } catch (e) {
      console.error(`ERROR on creating ${this.tableName.toUpperCase()} table: ${e.sqlMessage}`);
    }
  }

  // static tableName = 'delivery';
}

module.exports = Delivery;
