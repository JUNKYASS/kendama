/*
 * Main JS file, easytolose.ru
 *
 * Copyright (c) 2020 Mikhylichenko Ruslan, plarson.ru
 *
 * Date: 02-06-2020
 *
 */
/**
 * Стандартные обработчики REST.API
 */
Faze.on('submit', '[data-faze-restapi-form]', (event, formNode) => {
  event.preventDefault();

  Faze.REST.formSubmit(formNode);
}); /* Стандартные обработчики REST.API */

const parallax = (e, farEl, midEl, closeEl) => {
  // Центр окна пользователя;
  let winCenter = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  let mouse = {
    x: e.clientX,
    y: e.clientY,
  };

  let depth = {
    slow: (50 - (mouse.x - winCenter.x) * -0.002) + '% ' + (50 - (mouse.y - winCenter.y) * -0.006) + '%',
    middle: (50 - (mouse.x - winCenter.x) * -0.038) + '% ' + (50 - (mouse.y - winCenter.y) * 0.020) + '%',
    fast: (50 - (mouse.x - winCenter.x) * -0.036) + '% ' + (50 - (mouse.y - winCenter.y) * 0.064) + '%',
  }

  // const pos = depth.slow + ', ' +  depth.middle + ', ' + depth.fast;

  if(farEl) {
    farEl.style.backgroundPosition = depth.slow;
  }

  if(midEl) {
    midEl.style.backgroundPosition = depth.middle;
  }

  if(closeEl) {
    closeEl.style.backgroundPosition = depth.middle;
  }
}

Faze.add({
  pluginName: "orderCreate",
  condition: document.querySelectorAll('.js-btn-cart-buy').length > 0,
  callback: () => {
    const buyCartBtn = document.querySelector('.js-btn-cart-buy');
    const formNode = document.querySelector('.cart-order');

    buyCartBtn.addEventListener('click', () => {
      formNode.submit();
    });
  }
});

// Faze.add({
//   pluginName: "ballMoving",
//   condition: document.querySelectorAll('.homepage-banner').length > 0,
//   callback: () => {
//     const homepageHeadline = document.querySelector('.homepage-banner .info .headline-block');
//
//     const movingImg = document.querySelector('.moving-part');
//     var rect = movingImg.getBoundingClientRect();
//     let img_center_x = movingImg.offsetWidth / 2;
//     let img_center_y = movingImg.offsetHeight / 2;
//     let point_x, point_y = 0;
//     let allowMove = false;
//
//     observer = new IntersectionObserver((entries)=>{
//       entries.forEach((entry, i) => {
//         if(entry.isIntersecting) {
//           allowMove = true;
//         } else {
//           allowMove = false;
//         }
//       });
//     });
//
//     observer.observe(homepageHeadline);
//
//     Faze.on('mousemove', 'body', (e) => {
//       if(allowMove) {
//         point_x = e.pageX * 0.05 - img_center_x;
//         point_y = e.pageY * 0.05 - img_center_y;
//
//         movingImg.style.transform = 'translate3d(' + point_x + 'px, ' + point_y + 'px, 0px)';
//       }
//     });
//   }
// });

Faze.add({
  pluginName: "footerParallax",
  condition: document.querySelectorAll('.js-footer-parallax').length > 0,
  callback: () => {
    const footerNode = document.querySelector('footer');
    const parallaxContainerNode = document.querySelector('.js-footer-parallax');
    const parallaxFarImgNode = parallaxContainerNode.querySelector('.img.far');
    const parallaxCloseImgNode = parallaxContainerNode.querySelector('.img.close');
    var allowMove = false;

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if(entry.isIntersecting) {
          allowMove = true;
        } else {
          allowMove = false;
        }
      });
    });

    observer.observe(footerNode);

    //parallaxImgNode.style = "transform: translateY(" + ((parallaxImgNode.getBoundingClientRect().top - (parallaxImgNode.offsetHeight / 2)) * 0.2) + "px);";


    parallaxContainerNode.classList.add('ready');

    document.addEventListener("mousemove", (e) => {
      // чтобы работал параллакс необходимо раскомментировать
      // allowMove ? parallax(e, parallaxFarImgNode, 0, parallaxCloseImgNode) : true;
    });
  }
});


function getAverageRGB(img) {
  var blockSize = 5, // only visit every 5 pixels
      defaultRGB = {
        r:0,
        g:0,
        b:0
      }, // for non-supporting envs
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height,
      i = -4,
      length,
      rgb = {
        r:0,
        g:0,
        b:0,
        color:'black'
      },
      count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
  width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

  context.drawImage(img, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch(e) {
    /* security error, img on diff domain */
    return defaultRGB;
  }

  length = data.data.length;

  while ( (i += blockSize * 4) < length ) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i+1];
      rgb.b += data.data[i+2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r/count);
  rgb.g = ~~(rgb.g/count);
  rgb.b = ~~(rgb.b/count);

  rgb.color = ((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000) > 127  ? 'black' : 'white'; // Цвет текста в зависимости от полученного усреднённого цвета
  // rgb.color = (rgb.r > 127 || rgb.g > 127 || rgb.b > 127) ? 'black' : 'white'; // Цвет текста в зависимости от полученного усреднённого цвета

  return rgb;
}

Faze.add({
  pluginName: "newsAppearance",
  condition: document.querySelectorAll('.advantages-and-news .news').length > 0,
  callback: () => {
    const newsNode = document.querySelector('.advantages-and-news .news');
    const newsItemNodes = newsNode.querySelectorAll('.items .item');

    // newsItemNodes.forEach((itemNode, i) => {
    //   const img = itemNode.querySelector('img');
    //   const result = getAverageRGB(img);
    //
    //   itemNode.style.backgroundColor = 'rgb('+result.r+','+result.g+','+result.b+')';
    //   itemNode.style.color = result.color;
    //   // itemNode.querySelector('.image').style.border = '1px solid ' + result.color;
    //
    //   itemNode.querySelector('.gradient-element').style.backgroundImage = 'linear-gradient(to bottom, rgba('+result.r+','+result.g+','+result.b+', 0), rgba('+result.r+','+result.g+','+result.b+', 1))';
    // });
  }
});

/**
 * Показ/Скрытие мобильного меню
 */
Faze.add({
  pluginName: 'mobileMenu',
  condition: document.querySelectorAll('.js-mobile-navigation').length > 0,
  callback: () => {
    const menuOpenerBtn = document.querySelector('.js-mobile-navigation .js-menu'); // DOM эл-т кнопки открытия меню
    const menuNode = document.querySelector('.js-mobile-navigation'); // DOM эл-т меню
    let scrollBefore = 0;

    menuOpenerBtn.addEventListener('click', (event) => {
      if (menuOpenerBtn.classList.contains('active')) {
        menuOpenerBtn.classList.remove('active');
        menuNode.classList.remove('active');
        document.body.classList.remove('menuOpened');
      } else {
        menuOpenerBtn.classList.add('active');
        menuNode.classList.add('active');
        document.body.classList.add('menuOpened');
      }
    });
    // var detecting, touch, x, y;
    //
    // window.addEventListener('touchstart', (e) => {
    //   if(e.touches.length != 1 || started) {
    //   	return;
    //   }
    //
    //   detecting = true;
    //
    //   touch = e.changedTouches[0];
    //   x = touch.pageX;
    //   y = touch.pageY;
    // });

    window.addEventListener('scroll', (event) => {
      const scrolled = window.scrollY;

      if(scrollBefore > scrolled){
        scrollBefore = scrolled;

        menuNode.classList.remove('active');
      } else {
          scrollBefore = scrolled;

          menuNode.classList.add('active');
      }
    });
  }
}); /* Показ/Скрытие мобильного меню */

/**
 * Общая карусель
 */
Faze.add({
  pluginName: 'commonCarousel',
  condition: document.querySelectorAll('.js-common-carousel-holder').length > 0,
  callback: () => {
    document.querySelectorAll('.js-common-carousel-holder').forEach((carouselHolderNode) => {
      const carouselNode = carouselHolderNode.querySelector('.js-common-carousel'); // DOM элемент товаров для карусели

      const statusBarNode = carouselHolderNode.querySelector('.status-bar'); // DOM элементы стрелок влево
      const carriageNode = statusBarNode.querySelector('.carriage'); // DOM элементы стрелок влево

      const arrowPrevNode = carouselHolderNode.querySelector('.js-arrowPrev'); // DOM элементы стрелок влево
      const arrowNextNode = carouselHolderNode.querySelector('.js-arrowNext'); // DOM элементы стрелок вправо
      const arrowNodes = carouselHolderNode.querySelectorAll('.carousel-arrow');

      const coverElementNode = carouselHolderNode.querySelector('.cover-element'); // DOM элемент "слайдящего" блока

      if(carouselNode) {
        const fazeCarousel = new Faze.Carousel(carouselNode, {
          autoplay: false,
          arrows: false,
          pages: false,
          counter: carouselNode.dataset.counter || false,
          // amountPerSlide: group,
          useSlideFullSize: true,
          animation: {
            type: 'slide',
            time: 800,
            direction: 'horizontal',
          },
          callbacks: {
            created: () => {
              carouselHolderNode.classList.add('carousel-enabled'); // Проставляем класс, показывающий что карусель инициализировалась

              const fazeCarouselHolderNode = carouselNode.querySelector('.faze-carousel-holder');

              const slidesQuantity = carouselHolderNode.querySelectorAll('.faze-item').length;
              const carriageWidth = 100 / slidesQuantity;
              carriageNode.style.width = carriageWidth + '%';

              if (arrowNextNode) { // Бинд стрелки для листания слайдов вправо
                arrowNextNode.addEventListener('click', (event) => {
                  event.preventDefault();

                  fazeCarousel.next();

                  // Перемещаем каретку
                  const i = parseInt(carouselNode.querySelector('.faze-item:first-child').dataset.index);
                  const index = i == slidesQuantity ? 0 : i; // Если активный слайд последний, то перекидываем индекс на 0
                  carriageNode.style.left = (carriageWidth * index) + '%';

                  // i == slidesQuantity - 1 ? carouselNode.classList.add('last') : carouselNode.classList.remove('last');
                });
              }

              if (arrowPrevNode) { // Бинд стрелки для листания слайдов влево
                arrowPrevNode.addEventListener('click', (event) => {
                  event.preventDefault();

                  fazeCarousel.prev();

                  // Перемещаем каретку
                  const i = parseInt(carouselNode.querySelector('.faze-item:first-child').dataset.index);
                  const index = i - 1; // Если активный слайд последний, то перекидываем индекс на 0
                  carriageNode.style.left = (carriageWidth * index) + '%';

                  // i == slidesQuantity ? carouselNode.classList.add('last') : carouselNode.classList.remove('last');
                });
              }
            },
          },
        });
      }
    });
  },
}); /* Общая карусель */

/* Работа с карточкой товара в ЛИСТИНГЕ */
Faze.add({
  pluginName: 'Product',
  condition: document.querySelectorAll('.js-product-item').length > 0,
  callback: () => {
    const productsNodes = document.querySelectorAll('.js-product-item');

    productsNodes.forEach((itemNode, i) => {
      const mainImageNode = itemNode.querySelector('.js-image');
      const alternativeImageNode = itemNode.querySelector('.js-alternative-image');

      // После загрузки всех изображений проставляем им класс для отображения товара
      mainImageNode.onload = () => itemNode.classList.add('loaded');
      alternativeImageNode.onload = () => alternativeImageNode.classList.add('loaded');

      // Подгружаем картинке товара путь в src из дататтрибута
      mainImageNode.src = mainImageNode.dataset.photoSrc;
      alternativeImageNode.src = alternativeImageNode.dataset.photoSrc;

      if(alternativeImageNode.dataset.photoSrc) {
        itemNode.addEventListener('mouseover', () => {
          itemNode.classList.toggle('hovered');
        });

        itemNode.addEventListener('mouseout', () => {
          itemNode.classList.toggle('hovered');
        });
      }
    });
  }
}); /* Работа с карточкой товара в ЛИСТИНГЕ */

/* Блок фото из инстаграма */
Faze.add({
  pluginName: 'instagramPhotos',
  condition: document.querySelectorAll('.js-instagram').length > 0,
  callback: () => {
    // const socialsNode = document.querySelector('.js-homepage-socials');
    const instPhotosContainerNode = document.querySelector('.js-instagram'); // Инстаграм
    const instPhotosNode = instPhotosContainerNode.querySelector('.js-photos');

    const instData = {
      access_token: 'IGQVJVRTRkNklXY21MMVZAJZA0NKbmY5b3JNUVMtRGladTZAWU0x6Q3BVY1lYWnpQa01NY185MnI3Wmt4WnJiOG83QUFqcDB4ZAU1JYkhvZAm5FZADhjYUp5Q09CbENsY2oyWEdKTXJWWjJ3',
      get_longlived_token_url: 'https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={appsecret}&access_token={shorlived_token}', // Чтобы получить долгоживущий токен (на 60 дней) нужно перейти по этому урлу подставив секрет приложения и короткоживущий токен, который можно получить в приложении в facebook'е
      refresh_longlived_token_url: 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={longlived_token}', // Долгоживущий токен нужно обновлять (он действует всего 60 дней), для этого нужно обратиться к специально урлу и передать долгоживущий токен, полеченный выше
      secret: '826539c284dad8529414e6dcbb808b53', // Секрет приложения instagram, можно посмотреть в настройких basic display приложения
      user_id: '4646519870',
      limit: 6,
      url: function() { // Урл по которому получаем фото от инстаграма
        return 'https://graph.instagram.com/me/media?fields=media_url&limit=' + this.limit + '&access_token=' + this.access_token;
      },
    };

    // const vkReviewsContainerNode = socialsNode.querySelector('.js-homepage-vk'); // ВКонтакте
    // const vkReviewsNode = vkReviewsContainerNode.querySelector('.js-vk-reviews');

    const vkData = {
      access_token: '109e5bf940450b30404d1db9dcc5491d2faf72c1a4f9dd5c5a59b9036396a3de44fe87fcec76d0f14b2ad',
      service_access_token: 'e140aca2e140aca2e140aca219e13399daee140e140aca2be5d64d9708bc6dcbef08011',
      secret: 'Q2cI8pcGQgVyg4SrMEO2',
      app_id: '7550328',
      limit: 4,
      url: function() {
        return 'https://api.vk.com/method/board.getComments?group_id=151220089&topic_id=36243482&count=' + this.limit + '&sort=desc&start_comment_id=14&access_token=' + this.access_token + '&v=5.120';
      },
    };

    /**
     * Работа с Инстаграм
     */
    // fetch(instData.url()) // Делаем запрос к инстаграму, чтоб получить последние фото
    //   .then(res => res.json())
    //   .then((data) => {
    //     if(data) {
    //       data.data.forEach((itemNode, i) => { // Проходимся по полученным фоткам
    //         const photoNode = document.createElement('a'); // Создаём элемент с фотографией, навешиваем класс и вставляем само фото
    //         photoNode.classList.add('photo');
    //         photoNode.href = "https://instagram.com/kendama__forlife";
    //         photoNode.target = "_blank";
    //         photoNode.innerHTML = '<img src="' + itemNode.media_url + '" alt="Фото кендамы | Kendama FOR LIFE в инстаграм">';
    //
    //         instPhotosNode.append(photoNode);
    //       });
    //     } else { // Если не удалось получить фото, то скрываем блок с фотографиями
    //       instPhotosContainerNode.classList.add('hide');
    //     }
    // });

    /**
     * Работа с ВКонтакте
     */
    // VK.init({
    //   apiId: vkData.app_id
    // });
    //
    // VK.Api.call('board.getComments', { // ПОЛУЧАЕМ ВСЕ ОТЗЫВЫ
    //   group_id: '151220089',
    //   topic_id: '36243482',
    //   count: vkData.limit,
    //   //sort: 'desc',
    //   start_comment_id: '14',
    //   access_token: vkData.access_token,
    //   v: "5.73"
    // }, function(commentsResult) {
    //   if(commentsResult.response) {
    //     const reviews = commentsResult.response.items; // Сохраняем отзывы
    //     var user_ids = ''; // Здесь будем хранить IDшники пользоватлей, оставивших отзывы
    //
    //     reviews.map(item => user_ids += item.from_id + ','); // Создаём строку из ID пользователей, чтобы отправить запрос ниже и получить инфу об этих пользователях
    //
    //     VK.Api.call('users.get', {user_ids: user_ids, fields: 'photo_100', v:"5.73"}, function(usersResult) { // ПОЛУЧАЕМ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ, ОСТАВИВШИХ ОТЗЫВЫ
    //       if(usersResult.response) {
    //         const users = usersResult.response; // Сохраняем пользователей, оставивших отзывы
    //
    //         // Для каждого отзыва в массиве пользователей ищем пользователя с ID равным ID того, кто оставил отзыв и Сохраняем данные об этом пользователей в объект с отзывом
    //         reviews.forEach((itemNode) => {
    //           itemNode.user = users.find(user => user.id == itemNode.from_id);
    //
    //           const reviewNode = document.createElement('div');
    //           const reviewUserPhotoNode = document.createElement('img');
    //           const reviewUserNameNode = document.createElement('div');
    //           const reviewUserTextNode = document.createElement('div');
    //
    //           reviewNode.classList.add('review');
    //           reviewUserPhotoNode.classList.add('photo');
    //           reviewUserNameNode.classList.add('name');
    //           reviewUserTextNode.classList.add('text');
    //
    //           reviewUserPhotoNode.src = itemNode.user.photo_100;
    //           reviewUserPhotoNode.alt = 'Фото пользователя ' +  itemNode.user.first_name + ' ' +  itemNode.user.last_name;
    //           reviewUserNameNode.innerHTML = itemNode.user.first_name + ' ' +  itemNode.user.last_name;
    //           reviewUserTextNode.innerHTML = itemNode.text.length > 200 ? itemNode.text.substring(0, 140) + '...' : itemNode.text;
    //
    //           reviewNode.append(reviewUserPhotoNode);
    //           reviewNode.append(reviewUserNameNode);
    //           reviewNode.append(reviewUserTextNode);
    //
    //           vkReviewsNode.append(reviewNode);
    //         });
    //       }
    //     });
    //   }
    // });
  }
}); /* Блок СОЦ.СЕТЕЙ на главной */

/**
 * Кладём товар в корзину - Buy.Button
 */
Faze.add({
  pluginName: 'BuyButton',
  condition: document.querySelectorAll('.js-btn-buy').length > 0,
  callback: () => {

    Faze.on('click', '.js-btn-buy', (event, buttonNode) => {
      Faze.REST.chain([
        {
          method: 'POST',
          page: '/cart/',
          mime: 'json',
          basket_mdl_module: PRODUCT_MODULE,
          show: BTNBUY_MODULE,
          action: 'buy',
          basket_lnk_link: buttonNode.dataset.productId,
          quantity: 1,
        },

        (data) => {
          if(data) {
            // Накидываем класс на кнопку, показывающий, что на неё уже нажали
            !buttonNode.classList.contains('active') ? buttonNode.classList.add('active') : true;

            // Создаём блок-уведомление, показывающий, что товар добавился в корзину
            const notificationElement = document.createElement('div');
            notificationElement.classList.add('buyNotification');
            buttonNode.appendChild(notificationElement);

            // По прохождению 1500 мс удаляем вставленный блок
            setTimeout(() => {
              buttonNode.removeChild(notificationElement);
            }, 1500);
          }
        },

        {
          method: 'GET',
          module: CARTSTATE_MODULE,
          response_html: '.js-cart-state',
        },
        {
          method: 'GET',
          module: CARTSTATEMOBILE_MODULE,
          response_html: '.js-cart-state-mobile',
        },
      ]);
    });
  },
}); /* Кладём товар в корзину - Buy.Button */

/**
 * Манипуляции в корзине
 */
Faze.add({
  pluginName: 'cartManage',
  condition: document.querySelectorAll('section.cart:not(.empty)').length,
  observableSelector: 'section.cart:not(.empty)',
  callback: () => {
    class Cart {
      constructor() {
        this.cartNode = document.querySelector('section.cart'); // НОДА крзины
        this.cartStateNode = document.querySelector('.js-cart-state'); // НОДА блока состояния корзины в шапке сайта
        this.cartItemsNode = null; // НОДА списка айтемов в корзине

        this.itemData = null; // ДАТА айтема с которым взаимодействуем
        this.dataNameInputNode = this.cartNode.querySelector('.primary.name input');

        this.finalInfoNode = this.cartNode.querySelector('.final-info'); // НОДА с конечной стоимостью и кнопкой купить
        this.cartTotalNode = this.finalInfoNode.querySelector('.total .value span.price'); // НОДА хранящее чистое значение стоимости total всей корзины

        this.bind();
      }

      bind() {
        if (this.cartNode) {
          // this.dataNameInputNode.focus();

          this.cartNode.addEventListener('click', (el) => {
            if (el.target.classList.contains('js-remove')) { // Удаление товара из корзины ------ Навешивая событие таким образом мы получаем возможность изменять DOM после его перезагрузки
              this.itemData = el.target.closest('.item').dataset; // ДАТА айтема с которым взаимодействуем

              let formData = new FormData(); // Собираем формдату для отправки
              formData.append('basket_uid_id', this.itemData.basketId);
              formData.append('update', this.itemData.module);
              formData.append('show', this.itemData.module);
              formData.append('from', window.location.href);
              formData.append('action', 'remove');
              formData.append('mime', 'json');

              this.refreshCartElements(formData);
            } else if (el.target.classList.contains('js-clear-cart')) { // Кнопка "Очистить корзину"
              this.itemData = el.target.dataset; // ДАТА айтема с которым взаимодействуем
              this.cartItemsNode = this.cartNode.querySelector('.js-cart-items');

              let jsonData = `[`; // Собираем JSON-массив из объектов, каждый объект - это ID отдельного айтема в корзине
              this.cartItemsNode.querySelectorAll('.item').forEach((itemNode) => {
                jsonData += `{"basket_uid_id":"${itemNode.dataset.basketId}"},`;
              });
              jsonData = `${jsonData.slice(0, -1)}]`;

              let formData = new FormData(); // Собираем формдату для отправки
              formData.append('json_data', jsonData);
              formData.append('update', this.itemData.module);
              formData.append('show', this.itemData.module);
              formData.append('from', window.location.href);
              formData.append('action', 'remove');
              formData.append('mime', 'json');

              this.refreshCartElements(formData);
            } else if (el.target.classList.contains('js-minus')) { // Уменьшение кол-ва товара
              this.itemData = el.target.closest('.item').dataset; // ДАТА айтема с которым взаимодействуем

              let formData = new FormData(); // Собираем формдату для отправки
              formData.append('basket_uid_id', this.itemData.basketId);
              formData.append('update', this.itemData.module);
              formData.append('show', this.itemData.module);
              formData.append('from', window.location.href);
              formData.append('basket_int_amount1', parseInt(el.target.previousElementSibling.querySelector('input').value) - 1);
              formData.append('mime', 'json');

              this.refreshCartElements(formData);
            } else if (el.target.classList.contains('js-plus')) { // Увеличение кол-ва товара
              this.itemData = el.target.closest('.item').dataset; // ДАТА айтема с которым взаимодействуем

              let formData = new FormData(); // Собираем формдату для отправки
              formData.append('basket_uid_id', this.itemData.basketId);
              formData.append('update', this.itemData.module);
              formData.append('show', this.itemData.module);
              formData.append('from', window.location.href);
              formData.append('basket_int_amount1', parseInt(el.target.nextElementSibling.querySelector('input').value) + 1);
              formData.append('mime', 'json');

              this.refreshCartElements(formData);
            }
          });

          this.cartNode.addEventListener('change', (el) => { // Изменение инпута Количества товара в корзине
            if (el.target.classList.contains('input-qty')) {
              this.itemData = el.target.closest('.item').dataset; // ДАТА айтема с которым взаимодействуем

              let formData = new FormData(); // Собираем формдату для отправки
              formData.append('basket_uid_id', this.itemData.basketId);
              formData.append('update', this.itemData.module);
              formData.append('show', this.itemData.module);
              formData.append('from', window.location.href);
              formData.append('basket_int_amount1', parseInt(el.target.value));
              formData.append('mime', 'json');

              this.refreshCartElements(formData);
            }
          });

          // this.finalInfoNode.addEventListener('click', (el) => {
          //   if (el.target.classList.contains('js-btn-cart-buy')) {
          //     this.validateForm(this.orderFormNode);
          //   }
          // });
        }
      }

      // Валидация формы
      validateForm(form) {
        this.cartItemsNode = this.cartNode.querySelector('.js-cart-items').parentNode; // НОДА списка айтемов в корзине

        // Флаг показывающий что форма валидна и можем сабмитить
        let isValid = true;

        // Проходимся по всем элементам формы и проверяем на валидность
        form.querySelectorAll('input:not([type="hidden"]), textarea').forEach((inputNode) => {
          // DOM элемент блока с инпутом и ошибкой
          const labelNode = inputNode.parentNode;

          // Проверяем, если ошибка есть, то выводим её, если нет, то убираем сообщение об ошибке у данного элемента
          if (inputNode.validationMessage) {
            this.showErrorMsg(inputNode, inputNode.validationMessage, labelNode.classList.contains('having-error'));
            isValid = false;
          } else {
            labelNode.classList.remove('having-error');
            const errorMessageNode = labelNode.querySelector('.error-message');
            if (errorMessageNode) {
              labelNode.querySelector('.error-message').remove();
            }
          }
        });

        // Сабмитим форму
        if (isValid) {
          // loadingScreen(this.cartHolder);
          form.submit();
        }
      }

      showErrorMsg(inputNode, msg, update) { // Создаем сообщение об ошибке, сюда передаём элемент к которому относится ошибка и сообщение, которое нужно показать
        const inputParentNode = inputNode.parentNode;

        if (update) {
          const errorMessageNode = inputParentNode.querySelector('.error-message');
          if (errorMessageNode) {
            errorMessageNode.textContent = msg;
          }
        } else {
          const errorElement = document.createElement('span'); // Создаём блок с ошибкой
          errorElement.classList.add('error-message');
          errorElement.innerHTML = msg;

          inputParentNode.classList.add('having-error');
          inputParentNode.appendChild(errorElement); // Вставляем блок под инпут с ошибкой
        }
      }

      refreshCartElements(formData) { // После каких-либо изменений отправляем запросы с переданной формдатой и обновляем содержимое корзины
        this.cartItemsNode = this.cartNode.querySelector('.js-cart-items').parentNode; // НОДА списка айтемов в корзине

        // loadingScreen(this.cartHolder);

        fetch(window.location.href, {method: 'POST', body: formData}) // Отправляем запрос
          .then((response) => {
            if (response.ok === true) {
              Faze.REST.chain([ // Обновляем список товаров
                {
                  method: 'GET',
                  module: this.itemData.module,
                  response_html: '.js-cart-items',
                },

                (data) => {
                  if(!data) { // Смотрим пришло ли что-либо в ответ, если нет, значит в корзине 0 товаров, следовательно перезагружаем корзину полностью
                    Faze.REST.chain([
                      {
                        method: 'GET',
                        module: CART_MODULE,
                        response_html: '.js-cart',
                      },
                    ]);
                  } else { // Обновляем итоговую стоимость
                    // var doc = new DOMParser().parseFromString(data, "text/html");
                    this.cartTotalNode.innerHTML = this.cartNode.querySelector('[data-total-price]').dataset.totalPrice;
                  }
                },
              ]);

              let dk = document.querySelector('[data-total-price]');
              console.log(dk);

              // Обновляем cart-state'ы
              Faze.REST.chain([
                {
                  method: 'GET',
                  module: CARTSTATE_MODULE,
                  response_html: '.js-cart-state',
                },

                {
                  method: 'GET',
                  module: CARTSTATEMOBILE_MODULE,
                  response_html: '.js-cart-state-mobile',
                },
              ]);
            } else {
              throw 'An Error occurred while deleting';
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }

    const cart = new Cart();
  },
});

/**
 * Управление плейсхолдерами
 * Так как плейсхолдеры кастомные, обрабатываем событие скрытия/показа в JS
 */
Faze.add({
  pluginName: 'placeholderManage',
  condition: document.querySelectorAll('.placeholder').length,
  observableSelector: '.placeholder',
  callback: () => {
    document.querySelectorAll('[data-js-placeholder]').forEach((item) => {
      if (item.value != '') { // Добавляем класс active при перезагрузке страницы, если в инпуте что-то есть (например, значение из querystring)
        item.previousElementSibling.classList.add('active');
      }

      item.addEventListener('focus', () => {  // При фокусе сдвигаем плейсхолдер
        if(!item.previousElementSibling.classList.contains('active')) {
          item.previousElementSibling.classList.add('active');
        }
      });

      item.addEventListener('focusout', () => { // При потере фокуса, если в инпуте ничего не написано, то возвращаем плейсхолдер наместо
        if (item.value == '') {
          item.previousElementSibling.classList.remove('active');
        }
      });
    });
  },
}); /* Управление плейсхолдерами */

Faze.add({
  pluginName: 'controlpanelManage',
  condition: document.querySelectorAll('.controlpanel').length,
  observableSelector: '.js-all-items',
  callback: () => {
    const panelNodes = document.querySelectorAll('.js-panel');

    if(panelNodes.length > 0) {
      panelNodes.forEach(panelNode => {
        let allItemsNode = panelNode.querySelector('.js-all-items');
        let itemNodes = allItemsNode.querySelectorAll('.js-item');
        let formNode = panelNode.querySelector('form');
        let editModeCloseBtn = formNode.querySelector('.js-edit-mode-close');

        if(itemNodes.length > 0) {
          itemNodes.forEach((itemNode) => {
            itemNode.querySelector('.js-delete').addEventListener('click', async () => {
              if(!confirm('Вы подтверждаете удаление?')) return;

              let body = {
                id: itemNode.dataset.id,
                moduleTable: panelNode.dataset.moduleTable
              };

              fetch(window.location.href, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body),
              }).then(result => result.json())
                .then(async (data) => {
                  refreshHtmlContent(window.location.href, `${panelNode.dataset.moduleSelector} .js-all-items`);
                });
            });

            itemNode.querySelector('.js-edit').addEventListener('click', () => {
              const jsonData = JSON.parse(itemNode.dataset.json);

              if(jsonData) {
                clearForm(formNode); //

                formNode.classList.add('editMode'); // Добавляем класс форме
                formNode.method = 'put'; // Меняем метод у формы на PUT

                formNode.querySelectorAll('input[disabled]').forEach(inputNode => { // У всех DISABLED инпутов убираем атрибут disabled и проставляем data-disabled, чтобы потом знать, какие атрибуты должны быть disabled
                  inputNode.removeAttribute('disabled');
                  inputNode.dataset.disabled = 1;
                });

                for(inputName in Object.fromEntries(new FormData(formNode))) { // Заполняем форму данными из атрибута jsonData редактируемой записи
                  let inputNode = formNode.querySelector(`input[name="${inputName}"]`);

                  if(inputNode.type === 'radio') { // Если инпут это радиокнопка, то ищем все радиокнопки с таким же именем, и проставляем checked только для той кнопки, у которой value совпадает с jsonData[inputName]
                    const radioNodes = formNode.querySelectorAll(`input[name="${inputName}"]`);
                    radioNodes.forEach(radioNode => radioNode.removeAttribute('checked')); // Удаляем заранее все аттриуты checked
                    radioNodes.forEach(radioNode => radioNode.value == jsonData[inputName] ? radioNode.checked = true : ''); // Проходимся по инпутам и ставим checked там, где значение совпадает, setTimeout, чтобы цикл выполнялся после "очистки" инпутов, которая на строку выше
                  }

                  if(!['file','radio'].includes(inputNode.type) && typeof jsonData[inputName] !== 'undefined') inputNode.value = jsonData[inputName]; // Вставляем значение (если тип инпута не file (для картинок), не radio и значение имеется в jsonData)
                }
              }
            });
          });
        }

        if(editModeCloseBtn) editModeCloseBtn.addEventListener('click', () => editModeClose(formNode)); // Кнопка "выключения" режима редактирования у формы
      });
    }
  },
});

function editModeClose(formNode) {
  formNode.classList.remove('editMode');
  formNode.method = 'post';
  clearForm(formNode);

  formNode.querySelectorAll('input:not([type="radio"]):not([name="moduleTable"])').forEach(inputNode => { // Проставляем атрибут disabled всем инпутам, у которых есть атрибут data-disabled
    if(inputNode.hasAttribute('data-disabled')) {
      inputNode.removeAttribute('data-disabled');
      inputNode.setAttribute('disabled', '')
    }
  });
}

function clearForm(formNode) {
  formNode.querySelectorAll('input:not([type="radio"]):not([name="moduleTable"])').forEach(inputNode => { // Проставляем атрибут disabled всем инпутам, у которых есть атрибут data-disabled
    inputNode.value = ''; // Обнуляем value инпута, у которого есть атрибут data-disabled
    if(inputNode.type === 'file') inputNode.previousElementSibling.innerHTML = inputNode.previousElementSibling.dataset.defaultText;
  });
}

function refreshHtmlContent(url, selector) { // Принимает урл и селектор, возвращает кусок HTML кода
  fetch(url) // Получаем запрашиваемую страницу
    .then(result => result.text())
    .then(content => {
      const page = new DOMParser().parseFromString(content, 'text/html'); // Обрабатываем HTML страницу

      document.querySelector(selector).innerHTML = page.querySelector(selector).outerHTML; // Вставляем контент
    });
}

Faze.add({ // Отправка формы с помощью FETCH-JS если есть аттрибут
  pluginName: 'fetchForm',
  condition: document.querySelectorAll('[data-form-fetch]').length,
  callback: () => {
    const formNodes = document.querySelectorAll('[data-form-fetch]');

    formNodes.forEach((formNode) => {
      if(formNode.tagName !== 'FORM') return; // Если элемента не форма, то прекращаем выполнение

      formNode.addEventListener('submit', () => {
        event.preventDefault();

        const formData = new FormData(formNode);
        const url = formNode.action || window.location.href;
        const options = {
          method: formNode.getAttribute('method') ? formNode.getAttribute('method') : 'POST', // Если у формы в датаатр. задан метод, то берём его иначе POST
          credentials: 'include',
          body: formNode.enctype === 'application/x-www-form-urlencoded' ? JSON.stringify(Object.fromEntries(formData)) : formData, // Собираем формдату, формируем из неё объект и превращаем в JSON-строку
        };

        if(formNode.enctype === 'application/x-www-form-urlencoded') options.headers = { 'Content-Type': 'application/json;charset=utf-8' };

        fetch(url, options)
          .then(response => response.json())
          .then((result) => {
            clearForm(formNode); // Очищаем форму
            formNode.classList.add('form-success');
            const responseNode = formNode.hasAttribute('data-form-response') ? formNode : formNode.querySelector('[data-form-response]'); // Ищем ноду с аттрибутом data-form-response для записи ответа от сервера

            if(responseNode) {
              responseNode.innerHTML = result.message ? result.message : 'Отправлено успешно...'; // Отображаем сообщение
              if(responseNode != formNode) setTimeout(() => responseNode.innerHTML = '', 3000); // Стираем сообщение через 3 секунды, если элементом ответа является не сама нода
            }

            if(formNode.dataset.formFetch !== '') {  // Получаем функцию из data аттрибута и выполняем её
              try {
                (new Function(formNode.dataset.formFetch))(); // Выполняем функцию
              } catch(e) {
                console.log('Ошибка в функции, передаваемой в form fetch:', e);
              }
            }
          });
      })
    });
  }
});

/**
 * Транслитерация русских букв
 */
Faze.add({
  pluginName: "charsTransliteration",
  condition: document.querySelectorAll('.js-transliterate-scope').length > 0,
  callback: () => {
    const alphabet = {
    	'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
    	'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
    	'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
    	'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
    	'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
    	'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
    	'э': 'e',    'ю': 'yu',   'я': 'ya',   ' ': '-',      1: 1,
        2: 2,        3: 3,        4: 4,        5: 5,        6: 6,
        7: 7,        8: 8,        9: 9,        0: 0
    };

    const scopeNodes = document.querySelectorAll('.js-transliterate-scope'); // Внутри этого блока мы будем искать ноды .js-transliterate-from и .js-transliterate-to

    scopeNodes.forEach(scopeNode => {
      let fromNode = scopeNode.querySelector('.js-transliterate-from');
      let toNode = scopeNode.querySelector('.js-transliterate-to');

      fromNode.addEventListener('input', () => {
        if(scopeNode.classList.contains('editMode') && toNode.value) return; // Если форма в моде editMode (товар редактируется) и toNode имеет значение, тогда не делаем транслитерацию

        toNode.value = fromNode.value.toLowerCase().split('').map(char => { // Делаем введённое слова массивом из букв
          return alphabet[char] === undefined ? char : alphabet[char]; // Если текущая буква undefined, тогда возвращаем её не трансформируя, иначе берём её значение из алфавита
        }).join(''); // Превращаем массив в строковое значение и переводим её в нижний регистр
      });
    });
  }
}); // Транслитерация русских букв

/**
 * Кастомизируем инпуты типа file
 */
Faze.add({
  pluginName: "customInputFile",
  condition: document.querySelectorAll('.js-file-upload').length > 0,
  callback: () => {
    const uploadNodes = document.querySelectorAll('.js-file-upload');

    // При изменении инпута (выборе файла с компьютера), мы
    // записываем название файла в label для отображения пользователю
    uploadNodes.forEach((uploadNode, i) => {
      const textNode = uploadNode.querySelector('.placeholder');
      const inputNode = uploadNode.querySelector('input');

      inputNode.addEventListener('change', () => {
        if (inputNode.value != '') {
          textNode.innerHTML = inputNode.value.split('\\').pop();
        }
      });
    });
  }
}); // Кастомизируем инпуты типа file

document.fonts.ready.then(function() {
  // Any operation that needs to be done only after all the fonts
  // have finished loading can go here.
});