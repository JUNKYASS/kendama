const db = require('../utils/db.js');

class Cart {
  constructor() {
    this.tableName = 'cart';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${this.tableName} (
        cart_uid_id INT NOT NULL AUTO_INCREMENT,
        cart_mbr_member INT NULL DEFAULT 0,
        cart_hld_holder INT NULL DEFAULT 0,
        cart_lnk_user INT NOT NULL,
        cart_lnk_product INT NULL,
        cart_dec_price1 DECIMAL NOT NULL,
        cart_dec_price2 DECIMAL NULL,
        cart_dec_price3 DECIMAL NULL,
        cart_int_amount1 INT NOT NULL,
        cart_int_amount2 INT NULL,
        cart_int_amount3 INT NULL,
        cart_int_value INT NULL,
        cart_txt_text TEXT NULL,
        cart_chr_info VARCHAR(255) NULL,
        cart_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        cart_enm_flag ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
        cart_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        cart_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (cart_uid_id),
        FOREIGN KEY (cart_hld_holder) REFERENCES system_holder (holder_uid_id) ON DELETE SET NULL,
        FOREIGN KEY (cart_lnk_product) REFERENCES product (product_uid_id) ON DELETE SET NULL,
        INDEX user_INDEX (cart_lnk_user ASC) VISIBLE,
        INDEX product_INDEX (cart_lnk_product ASC) VISIBLE,
        INDEX member_INDEX (cart_mbr_member ASC) VISIBLE,
        INDEX holder_INDEX (cart_hld_holder ASC) VISIBLE,
        INDEX enmactive_INDEX (cart_enm_active ASC) VISIBLE,
        INDEX product_user_holder_INDEX (cart_lnk_product, cart_lnk_user, cart_hld_holder) VISIBLE,
        INDEX product_member_holder_INDEX (cart_lnk_product, cart_mbr_member, cart_hld_holder) VISIBLE
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

  // static tableName = 'cart';
}

module.exports = Cart;
