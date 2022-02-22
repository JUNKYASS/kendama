const { db } = require('../utils/db.js');

const tableName = 'folder';

class Folder {
  constructor() {
    // this.tableName = 'folder';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${tableName} (
        folder_uid_id INT NOT NULL AUTO_INCREMENT,
        folder_mbr_member INT NULL DEFAULT 0,
        folder_hld_holder INT NULL DEFAULT 0,
        folder_chr_url VARCHAR(255) NOT NULL,
        folder_chr_name VARCHAR(255) NOT NULL,
        folder_img_image VARCHAR(255) NULL,
        folder_int_value1 INT NULL,
        folder_int_value2 INT NULL,
        folder_txt_text1 TEXT NULL,
        folder_txt_text2 TEXT NULL,
        folder_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        folder_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        folder_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (folder_uid_id),
        FOREIGN KEY (folder_hld_holder) REFERENCES system_holder (holder_uid_id) ON DELETE SET NULL,
        INDEX member_INDEX (folder_mbr_member ASC) VISIBLE,
        INDEX holder_INDEX (folder_hld_holder ASC) VISIBLE,
        INDEX name_INDEX (folder_chr_name ASC) VISIBLE,
        INDEX holder_url_INDEX (folder_hld_holder, folder_chr_url) VISIBLE,
        INDEX holder_id_INDEX (folder_hld_holder, folder_uid_id) VISIBLE,
        UNIQUE INDEX url_UNIQUE_INDEX (folder_chr_url ASC) VISIBLE
      ) CHARACTER SET = utf8 , COLLATE = utf8_general_ci, ENGINE = InnoDB;`;

      const result = await db.execute(query);

      if(result[0].warningStatus == 0) { // Если таблица уже есть, то warningStatus будет не равен нулю, в таком случае пишем, что таблица готова, иначе будет отдан статус 0, в таком случае напишем, что таблица создана
        return `Table ${tableName.toUpperCase()} has been created...`;
      } else {
        return `Table ${tableName.toUpperCase()} is ready...`;
      }
    } catch(e) {
      console.error(`ERROR on creating ${tableName.toUpperCase()} table: ${e.sqlMessage}`);
    }
  }

  // static tableName = 'folder';

  static async select() {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE TRUE ORDER BY folder_uid_id ASC`);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async selectById(id) {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE folder_uid_id = ?`, [id]);
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
          folder_mbr_member,
          folder_hld_holder,
          folder_chr_url,
          folder_chr_name,
          folder_img_image,
          folder_int_value1,
          folder_int_value2,
          folder_txt_text1,
          folder_txt_text2,
          folder_enm_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          body.folder_mbr_member ? body.folder_mbr_member : 0,
          body.folder_hld_holder ? body.folder_hld_holder : 0,
          body.folder_chr_url ? body.folder_chr_url : null,
          body.folder_chr_name ? body.folder_chr_name : null,
          body.folder_img_image ? body.folder_img_image : null,
          body.folder_int_value1 ? body.folder_int_value1 : null,
          body.folder_int_value2 ? body.folder_int_value2 : null,
          body.folder_txt_text1 ? body.folder_txt_text1 : null,
          body.folder_txt_text2 ? body.folder_txt_text2 : null,
          body.folder_enm_active ? body.folder_enm_active : 'YES',
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
      return await db.execute(`DELETE FROM ${tableName} WHERE folder_uid_id = (?)`, [body.id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async update(newRow) {
    try {
      const [curRow] = await Folder.selectById(newRow.folder_uid_id);
      delete curRow[0].folder_smp_create; // Удаляем системные поля, которые нам в базе апдейтить не нужно
      delete curRow[0].folder_smp_update;
      delete newRow.moduleTable;

      for(let key in curRow[0]) { // Перебираем полученные из selectById данные и модифицируем данные в newRow, создавая объек, который будет загружать в базу
        if(!(key in newRow) || typeof newRow[key] === 'undefined') newRow[key] = curRow[0][key]; // Вставляем в новый массив то, что не было передавно или передано со значение undefined (подробнее: Если значение полученное из базы не имеется в newRow или в newRow значение равно undefined, то в newRow записываем значение из базы)
        if(newRow[key] === '') newRow[key] = null; // Меняем все значения раные '' на null
      }

      return await db.execute(
        `
        UPDATE ${tableName} SET folder_mbr_member = ?,
          folder_hld_holder = ?,
          folder_chr_url = ?,
          folder_chr_name = ?,
          folder_img_image = ?,
          folder_int_value1 = ?,
          folder_int_value2 = ?,
          folder_txt_text1 = ?,
          folder_txt_text2 = ?,
          folder_enm_active = ?
        WHERE folder_uid_id = ?
        `,
        [
          newRow.folder_mbr_member ? newRow.folder_mbr_member : 0,
          newRow.folder_hld_holder ? newRow.folder_hld_holder : 0,
          newRow.folder_chr_url ? newRow.folder_chr_url : null,
          newRow.folder_chr_name ? newRow.folder_chr_name : null,
          newRow.folder_img_image ? newRow.folder_img_image : null,
          newRow.folder_int_value1 ? newRow.folder_int_value1 : null,
          newRow.folder_int_value2 ? newRow.folder_int_value2 : null,
          newRow.folder_txt_text1 ? newRow.folder_txt_text1 : null,
          newRow.folder_txt_text2 ? newRow.folder_txt_text2 : null,
          newRow.folder_enm_active ? newRow.folder_enm_active : null,
          newRow.folder_uid_id
        ]
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }
}

module.exports = Folder;
