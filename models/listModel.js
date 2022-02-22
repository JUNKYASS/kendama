const { db } = require('../utils/db.js');

const tableName = 'list';

class List {
  constructor() {
    // this.tableName = 'list';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${tableName} (
        list_uid_id INT NOT NULL AUTO_INCREMENT,
        list_mbr_member INT NULL DEFAULT 0,
        list_hld_holder INT NULL DEFAULT 0,
        list_chr_url VARCHAR(255) NOT NULL,

        list_img_image VARCHAR(255) NULL,
        list_chr_name VARCHAR(255) NOT NULL,
        list_txt_text TEXT(255) NULL,
        list_chr_info1 VARCHAR(255) NULL,
        list_int_value1 INT NULL,
        
        list_enm_flag ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
        list_enm_active ENUM('YES', 'NO') NOT NULL DEFAULT 'YES',

        list_ind_index SMALLINT(6) NOT NULL DEFAULT 1000,
        list_smp_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        list_smp_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (list_uid_id),
        FOREIGN KEY (list_hld_holder) REFERENCES system_holder (holder_uid_id) ON DELETE SET NULL,

        INDEX member_INDEX (list_mbr_member ASC) VISIBLE,
        INDEX holder_INDEX (list_hld_holder ASC) VISIBLE,
        UNIQUE INDEX c (list_chr_url ASC) VISIBLE

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

  static async select() {
    try {
      return await db.execute(
        `
        SELECT
          list_uid_id,
          list_chr_url,
          list_mbr_member,
          list_hld_holder,
          list_img_image,
          list_chr_name,
          list_txt_text,
          list_chr_info1,
          list_int_value1,
          list_enm_flag,
          list_enm_active,
          list_ind_index,
          list_smp_create,
          list_smp_update,
          holder_chr_name
        FROM ${tableName}
        LEFT JOIN system_holder ON holder_uid_id = list_hld_holder
        WHERE TRUE
        ORDER BY list_uid_id
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

  static async selectById(id) {
    try {
      return await db.execute(`SELECT * FROM ${tableName} WHERE list_uid_id = ?`, [id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async insert(body) {
    try {
      // TODO:
      // Подумать над тем нужна ли проверка на обязательную передачу hld_holder и если да, то дописать условие в котором поле будет проверяться на наличие, при отсутствии выкидывать throw error

      const [{list_ind_index: highestIndexQuery}] = db.execute( // Получаем наибольший индекс из всех записей, чтобы при вставке новой записи в таблицу определить какой индекс задавать (highestIndexQuery + 1)
        `
        SELECT MAX(list_ind_index) 
        FROM ${tableName} 
        WHERE list_hld_holder = ?
        `, 
        [
          body.list_hld_holder ? body.list_hld_holder : 0,
        ]
      );

      return await db.execute(
        `
        INSERT INTO ${tableName}
        (
          list_chr_url,
          list_mbr_member,
          list_hld_holder,
          list_img_image,
          list_chr_name,
          list_txt_text,
          list_chr_info1,
          list_int_value1,
          list_enm_flag,
          list_enm_active,
          list_ind_index,
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          body.list_chr_url ? body.list_chr_url : 0,
          body.list_mbr_member ? body.list_mbr_member : 0,
          body.list_hld_holder ? body.list_hld_holder : 0,
          body.list_img_image ? body.list_img_image : null,
          body.list_chr_name ? body.list_chr_name : null,
          body.list_txt_text ? body.list_txt_text : null,
          body.list_chr_info1 ? body.list_chr_info1 : null,
          body.list_int_value1 ? body.list_int_value1 : null,
          body.list_enm_flag ? body.list_enm_flag : 'NO',
          body.list_enm_active ? body.list_enm_active : 'YES',
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
      return await db.execute(`DELETE FROM ${tableName} WHERE list_uid_id = (?)`, [body.id]);
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }

  static async update(newRow) {
    try {
      const [curRow] = await List.selectById(newRow.list_uid_id);

      delete curRow[0].list_smp_create; // Удаляем системные поля, которые нам в базе апдейтить не нужно
      delete curRow[0].list_smp_update;
      delete curRow[0].list_ind_index;
      delete newRow.moduleTable;

      for(let key in curRow[0]) { // Перебираем полученные из selectById данные и модифицируем данные в newRow, создавая объект, который будем загружать в базу
        if(!(key in newRow) || typeof newRow[key] === 'undefined') newRow[key] = curRow[0][key]; // Вставляем в новый массив то, что не было передано или передано со значение undefined (подробнее: Если значение полученное из базы не имеется в newRow или в newRow значение равно undefined, то в newRow записываем значение из базы)
        if(newRow[key] === '') newRow[key] = null; // Меняем все значения равные '' на null
      }

      return await db.execute(
        `
        UPDATE ${tableName} SET
          list_chr_url = ?,
          list_mbr_member = ?,
          list_hld_holder = ?,
          list_img_image = ?,
          list_chr_name = ?,
          list_txt_text = ?,
          list_chr_info1 = ?,
          list_int_value1 = ?,
          list_enm_flag = ?
          list_enm_active = ?
        WHERE list_uid_id = ?
        `,
        [
          newRow.list_chr_url ? newRow.list_chr_url : 0,
          newRow.list_mbr_member ? newRow.list_mbr_member : 0,
          newRow.list_hld_holder ? newRow.list_hld_holder : 0,
          newRow.list_img_image ? newRow.list_img_image : null,
          newRow.list_chr_name ? newRow.list_chr_name : null,
          newRow.list_txt_text ? newRow.list_txt_text : null,
          newRow.list_chr_info1 ? newRow.list_chr_info1 : null,
          newRow.list_int_value1 ? newRow.list_int_value1 : null,
          newRow.list_enm_flag ? newRow.list_enm_flag : 'NO',
          newRow.list_enm_active ? newRow.list_enm_active : 'YES',
          newRow.list_uid_id          
        ]
      );
    } catch(e) {
      const err = e.sqlMessage ? e.sqlMessage : e;
      console.log(err);

      return err;
    }
  }
}

module.exports = List;
