const { db } = require('../utils/db.js');

const tableName = 'image';

class Image {
  constructor() {
    // this.tableName = 'image';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${tableName} (
        image_uid_id INT NOT NULL AUTO_INCREMENT,
        image_chr_url VARCHAR(255) NOT NULL,
        image_mbr_member INT NULL DEFAULT 0,
        image_hld_holder INT NULL DEFAULT 0,
        image_img_image VARCHAR(255) NULL,
        image_chr_name VARCHAR(255) NOT NULL,
        image_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        image_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        image_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (image_uid_id),
        FOREIGN KEY (image_hld_holder) REFERENCES system_holder (holder_uid_id) ON DELETE SET NULL,
        INDEX member_INDEX (image_mbr_member ASC) VISIBLE,
        INDEX holder_INDEX (image_hld_holder ASC) VISIBLE,
        UNIQUE INDEX chr_url_UNIQUE_INDEX (image_chr_url ASC) VISIBLE
      ) ENGINE = InnoDB, DEFAULT CHARACTER SET = utf8, COLLATE = utf8_general_ci;`;

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

  // static tableName = 'image';

  static async select() {
    try {
      return await db.execute(
        `
        SELECT
          image_uid_id,
          image_chr_url,
          image_mbr_member,
          image_hld_holder,
          image_img_image,
          image_chr_name,
          image_enm_active,
          image_smp_create,
          image_smp_update,
          holder_chr_name
        FROM ${tableName}
        LEFT JOIN system_holder ON holder_uid_id = image_hld_holder
        WHERE TRUE
        ORDER BY image_uid_id
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
      return await db.execute(`SELECT * FROM ${tableName} WHERE image_uid_id = ?`, [id]);
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
          image_chr_url,
          image_mbr_member,
          image_hld_holder,
          image_img_image,
          image_chr_name,
          image_enm_active
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          body.image_chr_url ? body.image_chr_url : 0,
          body.image_mbr_member ? body.image_mbr_member : 0,
          body.image_hld_holder ? body.image_hld_holder : 0,
          body.image_img_image ? body.image_img_image : null,
          body.image_chr_name ? body.image_chr_name : null,
          body.image_enm_active ? body.image_enm_active : 'YES',
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
      return await db.execute(`DELETE FROM ${tableName} WHERE image_uid_id = (?)`, [body.id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async update(newRow) {
    try {
      const [curRow] = await Image.selectById(newRow.image_uid_id);

      delete curRow[0].image_smp_create; // Удаляем системные поля, которые нам в базе апдейтить не нужно
      delete curRow[0].image_smp_update;
      delete newRow.moduleTable;

      for(let key in curRow[0]) { // Перебираем полученные из selectById данные и модифицируем данные в newRow, создавая объект, который будем загружать в базу
        if(!(key in newRow) || typeof newRow[key] === 'undefined') newRow[key] = curRow[0][key]; // Вставляем в новый массив то, что не было передано или передано со значение undefined (подробнее: Если значение полученное из базы не имеется в newRow или в newRow значение равно undefined, то в newRow записываем значение из базы)
        if(newRow[key] === '') newRow[key] = null; // Меняем все значения равные '' на null
      }

      return await db.execute(
        `
        UPDATE ${tableName} SET
          image_chr_url = ?,
          image_mbr_member = ?,
          image_hld_holder = ?,
          image_img_image = ?,
          image_chr_name = ?,
          image_enm_active = ?
        WHERE image_uid_id = ?
        `,
        [
          newRow.image_chr_url ? newRow.image_chr_url : 0,
          newRow.image_mbr_member ? newRow.image_mbr_member : 0,
          newRow.image_hld_holder ? newRow.image_hld_holder : 0,
          newRow.image_img_image ? newRow.image_img_image : null,
          newRow.image_chr_name ? newRow.image_chr_name : null,
          newRow.image_enm_active ? newRow.image_enm_active : 'YES',
          newRow.image_uid_id
        ]
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }
}

module.exports = Image;
