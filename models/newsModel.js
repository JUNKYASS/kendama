const db = require('../utils/db.js');

class News {
  constructor() {
    this.tableName = 'news';

    return this.createTable();
  }

  async createTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS kendama.${this.tableName} (
        news_uid_id INT NOT NULL AUTO_INCREMENT,
        news_hld_holder INT NULL DEFAULT 0,
        news_chr_name VARCHAR(255) NOT NULL,
        news_chr_shortname VARCHAR(255) NULL,
        news_txt_text VARCHAR(255) NOT NULL,
        news_txt_shorttext VARCHAR(255) NULL,
        news_chr_info1 VARCHAR(255) NULL,
        news_chr_info2 VARCHAR(255) NULL,
        news_int_value1 INT NULL,
        news_int_value2 INT NULL,
        news_int_views INT NOT NULL DEFAULT 1,
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
        UNIQUE INDEX name_UNIQUE_INDEX (news_chr_name ASC) VISIBLE
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
}

module.exports = News;
