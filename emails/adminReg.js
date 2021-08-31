const keys = require('../keys');

module.exports = {
  from: keys.ROOT_EMAIL,  // sender address
  to: keys.ADMIN_EMAILS,   // list of receivers
  subject: 'Новая регистрация на сайте | KENDAMA FOR LIFE',
  html: `<b>Новая регистрация на сайте</b>`,
}
