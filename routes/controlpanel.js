const Router = require('express');
const router = Router();
const multer = require('multer');

const db = require('../utils/db.js');
const Holder = require('../models/holderModel');
const Folder = require('../models/folderModel');
const Product = require('../models/productModel');
const Image = require('../models/imageModel');
const User = require('../models/userModel');

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const uploadImage = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'images/upload');
    },
    filename(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
    if(allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

router.get('/', async (req, res) => {
  const  hrstart = process.hrtime();

  try {
    let [holderRows] = await Holder.select();
    holderRows = holderRows.map(item => Object.assign(item, {jsonData: JSON.stringify(item)})); // Добавляем новое свойство jsonData с данными в JSON формате

    let [folderRows] = await Folder.select();
    folderRows = folderRows.map(item => Object.assign(item, {jsonData: JSON.stringify(item)}));

    let [productRows] = await Product.select();
    productRows = productRows.map(item => Object.assign(item, {jsonData: JSON.stringify(item)}));

    let [imageRows] = await Image.select();
    imageRows = imageRows.map(item => Object.assign(item, {jsonData: JSON.stringify(item)}));

    let [userRows] = await User.select();
    userRows = userRows.map(item => Object.assign(item, {jsonData: JSON.stringify(item)}));

    res.render('controlpanel', {
      holderRows,
      folderRows,
      productRows,
      imageRows,
      userRows,
      envVar: process.env.NODE_ENV
    });
  } catch(e) {
    console.error(e);
  }

  res.locals.resultTime = (process.hrtime(hrstart)[1] / 1000000000).toFixed(3); // Затраченное на рендеринг время в секундах
  // console.log(hrend);
});

router.delete('/', async (req, res) => {
  try {
    let result;

    switch(req.body.moduleTable) {
      case 'system_holder' : result = await Holder.delete(req.body); break;
      case 'folder'        : result = await Folder.delete(req.body); break;
      case 'product'       : result = await Product.delete(req.body); break;
      case 'image'         : result = await Image.delete(req.body); break;
      case 'user'          : result = await User.delete(req.body); break;
      default              : result = 'Ошибка выбора таблицы';
    }

    if(result[0].warningStatus == 0) {
      res.json({message: '<i class="icon-check"></i> Запись удалена', success: true});
    } else {
      res.json({message: result, success: false});
    }
  } catch(e) {
    console.error(e);

    res.json({message: JSON.stringify(e), success: false});
  }
});

router.post('/', uploadImage.single('image'), async (req, res) => {
  try {
    let result;

    switch(req.body.moduleTable) {
      case 'system_holder':
        result = await Holder.insert(req.body);
        break;

      case 'folder':
        if(req.file) req.body.folder_img_image = req.file.path; // Записываем в body путь к загруженному изображению
        result = await Folder.insert(req.body);
        break;

      case 'product':
        if(req.file) req.body.product_img_image = req.file.path; // Записываем в body путь к загруженному изображению
        result = await Product.insert(req.body);
        break;

      case 'image':
        if(req.file) {
          console.log(req.file);
          req.body.image_img_image = req.file.path; // В body из req.file записываем путь к картинке, чтобы использовать его в дальнейшем для записи в базу
          if(!req.body.image_chr_name) req.body.image_chr_name = req.file.filename;
        }
        result = await Image.insert(req.body);
        break;

      default:
        result = 'Ошибка выбора таблицы';
    }

    if(result[0].warningStatus == 0) {
      res.json({message: '<i class="icon-check"></i> Запись добавлена в базу', success: true});
    } else {
      res.json({message: result, success: false});
    }
  } catch(e) {
    console.log(e);

    res.json({message: JSON.stringify(e), success: false});
  }
});


router.put('/', uploadImage.single('image'), async (req, res) => {
  try {
    let result;

    switch(req.body.moduleTable) {
      case 'system_holder':
        result = await Holder.update(req.body);
        break;

      case 'folder':
        if(req.file) req.body.folder_img_image = req.file.path; // Записываем в body путь к загруженному изображению
        result = await Folder.update(req.body);
        break;

      case 'product':
        if(req.file) req.body.product_img_image = req.file.path; // Записываем в body путь к загруженному изображению
        result = await Product.update(req.body);
        break;

      case 'image':
        if(req.file) {
          req.body.image_img_image = req.file.path; // В body из req.file записываем путь к картинке, чтобы использовать его в дальнейшем для записи в базу
          // if(!req.body.image_chr_name) req.body.image_chr_name = req.file.filename;
        }
        result = await Image.update(req.body);
        break;

      default:
        result = 'Ошибка выбора таблицы';
    }

    if(result[0].warningStatus == 0) {
      res.json({message: '<i class="icon-check"></i> Запись успешно обновлена', success: true});
    } else {
      res.json({message: result, success: false});
    }
  } catch(e) {
    console.error(e);

    res.json({message: JSON.stringify(e), success: false});
  }
});

module.exports = router;
