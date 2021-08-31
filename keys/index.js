require('dotenv').config(); // Здесь хранятся данные, попадающие в process

module.exports = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY, // API KEY сервиса отправки писем (не используется)
  ROOT_EMAIL: process.env.ROOT_EMAIL, // С этой почты уходят все письма, указывается в поле "FROM"
  ROOT_EMAIL_PASS: process.env.ROOT_EMAIL_PASS,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS, // Это почты админов, им приходят сообщения "уведомления" о том, что кто-то что-то сделал
  DB_CONNLIMIT: process.env.DB_CONNLIMIT,
  DB_HOST: process.env.NODE_ENV === "production" ? process.env.DB_HOST : process.env.DB_HOST_REMOTE, // NODE_ENV задаётся при запуске сервера в package.json
  DB_USERNAME: process.env.NODE_ENV === "production" ? process.env.DB_USERNAME : process.env.DB_USER_REMOTE,
  DB_PASSWORD: process.env.NODE_ENV === "production" ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_REMOTE,
  DB_NAME: process.env.DB_NAME,
}
