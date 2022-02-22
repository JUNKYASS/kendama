const Router = require('express');
const router = Router();

const List = require('../models/listModel');
const Products = require('../models/productModel');
const News = require('../models/newsModel');

router.get('/', async (req, res) => {
  const [productsBestOffer] = await Products.selectBestOffer(); // Вытаскиваем товары best offer
  const [productsMostFamous] = await Products.selectMostFamous(); // Вытаскиваем товары most famous
  const [advantagesVertical] = await List.selectCustom(`SELECT list_chr_name, list_txt_text, list_chr_info1 FROM list WHERE list_uid_id IN(7, 11, 12)`); // Вытаскиваем записи из таблицы List, блок "преимущества" (вертикальный)
  const [advantagesHorizontal] = await List.selectCustom(`SELECT list_chr_name, list_txt_text, list_chr_info1 FROM list WHERE list_uid_id IN(8, 9, 10)`); // Вытаскиваем записи из таблицы List, блок "преимущества" (горизонтальный)
  const [homepageNews] = await News.selectCustom(`SELECT news_chr_name, news_chr_url, SUBSTRING(news_txt_text, 1, 80) AS news_txt_text, news_img_image1 FROM news WHERE news_hld_holder = 4 ORDER BY news_uid_id DESC LIMIT 2`); // Новости на главной странице
  const [homepageReviews] = await List.selectCustom(`SELECT list_chr_name, IF(CHAR_LENGTH(list_txt_text) > 230, CONCAT(SUBSTRING(list_txt_text, 1, 230), '...'), list_txt_text) AS list_txt_text, list_img_image FROM list WHERE list_hld_holder = 5 ORDER BY list_ind_index LIMIT 3`);

  productsBestOffer.map((item, i) => { // Добавляем для каждой записи поле rowNumber которая хранит инддекс
    item.rowNumber = ++i;
    return item;
  });

  productsMostFamous.map((item, i) => {
    item.rowNumber = ++i;
    return item;
  });

  advantagesVertical.map((item, i) => {
    item.rowNumber = ++i;
    return item;
  });

  advantagesHorizontal.map((item, i) => {
    item.rowNumber = ++i;
    return item;
  });


  res.render('homepage', {
    productsBestOffer,
    productsMostFamous,
    homepageReviews,
    advantagesVertical,
    homepageNews,
    advantagesHorizontal
  });
});

module.exports = router;
