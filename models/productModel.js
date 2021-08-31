const db = require('../utils/db.js');

const tableName = 'product';

class Product {
  constructor() {
    // this.tableName = 'product';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${tableName} (
        product_uid_id INT NOT NULL AUTO_INCREMENT,
        product_mbr_member INT NULL DEFAULT 0,
        product_hld_holder INT NULL DEFAULT 0,
        product_chr_url VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL,
        product_chr_name VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL,
        product_chr_article VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL,
        product_img_image VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL,
        product_txt_text TEXT CHARACTER SET 'utf8' COLLATE 'utf8_general_ci',
        product_dec_price1 DECIMAL NOT NULL,
        product_dec_price2 DECIMAL NULL,
        product_chk_print BIT(32) NULL,
        product_chk_show BIT(32) NULL,
        product_enm_available ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        product_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        product_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        product_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (product_uid_id),
        FOREIGN KEY (product_mbr_member) REFERENCES folder (folder_uid_id) ON DELETE SET NULL,
        FOREIGN KEY (product_hld_holder) REFERENCES system_holder (holder_uid_id) ON DELETE SET NULL,
        INDEX member_INDEX (product_mbr_member ASC) VISIBLE,
        INDEX holder_INDEX (product_hld_holder ASC) VISIBLE,
        INDEX price1_INDEX (product_dec_price1 ASC) VISIBLE,
        INDEX member_holder_INDEX (product_mbr_member, product_hld_holder) VISIBLE,
        INDEX member_holder_id_INDEX (product_mbr_member, product_hld_holder, product_uid_id) VISIBLE,
        UNIQUE INDEX url_UNIQUE_INDEX (product_chr_url ASC) VISIBLE,
        UNIQUE INDEX article_UNIQUE_INDEX (product_chr_article ASC) VISIBLE
      ) ENGINE = InnoDB, CHARACTER SET = utf8, COLLATE = utf8_general_ci;`;

      const result = await db.execute(query)

      if(result[0].warningStatus == 0) {
        return `Table ${tableName.toUpperCase()} has been created...`;
      } else {
        return `Table ${tableName.toUpperCase()} is ready...`;
      }
    } catch(e) {
      console.error(`ERROR on creating ${tableName.toUpperCase()} table: ${e.sqlMessage}`);
    }
  }

  // static tableName = 'product';

  static async select() {
    try {
      return await db.execute(
        `
        SELECT
          product_uid_id,
          product_mbr_member,
          product_hld_holder,
          product_chr_url,
          product_chr_name,
          product_chr_article,
          product_img_image,
          product_txt_text,
          product_dec_price1,
          product_dec_price2,
          product_chk_print,
          product_chk_show,
          product_enm_available,
          product_enm_active,
          product_smp_create,
          product_smp_update,
          folder_chr_name
        FROM ${tableName}
        LEFT JOIN folder ON folder_uid_id = product_mbr_member
        WHERE TRUE
        ORDER BY product_uid_id
        `
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async selectById(id) {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE product_uid_id = ?`, [id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async insert(body) {
    try {
      return await db.execute(
        `
        INSERT INTO ${tableName}
        (
          product_mbr_member,
          product_hld_holder,
          product_chr_url,
          product_chr_name,
          product_chr_article,
          product_img_image,
          product_txt_text,
          product_dec_price1,
          product_dec_price2,
          product_chk_print,
          product_chk_show,
          product_enm_available,
          product_enm_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          body.product_mbr_member ? body.product_mbr_member : 0,
          body.product_hld_holder ? body.product_hld_holder : 0,
          body.product_chr_url ? body.product_chr_url : null,
          body.product_chr_name ? body.product_chr_name : null,
          body.product_chr_article ? body.product_chr_article : null,
          body.product_img_image ? body.product_img_image : null,
          body.product_txt_text ? body.product_txt_text : null,
          body.product_dec_price1 ? body.product_dec_price1 : null,
          body.product_dec_price2 ? body.product_dec_price2 : null,
          body.product_chk_print ? body.product_chk_print : null,
          body.product_chk_show ? body.product_chk_show : null,
          body.product_enm_available ? body.product_enm_available : 'YES',
          body.product_enm_active ? body.product_enm_active : 'YES',
        ]
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async delete(body) {
    try {
      return await db.execute(`DELETE FROM ${tableName} WHERE product_uid_id = (?)`, [body.id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async update(newRow) {
    try {
      const [curRow] = await Product.selectById(newRow.product_uid_id);

      delete curRow[0].product_smp_create; // Удаляем системные поля, которые нам в базе апдейтить не нужно
      delete curRow[0].product_smp_update;
      delete newRow.moduleTable;

      for(let key in curRow[0]) { // Перебираем полученные из selectById данные и модифицируем данные в newRow, создавая объек, который будет загружать в базу
        if(!(key in newRow) || typeof newRow[key] === 'undefined') newRow[key] = curRow[0][key]; // Вставляем в новый массив то, что не было передавно или передано со значение undefined (подробнее: Если значение полученное из базы не имеется в newRow или в newRow значение равно undefined, то в newRow записываем значение из базы)
        if(newRow[key] === '') newRow[key] = null; // Меняем все значения раные '' на null
      }

      return await db.execute(
        `
        UPDATE ${tableName} SET
          product_mbr_member = ?,
          product_hld_holder = ?,
          product_chr_url = ?,
          product_chr_name = ?,
          product_chr_article = ?,
          product_img_image = ?,
          product_txt_text = ?,
          product_dec_price1 = ?,
          product_dec_price2 = ?,
          product_chk_print = ?,
          product_chk_show = ?,
          product_enm_available = ?,
          product_enm_active = ?
        WHERE product_uid_id = ?
        `,
        [
          newRow.product_mbr_member ? newRow.product_mbr_member : 0,
          newRow.product_hld_holder ? newRow.product_hld_holder : 0,
          newRow.product_chr_url ? newRow.product_chr_url : null,
          newRow.product_chr_name ? newRow.product_chr_name : null,
          newRow.product_chr_article ? newRow.product_chr_article : null,
          newRow.product_img_image ? newRow.product_img_image : null,
          newRow.product_txt_text ? newRow.product_txt_text : null,
          newRow.product_dec_price1 ? newRow.product_dec_price1 : null,
          newRow.product_dec_price2 ? newRow.product_dec_price2 : null,
          newRow.product_chk_print ? newRow.product_chk_print : null,
          newRow.product_chk_show ? newRow.product_chk_show : null,
          newRow.product_enm_available ? newRow.product_enm_available : null,
          newRow.product_enm_active ? newRow.product_enm_active : null,
          newRow.product_uid_id
        ]
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }
}

module.exports = Product;
