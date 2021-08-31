const Product = require('../models/productModel');
const Folder = require('../models/folderModel');
const Holder = require('../models/holderModel');
const Image = require('../models/imageModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Delivery = require('../models/deliveryModel');
const Payment = require('../models/paymentModel');
const News = require('../models/newsModel');

module.exports = async () => {
  // Генерируем таблицы в БД, если их нет
  const deliveryModel = await new Delivery();
  const paymentModel = await new Payment();
  const holderModel = await new Holder();
  const folderModel = await new Folder();
  const productModel = await new Product();
  const imageModel = await new Image();
  const userModel = await new User();
  const orderModel = await new Order();
  const cartModel = await new Cart();
  const newsModel = await new News();

  console.log(`
    ${productModel}
    ${folderModel}
    ${holderModel}
    ${imageModel}
    ${userModel}
    ${cartModel}
    ${orderModel}
    ${deliveryModel}
    ${paymentModel}
    ${newsModel}
  `);
}
