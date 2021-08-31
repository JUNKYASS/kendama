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
const {validationResult} = require('express-validator');
const {regValidators} = require('../utils/validators');

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

router.get('/', (req, res) => {
  if(res.locals.isAuth) {
    res.redirect('/profile')
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/login', (req, res) => {
  res.render('login', {

  });
});

router.get('/reg', (req, res) => {
  res.render('reg', {

  });
});

router.post('/reg', regValidators, async (req, res) => {
  try {
    const {errors} = await validationResult(req);
    if(errors.length > 0) res.json({success: false, message: errors.map(i => i.msg).join(', ')});

    req.body.hashedPass = await bcrypt.hash(req.body.user_chr_pass, 10); // Шифруем пароль, 10 это длина "соли", чем больше, тем лучше (но медленней), можно использовать строку, использует шифр Blowfish
    req.body.holder = res.locals.userHolderId;

    const result = await User.insert(req.body);

    if(!result.err) {
      transporter.sendMail(userRegEmail(req.body.user_chr_email), (error, info) => { // Отправляем пользователю письмо об успешной регистрации
        if(error) console.error(error);

        transporter.sendMail(adminRegEmail, (error, info) => { // Отправляем админу пиьсмо о том, что зарегистрировался новый пользователь
          if(error) console.error(error);
        });
      });



      res.json({message: `<i class="icon-check"></i> Регистрация прошла успешно, загляните на почту!`, success: true});
    } else {
      res.json({message: result, success: false});
    }
  } catch (e) {
    console.error(e);

    res.status(500);
  }
});

module.exports = router;
