const keys = require('../keys');

module.exports = function(toEmail) {
  return {
    from: keys.ROOT_EMAIL,  // sender address
    to: toEmail,   // list of receivers
    subject: 'Регистрация на сайте | KENDAMA FOR LIFE',
    html: `<b>Вы зарегистрировались на сайте</b>`,
  }
}
