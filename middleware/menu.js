// Файл генерации объектов меню. Необходим для доступа к этим меню из HTML шаблонов через @root...
module.exports = (req, res, next) => {
  res.locals.mainMenu = [
    {
      name: "Главная",
      url: '/',
      isHighlighted: '',
      icon: 'home',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Каталог",
      url: '/catalog',
      isHighlighted: 'highlight',
      icon: 'store',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "О компании",
      url: '/about',
      isHighlighted: '',
      icon: 'assignment',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Новости",
      url: '/news',
      isHighlighted: '',
      icon: 'news',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Доставка и оплата",
      url: '/deliveryandpayment',
      icon: 'dropbox',
      isHighlighted: '',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Контакты",
      url: '/contacts',
      icon: 'textsms',
      isHighlighted: '',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
  ];

  res.locals.socialsMenu = [
    {
      name: "Инстаграм",
      url: 'https://www.instagram.com/kendama__forlife',
      isHighlighted: '',
      icon: '/images/iconfinder_instagram_2142645.svg',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Вконтакте",
      url: 'https://vk.com/easytolose',
      isHighlighted: '',
      icon: '/images/iconfinder_vk_2142630.svg',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Твиттер",
      url: 'https://twitter.com/KendamaFORLIFE',
      isHighlighted: '',
      icon: '/images/iconfinder_twitter_2142629.svg',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
  ];

  res.locals.policiesMenu = [
    {
      name: "Политика конфиденциальности",
      url: '/policy',
      isHighlighted: '',
      icon: '',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Обработка ПД",
      url: '/consent',
      isHighlighted: '',
      icon: '',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Использование cookies",
      url: '/cookies',
      isHighlighted: '',
      icon: '',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
    {
      name: "Польз. соглашение",
      url: '/agreement',
      isHighlighted: '',
      icon: '',
      isActive: function() {
        return req.originalUrl == this.url ? 'active' : '';
      }
    },
  ]


  next();
}
