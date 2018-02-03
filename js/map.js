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

  var MAX_GUESTS_IN_ONE_ROOM = 2;

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

    if (value instanceof Array) {
      return Math.floor(Math.random() * value.length);
    }

    return Math.floor(Math.random() * parseInt(value, 10));
  };

  var getRandomNumberFromRange = function (min, max) {
    return Math.random() * (max - min) + min
  };

  var getAvatar = function (number) {
    number = number < 10 ? '0' + number : number;

    return 'img/avatars/user' + number + '.png';
  };

  var getRandomIndex = function (value) {
    return getRandomNumber(value);
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
    return parseFloat(getRandomNumberFromRange(priceMin, priceMax).toFixed(2));
  };

  var getRandomType = function (types) {
    return types[getRandomNumber(types)];
  };

  var getRandomRoom = function (roomsMin, roomsMax) {
    return parseInt(Math.round(getRandomNumberFromRange(roomsMin, roomsMax)));
  };

  var getGuestsQuantity = function (rooms) {
    return rooms * MAX_GUESTS_IN_ONE_ROOM;
  };

  var getRandomCheckInValue = function (checkInTime) {
    return checkInTime[getRandomNumber(checkInTime)];
  };

  var getRandomCheckOutValue = function (checkOutTime) {
    return checkOutTime[getRandomNumber(checkOutTime)];
  };

  var getRandomFeatures = function (features) {
    var arr = [];
    for (var i = 0, n = getRandomNumber(features.length); i < n; i++) {
      arr.push(features[getRandomNumber(features)]);
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
      var roomsQuantity = getRandomRoom(ROOMS_MIN, ROOMS_MAX);
      var xValue = Math.round(getRandomNumberFromRange(X_COORD_MIN, X_COORD_MAX));
      var yValue = Math.round(getRandomNumberFromRange(Y_COORD_MIN, Y_COORD_MAX));

      var offer = {
        author: {
          avatar: getAvatar(i + 1)
        },
        offer: {
          title: getTitle(titlesTemp),
          address: xValue + ', ' + yValue,
          price: getRandomPrice(PRICE_MIN, PRICE_MAX),
          type: getRandomType(TYPES),
          rooms: roomsQuantity,
          guests: getGuestsQuantity(roomsQuantity),
          checkin: getRandomCheckInValue(TIME_VALUES),
          checkout: getRandomCheckOutValue(TIME_VALUES),
          features: getRandomFeatures(FEATURES),
          description: "",
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


// WIP below
  var renderOfferPins = function (offers, template) {
    var pinElement = template.cloneNode(true);
    var pinElement = template.cloneNode(true);
    var avatarElement = pinElement.querySelector('img');
    // console.log(pinElement);
    // console.log(avatarElement);

    // wizardElement.querySelector('.setup-similar-label').textContent = offers.name;
    // wizardElement.querySelector('.wizard-coat').style.fill = offers.coatColor;
    // wizardElement.querySelector('.wizard-eyes').style.fill = offers.eyesColor;

    return pinElement;
  };

  var map = document.querySelector('.map');
  map.classList.remove('.map--faded');

// var similarListElement = userDialog.querySelector('.setup-similar-list');
  var template = document.querySelector('template').content;
  var mapPinsTemplate = template.querySelector('.map__pin');

  var fragment = document.createDocumentFragment();

  var offers = getOffers(NUMBER_OF_OFFERS);

  for (var i = 0, n = offers.length; i < n; i++) {
    var pinElementTemplate = mapPinsTemplate.cloneNode(true);

    fragment.appendChild(renderOfferPins(offers[i], pinElementTemplate));
  }

// similarListElement.appendChild(fragment);

// offers.forEach(function (offer) {
//   console.log('address', offer.offer.address);
//   console.log('coords', offer.location.x, offer.location.y);
// });
  console.log(offers);

})();
