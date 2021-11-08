const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const homepageRouter = require('./routes/homepage');
const controlpanelRouter = require('./routes/controlpanel');
const catalogRouter = require('./routes/catalog');
const aboutRouter = require('./routes/about');
const newsRouter = require('./routes/news');
const deliveryandpaymentRouter = require('./routes/deliveryandpayment');
const contactsRouter = require('./routes/contacts');
const cartRouter = require('./routes/cart');
const authRouter = require('./routes/auth');

// const { getBestOfferProducts } = require('./middleware/products');
const variableMiddleware = require('./middleware/variable');
const menuMiddleware = require('./middleware/menu');
const dbTablesCreate = require('./utils/db_tables_create');
const keys = require('./keys');
const hbsHelpers = require('./utils/hbs-helpers');
const { sessionStore } = require('./utils/db');

// const hrstart = process.hrtime();

const app = express();
const PORT = process.env.PORT || 3000;
const hbs = exphbs.create({
  layoutsDir: 'views/layouts',
  defaultLayout: 'primaryLayout',
  extname: 'hbs', 
  helpers: hbsHelpers, // Регистрируем файл с хелперами
});

// System middlewares
app.use('/images', express.static(path.join(__dirname, 'images'))); // Делаем папку с картинками статической, чтобы к ней был доступ извне
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({ // Задаём и настраиваем сессии
  secret: keys.COOKIES_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore // MysqlStore
}));
// System middlewares //

// HBS and Views
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
// HBS and Views //

// Middlewares
app.use(variableMiddleware);
app.use(menuMiddleware);
// app.use(getBestOfferProducts);
// Middlewares //

// Routes
app.use('/', homepageRouter);
app.use('/catalog', catalogRouter);
app.use('/about', aboutRouter);
app.use('/news', newsRouter);
app.use('/deliveryandpayment', deliveryandpaymentRouter);
app.use('/contacts', contactsRouter);
app.use('/cart', cartRouter);
app.use('/controlpanel', controlpanelRouter);
app.use('/auth', authRouter);
// Routes //

// const hrend = (process.hrtime(hrstart)[1] / 1000000000).toFixed(3); // Затраченное на рендеринг время в секундах
// console.log(hrend);

(async function start() {
  await dbTablesCreate(); // Создаём таблицы в БД если ещё не созданы и сообщаем об этом в консоли

  app.listen(PORT, (err) => {
    if(err) console.error(err);


    console.log(`Server has been started on PORT ${PORT}...`);
  });
})();
