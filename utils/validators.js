const {body} = require('express-validator');
const User = require('../models/userModel');

exports.regValidators = [
  body('user_chr_email').isEmail().withMessage('Введите корректный email').custom(async (value, {req}) => {
    try {
      // Проверяем существует ли уже такой пользователь
      const [user] = await User.selectByEmail(value);

      if(user.length > 0) return Promise.reject('Пользователь с таким email уже существует');
    } catch(e) {
      console.error(e);
    }
  }).normalizeEmail(),
  body('user_chr_pass', 'Пароль должен быть минимум 6 символов').isLength({min: 6, max: 56}).isAlphanumeric().trim(),
  body('user_chr_repass').custom((value, {req}) => { // Кастомная проверка на совпадение паролей
    if(value !== req.body.user_chr_pass) {
      throw new Error('Пароли должны совпадать')
    }

    return true;
  })
];

exports.loginValidators = [
  body('user_chr_email', 'Введите корректный email').isEmail(),
  body('user_chr_pass', 'Пароль должен быть минимум 6 символов').isLength({min: 6, max: 56}).isAlphanumeric().trim(),
];
