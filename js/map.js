'use strict';

(function () {
  var NUMBER_OF_OFFERS = 8;

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

  var getOffers = function (numberOfOffers) {
    var offers = [];
    var titlesTemp = TITLES.slice();

    for (var i = 0; i < numberOfOffers; i++) {
      var xValue = getRandomNumberFromRange(X_COORD_MIN, X_COORD_MAX);
      var yValue = getRandomNumberFromRange(Y_COORD_MIN, Y_COORD_MAX);

      var offer = {
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
      offers.push(offer);
    }

    return offers;
  };

  var renderMapPin = function (template, offer) {
    var pinElement = template.cloneNode(true);
    var avatarElement = pinElement.querySelector('img');

    pinElement.style.left = offer.location.x + 'px';
    pinElement.style.top = offer.location.y + 'px';
    avatarElement.src = offer.author.avatar;

    return pinElement;
  };

  var renderMapPins = function (map, template, offers) {
    var mapPinsTemplate = template.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    for (var i = 0, n = offers.length; i < n; i++) {
      var pinElementTemplate = mapPinsTemplate.cloneNode(true);

      fragment.appendChild(renderMapPin(pinElementTemplate, offers[i]));
    }

    map.querySelector('.map__pins').appendChild(fragment);
  };

  var modifyFeatures = function (featureListElement, offer) {
    var featureWiFi = featureListElement.querySelector('.feature--wifi');
    var featureDishwasher = featureListElement.querySelector('.feature--dishwasher');
    var featureParking = featureListElement.querySelector('.feature--parking');
    var featureWasher = featureListElement.querySelector('.feature--washer');
    var featureElevator = featureListElement.querySelector('.feature--elevator');
    var featureConditioner = featureListElement.querySelector('.feature--conditioner');
    while (featureListElement.firstChild) {
      featureListElement.removeChild(featureListElement.firstChild);
    }
    offer.offer.features.forEach(function (feature) {
      switch (feature) {
        case 'wifi':
          featureListElement.appendChild(featureWiFi);
          break;
        case 'dishwasher':
          featureListElement.appendChild(featureDishwasher);
          break;
        case 'parking':
          featureListElement.appendChild(featureParking);
          break;
        case 'washer':
          featureListElement.appendChild(featureWasher);
          break;
        case 'elevator':
          featureListElement.appendChild(featureElevator);
          break;
        case 'conditioner':
          featureListElement.appendChild(featureConditioner);
          break;
        default:
          break;
      }
    });
  };

  var modifyPhotos = function (photoListElement, offer) {
    var photoListItemEl = photoListElement.querySelector('li');
    while (photoListElement.firstChild) {
      photoListElement.removeChild(photoListElement.firstChild);
    }
    offer.offer.photos.forEach(function (photo) {
      var photoListItemElCloned = photoListItemEl.cloneNode(true);
      var photoImgElCloned = photoListItemElCloned.firstChild;
      photoImgElCloned.src = photo;
      photoImgElCloned.width = '20';
      photoImgElCloned.height = '20';
      photoListElement.appendChild(photoListItemElCloned);
    });
  };

  var modifyTypes = function (typeElement, offer) {
    var typeTranslated = '';
    switch (offer.offer.type) {
      case 'flat':
        typeTranslated = 'Квартира';
        break;
      case 'bungalo':
        typeTranslated = 'Бунгало';
        break;
      case 'house':
        typeTranslated = 'Дом';
        break;
      default:
        break;
    }
    typeElement.textContent = typeTranslated;
  };

  var modifyArticle = function (template, offer) {
    var articleElement = template.cloneNode(true);
    articleElement.querySelector('h3').textContent = offer.offer.title;
    articleElement.querySelector('p small').textContent = offer.offer.address;
    articleElement.querySelector('.popup__price').textContent = '';
    articleElement.querySelector('.popup__price').insertAdjacentHTML('beforeBegin', offer.offer.price + ' &#x20bd;/ночь');

    var typeEl = articleElement.querySelector('h4');
    modifyTypes(typeEl, offer);

    var roomsAndGuestEl = articleElement.querySelector('h4').nextElementSibling;
    roomsAndGuestEl.textContent = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';

    var checkInCheckOutEl = roomsAndGuestEl.nextElementSibling;
    checkInCheckOutEl.textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;

    var featuresListEl = articleElement.querySelector('.popup__features');
    modifyFeatures(featuresListEl, offer);

    var descriptionEl = featuresListEl.nextElementSibling;
    descriptionEl.textContent = offer.offer.description;

    var photosListEl = articleElement.querySelector('.popup__pictures');
    modifyPhotos(photosListEl, offer);

    articleElement.querySelector('.popup__avatar').src = offer.author.avatar;

    return articleElement;
  };

  var fillArticles = function (map, template, offers) {
    var articleTemplate = template.querySelector('.map__card');
    var fragment = document.createDocumentFragment();

    for (var i = 0, n = offers.length; i < n; i++) {
      var articleElementTemplate = articleTemplate.cloneNode(true);

      fragment.appendChild(modifyArticle(articleElementTemplate, offers[i]));
    }

    map.querySelector('.map__filters-container').appendChild(fragment);
  };

  var offers = getOffers(NUMBER_OF_OFFERS);

  var map = document.querySelector('.map');
  map.classList.remove('.map--faded');

  var template = document.querySelector('template').content;

  renderMapPins(map, template, offers);
  fillArticles(map, template, offers);
})();
