'use strict';

(function () {
  var NUMBER_OF_ADS = 8;

  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var TYPES = [
    'flat',
    'house',
    'bungalo'
  ];

  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;

  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;

  var GUESTS_MAX = 10;

  var TIME_VALUES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var X_COORD_MIN = 300;
  var X_COORD_MAX = 900;
  var Y_COORD_MIN = 150;
  var Y_COORD_MAX = 500;

  var getRandomNumber = function (value) {
    if (!value) {
      return value;
    }

    return Math.floor(Math.random() * value);
  };

  var getRandomNumberFromRange = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  var getAvatar = function (number) {
    number = number < 10 ? '0' + number : number;

    return 'img/avatars/user' + number + '.png';
  };

  var getRandomIndex = function (array) {
    return getRandomNumber(array.length);
  };

  var getTitle = function (titlesArr) {
    var index = getRandomIndex(titlesArr);
    var title = titlesArr[index];

    if (index > -1) {
      titlesArr.splice(index, 1);
    }

    return title;
  };

  var getRandomPrice = function (priceMin, priceMax) {
    return getRandomNumberFromRange(priceMin, priceMax);
  };

  var getRandomType = function (types) {
    return types[getRandomIndex(types)];
  };

  var getRandomRoom = function (roomsMin, roomsMax) {
    return getRandomNumberFromRange(roomsMin, roomsMax);
  };

  var getGuestsQuantity = function (guests) {
    return getRandomNumber(guests);
  };

  var getRandomCheckInValue = function (checkInTime) {
    return checkInTime[getRandomIndex(checkInTime)];
  };

  var getRandomCheckOutValue = function (checkOutTime) {
    return checkOutTime[getRandomIndex(checkOutTime)];
  };

  var getRandomFeatures = function (features) {
    var arr = [];
    for (var i = 0, n = getRandomIndex(features) || 1; i < n; i++) {
      arr.push(features[getRandomIndex(features)]);
    }

    return arr;
  };

  var getRandomPhotos = function (photos) {
    var photosTemp = photos.slice();

    var arr = [];
    for (var i = 0, n = photos.length; i < n; i++) {
      var index = getRandomIndex(photosTemp);
      arr.push(photosTemp[index]);

      if (index > -1) {
        photosTemp.splice(index, 1);
      }
    }

    return arr;
  };

  var getAds = function (numberOfAds) {
    var ads = [];
    var titlesTemp = TITLES.slice();

    for (var i = 0; i < numberOfAds; i++) {
      var xValue = getRandomNumberFromRange(X_COORD_MIN, X_COORD_MAX);
      var yValue = getRandomNumberFromRange(Y_COORD_MIN, Y_COORD_MAX);

      var ad = {
        author: {
          avatar: getAvatar(i + 1)
        },
        offer: {
          title: getTitle(titlesTemp),
          address: xValue + ', ' + yValue,
          price: getRandomPrice(PRICE_MIN, PRICE_MAX),
          type: getRandomType(TYPES),
          rooms: getRandomRoom(ROOMS_MIN, ROOMS_MAX),
          guests: getGuestsQuantity(GUESTS_MAX),
          checkin: getRandomCheckInValue(TIME_VALUES),
          checkout: getRandomCheckOutValue(TIME_VALUES),
          features: getRandomFeatures(FEATURES),
          description: '',
          photos: getRandomPhotos(PHOTOS)
        },
        location: {
          x: xValue,
          y: yValue
        }
      };
      ads.push(ad);
    }

    return ads;
  };

  var renderMapPin = function (template, ad) {
    var pinElement = template.cloneNode(true);
    var avatarElement = pinElement.querySelector('img');

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';
    avatarElement.src = ad.author.avatar;

    return pinElement;
  };

  var renderMapPins = function (map, template, ads) {
    var mapPinsTemplate = template.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    for (var i = 0, n = ads.length; i < n; i++) {
      var pinElementTemplate = mapPinsTemplate.cloneNode(true);

      fragment.appendChild(renderMapPin(pinElementTemplate, ads[i]));
    }

    map.querySelector('.map__pins').appendChild(fragment);
  };

  var modifyFeatures = function (featureListElement, ad) {
    var missingFeatures = FEATURES.filter(function (feature) {
      return !ad.offer.features.includes(feature);
    });

    missingFeatures.forEach(function (missingFeature) {
      featureListElement.removeChild(featureListElement.querySelector('.feature--' + missingFeature));
    });
  };

  var modifyPhotos = function (photoListElement, ad) {
    var photoListItemEl = photoListElement.querySelector('li');
    while (photoListElement.firstChild) {
      photoListElement.removeChild(photoListElement.firstChild);
    }
    ad.offer.photos.forEach(function (photo) {
      var photoListItemElCloned = photoListItemEl.cloneNode(true);
      var photoImgElCloned = photoListItemElCloned.firstChild;
      photoImgElCloned.src = photo;
      photoImgElCloned.width = '100';
      photoImgElCloned.height = '100';
      photoListElement.appendChild(photoListItemElCloned);
    });
  };

  var modifyTypes = function (typeElement, ad) {
    var adTypesReference = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом'
    };

    var adType = ad.offer.type;

    if (adType in adTypesReference) {
      typeElement.textContent = adTypesReference[adType];
    }
  };

  var modifyArticle = function (template, ad) {
    var articleElement = template.cloneNode(true);
    articleElement.querySelector('h3').textContent = ad.offer.title;
    articleElement.querySelector('p small').textContent = ad.offer.address;
    articleElement.querySelector('.popup__price').textContent = '';
    
    var priceEl = document.createTextNode(ad.offer.price + ' \u20BD/ночь');
    articleElement.querySelector('.popup__price').appendChild(priceEl);

    var typeEl = articleElement.querySelector('h4');
    modifyTypes(typeEl, ad);

    var roomsAndGuestEl = articleElement.querySelector('h4').nextElementSibling;
    roomsAndGuestEl.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

    var checkInCheckOutEl = roomsAndGuestEl.nextElementSibling;
    checkInCheckOutEl.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresListEl = articleElement.querySelector('.popup__features');
    modifyFeatures(featuresListEl, ad);

    var descriptionEl = featuresListEl.nextElementSibling;
    descriptionEl.textContent = ad.offer.description;

    var photosListEl = articleElement.querySelector('.popup__pictures');
    modifyPhotos(photosListEl, ad);

    articleElement.querySelector('.popup__avatar').src = ad.author.avatar;

    return articleElement;
  };

  var fillArticles = function (map, template, ads) {
    var articleTemplate = template.querySelector('.map__card');
    var fragment = document.createDocumentFragment();

    for (var i = 0, n = ads.length; i < n; i++) {
      var articleElementTemplate = articleTemplate.cloneNode(true);

      fragment.appendChild(modifyArticle(articleElementTemplate, ads[i]));
    }

    map.querySelector('.map__filters-container').appendChild(fragment);
  };

  var ads = getAds(NUMBER_OF_ADS);

  var map = document.querySelector('.map');
  map.classList.remove('.map--faded');

  var template = document.querySelector('template').content;

  renderMapPins(map, template, ads);
  fillArticles(map, template, ads);
})();
