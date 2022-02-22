const { db } = require('../utils/db.js');

module.exports = async (req, res, next) => {
  try {
    const pageName = req.originalUrl.split('/')[1] === '' ? 'homepage' : req.originalUrl.split('/')[1]; // Вычисляем название текущей страницы (изначально передаётся в body class).

    res.locals.year = new Date().getFullYear(); // Получаем текущий год
    res.locals.userHolderId = 1; // ID холдера хранящего пользователей
    res.locals.productHolderId = 2; // ID холдера хранящего товары
    res.locals.advantagesHolderId = 3; // ID холдера "преимущества"
    res.locals.page = pageName; // Здесь даём доступ к переменной page в шаблонах hbs и в любом middleware
    req.app.locals.page = pageName; // Здесь переменная page доступна во всём проекте (кроме шаблонов hbs), через конструкцию app.locals.page или в middleware через req.app.locals.page

    const [instImageRows] = await db.execute(`SELECT image_img_image FROM image WHERE image_hld_holder = 6 AND IFNULL(image_enm_active, 'NO') = 'YES'`); // Получаем картинки из инстаграма
    res.locals.instImages = instImageRows;
  } catch (e) {
    console.error(e);
  }

  next();
}
