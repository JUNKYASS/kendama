const Router = require('express');
const router = Router();
const User = require('../models/userModel');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const userRegEmail = require('../emails/userReg');
const adminRegEmail = require('../emails/adminReg');
const keys = require('../keys');

// Валидация
const { validationResult } = require('express-validator');
const { regValidators, loginValidators } = require('../utils/validators');

// const transporter = nodemailer.createTransport(sendgrid({
//   auth: { api_key: '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' }
// }));
const transporter = nodemailer.createTransport({
  service: 'Yandex',
  auth: {
    user: keys.ROOT_EMAIL,
    pass: keys.ROOT_EMAIL_PASS
  }
});

const mailData = {

};

// Страница /auth/
// Редирект если авторизованы, на страницу профиля, либо на страницу логина
router.get('/', (req, res) => {
  if (res.locals.isAuth) {
    res.redirect('/profile')
  } else {
    res.redirect('/auth/login');
  }
});

// Страница логина
router.get('/login', (req, res) => {
  res.render('login');
});

// START HERE, дописать функционал обработки логина на сайте
// Обработка логина
router.post('/login', loginValidators, async (req, res) => {
  const { user_chr_email, user_chr_pass } = req.body;

  const { errors } = validationResult(req);

  if (errors.length > 0) {
    const message = `${errors.map(i => i.msg).join(', ')} <br><a href="/auth/login" class="return-link">Ввести данные снова</a>`; // Собираем сообщение об ошибке добавляя туда ошибки из валидации полей

    res.json({ success: false, message: message });
  }

  const [candidate] = await User.selectByEmail(user_chr_email); // Ищем пользователя с email, указанным при авторизации
  const compareResult = await bcrypt.compare(user_chr_pass, candidate[0].user_chr_pass); // Проверяем правильно ли указан пароль

  if(candidate[0] && compareResult) {
    if(compareResult) { // Если пароли совпадают
      req.session.isLogged = true;
      req.session.user = candidate[0];
      req.session.save(async (err) => {
        if(err) {
          throw err;
        } else {
          res.json({ success: true, message: 'Авторизация прошла успешно! <br><a href="/profile" class="return-link">Перейти в профиль</a>' });
        }
      });
    } else { // Если не совпадают
      res.json({ success: false, message: 'Почта или пароль введены неверно. <br><a href="/auth/login" class="return-link">Ввести данные снова</a>' });
    }
  }
});

// Страница регистрации
router.get('/reg', (req, res) => {
  res.render('reg');
});

// Обработка регистрации
router.post('/reg', regValidators, async (req, res) => {
  try {
    const { errors } = await validationResult(req);
    if (errors.length > 0) {
      const message = `${errors.map(i => i.msg).join(', ')} 
        <br>
        <a href="/auth/reg" class="return-to-form-btn"> Ввести данные снова</a>
      `;

      res.json({ success: false, message: message });
    }

    req.body.hashedPass = await bcrypt.hash(req.body.user_chr_pass, 10); // Шифруем пароль, 10 это длина "соли", чем больше, тем лучше (но медленней), можно использовать строку, использует шифр Blowfish
    req.body.holder = res.locals.userHolderId;

    const result = await User.insert(req.body);

    if (!result.err) {
      transporter.sendMail(userRegEmail(req.body.user_chr_email), (error, info) => { // Отправляем пользователю письмо об успешной регистрации
        if (error) console.error(error);

        transporter.sendMail(adminRegEmail, (error, info) => { // Отправляем админу пиьсмо о том, что зарегистрировался новый пользователь
          if (error) console.error(error);
        });
      });

      res.json({ message: `<i class="icon-check"></i> Регистрация прошла успешно, загляните на почту!`, success: true });
    } else {
      const msg = result.err ? result.err : result;

      res.status(500).json({ message: msg, success: false });
    }
  } catch (e) {
    console.error(e);

    res.status(500);
  }
});

module.exports = router;
