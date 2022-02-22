// Файл генерации объектов товаров. Необходим для доступа к товарам из HTML шаблонов через @root...
const Products = require('../models/productModel');

const getProducts = async (req, res, next) => {
  const [products] = await Products.select();
  res.locals.products = products;

  next()
};

const getBestOfferProducts = async (req, res, next) => {
  const [products] = await Products.selectBestOffer();

  res.locals.bestOfferProducts = products.map((item, i) => {
    item.rowNumber = ++i; // Модифицируем товары
    return item;
  });

  next();
};

module.exports = {
  getProducts,
  getBestOfferProducts,
}