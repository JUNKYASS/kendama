const db = require('../utils/db.js');

class Order {
  constructor() {
    this.tableName = 'order';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${this.tableName} (
        order_uid_id INT NOT NULL AUTO_INCREMENT,
        order_lnk_user INT NULL,
        order_lnk_payment INT NULL,
        order_lnk_delivery INT NULL,
        order_chr_email VARCHAR(255) NOT NULL,
        order_chr_name VARCHAR(255) NOT NULL,
        order_chr_phone VARCHAR(255) NOT NULL,
        order_chr_city VARCHAR(255) NOT NULL,
        order_chr_address VARCHAR(255) NOT NULL,
        order_chr_postcode VARCHAR(255) NOT NULL,
        order_txt_text TEXT NULL,
        order_chk_option BIT(32) NULL,
        order_chk_set BIT(32) NULL,
        order_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        order_enm_flag ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
        order_dec_total1 DECIMAL NOT NULL,
        order_dec_total2 DECIMAL NULL,
        order_dec_total3 DECIMAL NULL,
        order_int_amount1 INT NOT NULL,
        order_int_amount2 INT NULL,
        order_int_amount3 INT NULL,
        order_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        order_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (order_uid_id),
        FOREIGN KEY (order_lnk_payment) REFERENCES payment (payment_uid_id) ON DELETE SET NULL,
        FOREIGN KEY (order_lnk_delivery) REFERENCES delivery (delivery_uid_id) ON DELETE SET NULL,
        INDEX user_INDEX (order_lnk_user ASC) VISIBLE,
        INDEX user_id_index (order_lnk_user, order_uid_id) VISIBLE,
        INDEX user_enmactive_index (order_lnk_user, order_enm_active) VISIBLE
      ) ENGINE = InnoDB, DEFAULT CHARACTER SET = utf8, COLLATE = utf8_general_ci;`;

      const [result] = await db.execute(query)

      if(result.warningStatus == 0) {
        return `Table ${this.tableName.toUpperCase()} has been created...`;
      } else {
        return `Table ${this.tableName.toUpperCase()} is ready...`;
      }
    } catch(e) {
      console.error(`ERROR on creating ${this.tableName.toUpperCase()} table: ${e.sqlMessage}`);
    }
  }

  // static tableName = 'order';
}

module.exports = Order;
