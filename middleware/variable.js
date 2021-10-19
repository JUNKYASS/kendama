const { db } = require('../utils/db.js');
// const Image = require('../models/imageModel');

module.exports = async (req, res, next) => {
  try {
    res.locals.year = new Date().getFullYear(); // Получаем текущий год
    res.locals.page = req.originalUrl.split('/')[1] === '' ? 'homepage' : req.originalUrl.split('/')[1]; // Вычисляем название текущей страницы (изначально передаётся в body class).
    res.locals.userHolderId = 1;
    const [instImageRows] = await db.execute(`SELECT image_img_image FROM image WHERE image_hld_holder = 1 AND IFNULL(image_enm_active, 'NO') = 'YES'`); // Получаем картинки из инстаграма
    res.locals.instImages = instImageRows;

  } catch(e) {
    console.error(e);
  }

  next();
}
