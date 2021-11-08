const { db } = require('../utils/db.js');

class News {
  constructor() {
    this.tableName = 'news';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${this.tableName} (
        news_uid_id INT NOT NULL AUTO_INCREMENT,
        news_mbr_member INT NULL DEFAULT 0,
        news_hld_holder INT NULL DEFAULT 0,
        news_chr_url VARCHAR(255) NOT NULL,

        news_chr_name VARCHAR(255) NOT NULL,
        news_chr_shortname VARCHAR(255) NULL,
        news_txt_text TEXT NOT NULL,
        news_txt_shorttext VARCHAR(255) NULL,
        news_chr_info VARCHAR(255) NULL,
        news_int_value INT NULL,

        news_img_image1 VARCHAR(255) NULL,
        news_img_image2 VARCHAR(255) NULL,


        news_dat_date1 TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        news_dat_date2 TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        news_int_views INT NOT NULL DEFAULT 1,
        news_lnk_category VARCHAR(255) NULL,
        news_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',
        news_enm_flag ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',

        news_ind_index SMALLINT(6) NOT NULL DEFAULT 1000,
        news_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        news_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (news_uid_id),
        FOREIGN KEY (news_hld_holder) REFERENCES system_holder (holder_uid_id) ON DELETE SET NULL,
        INDEX enmactive_INDEX (news_enm_active ASC) VISIBLE,
        INDEX enmflag_INDEX (news_enm_flag ASC) VISIBLE,
        INDEX holder_INDEX (news_hld_holder ASC) VISIBLE,
        INDEX holder_enmactive_INDEX (news_hld_holder, news_enm_active) VISIBLE,
        INDEX id_enmactive_INDEX (news_uid_id, news_enm_active) VISIBLE,
        INDEX id_enmactive_holder_INDEX (news_uid_id, news_enm_active, news_hld_holder) VISIBLE,
        UNIQUE INDEX name_UNIQUE_INDEX (news_chr_name ASC) VISIBLE,
        UNIQUE INDEX chr_url_UNIQUE_INDEX (news_chr_url ASC) VISIBLE
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

  // static tableName = 'news';

  static async select() {
    try {
      return await db.execute(
        `
        SELECT
          news_uid_id, 
          news_mbr_member, 
          news_hld_holder,
          news_chr_url,

          news_chr_name, 
          news_chr_shortname,
          news_txt_text, 
          news_txt_shorttext, 
          news_chr_info, 
          news_int_value,

          news_img_image1, 
          news_img_image2, 

          news_dat_date1, 
          news_dat_date2, 

          news_int_views,
          news_lnk_category
          news_enm_active, 
          news_enm_flag, 

          news_ind_index, 
          news_smp_create, 
          news_smp_update,
          folder_chr_name
        FROM ${tableName}
        LEFT JOIN folder ON folder_uid_id = news_mbr_member AND folder_hld_holder = 4
        WHERE news_hld_holder = 4 AND IFNULL(news_enm_active, 'NO') = 'YES'
        ORDER BY news_smp_create DESC
        `
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async selectCustom(query) {
    try {
      return await db.execute(query);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  };

  static async insert(body) {
    try {
      // TODO:
      // Подумать над тем нужна ли проверка на обязательную передачу hld_holder и если да, то дописать условие в котором поле будет проверяться на наличие, при отсутствии выкидывать throw error

      const [{news_ind_index: highestIndexQuery}] = db.execute( // Получаем наибольший индекс из всех записей, чтобы при вставке новой записи в таблицу определить какой индекс задавать (highestIndexQuery + 1)
        `
        SELECT MAX(news_ind_index) 
        FROM ${tableName} 
        WHERE news_hld_holder = ?
        `, 
        [
          body.news_hld_holder ? body.news_hld_holder : 0,
        ]
      );

      return await db.execute(
        `
        INSERT INTO ${tableName}
        (
          news_mbr_member, 
          news_hld_holder, 
          news_chr_url,
          news_chr_name, 
          news_chr_shortname, 
          news_txt_text, 
          news_txt_shorttext, 
          news_chr_info, 
          news_img_image1, 
          news_img_image2, 
          news_int_value, 
          news_dat_date1, 
          news_dat_date2, 
          news_int_views, 
          news_enm_active,
          news_enm_flag,
          news_lnk_category,
          news_ind_index
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          body.news_mbr_member ? body.news_mbr_member : 0,
          body.news_hld_holder ? body.news_hld_holder : 0,
          body.news_chr_url ? body.news_chr_url : 0,
          body.news_chr_name ? body.news_chr_name : null,
          body.news_chr_shortname ? body.news_chr_shortname : null,
          body.news_txt_text ? body.news_txt_text : null,
          body.news_txt_shorttext ? body.news_txt_shorttext : null,
          body.news_chr_info ? body.news_chr_info : null,
          body.news_img_image1 ? body.news_img_image1 : null,
          body.news_img_image2 ? body.news_img_image2 : null,
          body.news_int_value ? body.news_int_value : null,
          body.news_dat_date1 ? body.news_dat_date1 : null,
          body.news_dat_date2 ? body.news_dat_date2 : null,
          body.news_int_views ? body.news_int_views : 0,
          body.news_enm_active ? body.news_enm_active : 'YES',,
          body.news_enm_flag ? body.news_enm_flag : 'NO',
          body.news_lnk_category ? body.news_lnk_category : null,
          highestIndexQuery ? highestIndexQuery : 1000,
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
      return await db.execute(`DELETE FROM ${tableName} WHERE news_uid_id = (?)`, [body.id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async update(newRow) {
    try {
      const [curRow] = await List.selectById(newRow.news_uid_id);

      delete curRow[0].news_smp_create; // Удаляем системные поля, которые нам в базе апдейтить не нужно
      delete curRow[0].news_smp_update;
      delete curRow[0].news_ind_index;
      delete newRow.moduleTable;

      for(let key in curRow[0]) { // Перебираем полученные из selectById данные и модифицируем данные в newRow, создавая объект, который будем загружать в базу
        if(!(key in newRow) || typeof newRow[key] === 'undefined') newRow[key] = curRow[0][key]; // Вставляем в новый массив то, что не было передано или передано со значение undefined (подробнее: Если значение полученное из базы не имеется в newRow или в newRow значение равно undefined, то в newRow записываем значение из базы)
        if(newRow[key] === '') newRow[key] = null; // Меняем все значения равные '' на null
      }

      return await db.execute(
        `
        UPDATE ${tableName} SET
          news_mbr_member = ?, 
          news_hld_holder = ?, 
          news_chr_url = ?,
          news_chr_name = ?, 
          news_chr_shortname = ?, 
          news_txt_text = ?, 
          news_txt_shorttext = ?, 
          news_chr_info = ?, 
          news_img_image1 = ?, 
          news_img_image2 = ?, 
          news_int_value = ?, 
          news_dat_date1 = ?, 
          news_dat_date2 = ?, 
          news_int_views = ?, 
          news_enm_active = ?,
          news_enm_flag = ?,
          news_lnk_category = ?,
        WHERE news_uid_id = ?
        `,
        [
          body.news_mbr_member ? body.news_mbr_member : 0,
          body.news_hld_holder ? body.news_hld_holder : 0,
          body.news_chr_url ? body.news_chr_url : 0,
          body.news_chr_name ? body.news_chr_name : null,
          body.news_chr_shortname ? body.news_chr_shortname : null,
          body.news_txt_text ? body.news_txt_text : null,
          body.news_txt_shorttext ? body.news_txt_shorttext : null,
          body.news_chr_info ? body.news_chr_info : null,
          body.news_img_image1 ? body.news_img_image1 : null,
          body.news_img_image2 ? body.news_img_image2 : null,
          body.news_int_value ? body.news_int_value : null,
          body.news_dat_date1 ? body.news_dat_date1 : null,
          body.news_dat_date2 ? body.news_dat_date2 : null,
          body.news_int_views ? body.news_int_views : 0,
          body.news_enm_active ? body.news_enm_active : 'YES',,
          body.news_enm_flag ? body.news_enm_flag : 'NO',
          body.news_lnk_category ? body.news_lnk_category : 'NO',
          newRow.news_uid_id          
        ]
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }
}

module.exports = News;
