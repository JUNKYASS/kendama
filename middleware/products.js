// Файл генерации объектов товаров. Необходим для доступа к товарам из HTML шаблонов через @root...

const productsBestOffer = (req, res, next) => {
  return {
    // Здесь нужно вытащить товары из базы и сложить их в объект, для этого:
    // 1. Редактировать структуру таблицы product - добавить поля product_enm_hot, product_enm_new
    // 2. Редактировать запрос select в модели productModel.js
    // 3. Создать отдельный запрос на получение товаров "best offer"
    // 4. Добавить товары в базу данных
  };
};

module.exports = {
  productsBestOffer
}