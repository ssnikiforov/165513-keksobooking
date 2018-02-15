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
  var PRICE_MIN_BUNGALO = 0;
  var PRICE_MIN_FLAT = 1000;
  var PRICE_MIN_HOUSE = 5000;
  var PRICE_MIN_PALACE = 10000;

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

  var MAP_PIN_WIDTH = 62;
  var MAP_PIN_HEIGHT = 84;

  var PIN_INITIAL_X = (X_COORD_MAX - X_COORD_MIN) / 2;
  var PIN_INITIAL_Y = (Y_COORD_MAX - Y_COORD_MIN) / 2;

  var NOTICE_FORM_ACTION_PATH = 'https://js.dump.academy/keksobooking';

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
          x: xValue + MAP_PIN_WIDTH / 2,
          y: yValue + MAP_PIN_HEIGHT
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

      var renderedPinElement = renderMapPin(pinElementTemplate, ads[i]);
      addClickListener(renderedPinElement, ads[i]);
      fragment.appendChild(renderedPinElement);
    }

    map.querySelector('.map__pins').appendChild(fragment);
  };

  var addClickListener = function (pinElement, ad) {
    pinElement.addEventListener('click', function () {
      renderNotice(ad);
    });
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

  var modifyNotice = function (template, ad) {
    var noticeElement = template.cloneNode(true);
    noticeElement.querySelector('h3').textContent = ad.offer.title;
    noticeElement.querySelector('p small').textContent = ad.offer.address;
    noticeElement.querySelector('.popup__price').textContent = '';

    var priceEl = document.createTextNode(ad.offer.price + ' \u20BD/ночь');
    noticeElement.querySelector('.popup__price').appendChild(priceEl);

    var typeEl = noticeElement.querySelector('h4');
    modifyTypes(typeEl, ad);

    var roomsAndGuestEl = noticeElement.querySelector('h4').nextElementSibling;
    roomsAndGuestEl.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

    var checkInCheckOutEl = roomsAndGuestEl.nextElementSibling;
    checkInCheckOutEl.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresListEl = noticeElement.querySelector('.popup__features');
    modifyFeatures(featuresListEl, ad);

    var descriptionEl = featuresListEl.nextElementSibling;
    descriptionEl.textContent = ad.offer.description;

    var photosListEl = noticeElement.querySelector('.popup__pictures');
    modifyPhotos(photosListEl, ad);

    noticeElement.querySelector('.popup__avatar').src = ad.author.avatar;

    return noticeElement;
  };

  var renderNotice = function (ad) {
    var noticeTemplate = template.querySelector('.map__card');
    var noticeElementTemplate = noticeTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(modifyNotice(noticeElementTemplate, ad));

    var mapFiltersContainer = map.querySelector('.map__filters-container');
    map.insertBefore(fragment, mapFiltersContainer);
  };

  var switchFieldsetsActivation = function (activationFlag) {
    for (var i = 0, n = noticeFieldsets.length; i < n; i++) {
      noticeFieldsets[i].disabled = !activationFlag;
    }
  };

  var activatePage = function (activationFlag) {
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    switchFieldsetsActivation(activationFlag);
  };

  var mainPinMoveHandler = function () {
    activatePage(true);
    fillAddressField();
    renderMapPins(map, template, ads);
  };

  var fillAddressField = function () {
    var addressFormField = noticeForm.querySelector('#address');
    var mainPinX = PIN_INITIAL_X - MAP_PIN_WIDTH / 2;
    var mainPinY = PIN_INITIAL_Y - MAP_PIN_HEIGHT;

    addressFormField.value = mainPinX + ', ' + mainPinY;
  };

  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var noticeForm = document.querySelector('.notice__form');
  var noticeFieldsets = noticeForm.querySelectorAll('.form__element');
  var mainPin = map.querySelector('.map__pin--main');
  var ads = getAds(NUMBER_OF_ADS);

  // disable page by default
  var isPageActivated = false;
  // switchFieldsetsActivation(isPageActivated);
  activatePage(true);

  mainPin.addEventListener('mouseup', mainPinMoveHandler);

  // form validation
  var TITLE_LENGTH_MIN = 30;
  var TITLE_LENGTH_MAX = 1000;
  var PRICE_LENGTH_MAX = 1000000;

  noticeForm.action = NOTICE_FORM_ACTION_PATH;

  var titleEl = noticeForm.querySelector('#title');
  titleEl.required = true;
  titleEl.minLength = 2;
  // titleEl.minLength = TITLE_LENGTH_MIN;
  // titleEl.maxLength = TITLE_LENGTH_MAX;

  var addressEl = noticeForm.querySelector('#address');
  addressEl.required = true;
  // addressEl.disabled = true;

  var typeEl = noticeForm.querySelector('#type');
  // typeEl.required = true;

  var priceEl = noticeForm.querySelector('#price');
  // priceEl.required = true;
  priceEl.max = PRICE_LENGTH_MAX;

  var timeInEl = noticeForm.querySelector('#timein');
  // timeInEl.required = true;

  var timeOutEl = noticeForm.querySelector('#timeout');
  // timeOutEl.required = true;

  var roomNumberEl = noticeForm.querySelector('#room_number');
  // roomNumberEl.required = true;

  var capacityEl = noticeForm.querySelector('#capacity');
  // capacityEl.required = true;

  var changeTypeHandler = function (evt) {
    if (evt.target.value === TYPES[0]) {
      priceEl.min = PRICE_MIN_FLAT;
      priceEl.placeholder = PRICE_MIN_FLAT;
    } else if (evt.target.value === TYPES[1]) {
      priceEl.min = PRICE_MIN_HOUSE;
      priceEl.placeholder = PRICE_MIN_HOUSE;
    } else if (evt.target.value === TYPES[2]) {
      priceEl.min = PRICE_MIN_BUNGALO;
      priceEl.placeholder = PRICE_MIN_BUNGALO;
    } else if (evt.target.value === 'palace') {
      priceEl.min = PRICE_MIN_PALACE;
      priceEl.placeholder = PRICE_MIN_PALACE;
    }
  };

  var changeTimeInHandler = function (evt) {
    if (evt.target.value === TIME_VALUES[0]) {
      timeOutEl.value = TIME_VALUES[0];
    } else if (evt.target.value === TIME_VALUES[1]) {
      timeOutEl.value = TIME_VALUES[1];
    } else if (evt.target.value === TIME_VALUES[2]) {
      timeOutEl.value = TIME_VALUES[2];
    }
  };

  var changeTimeOutHandler = function (evt) {
    if (evt.target.value === TIME_VALUES[0]) {
      timeInEl.value = TIME_VALUES[0];
    } else if (evt.target.value === TIME_VALUES[1]) {
      timeInEl.value = TIME_VALUES[1];
    } else if (evt.target.value === TIME_VALUES[2]) {
      timeInEl.value = TIME_VALUES[2];
    }
  };


  var changeRoomNumber = function () {
    var guests = capacityEl.querySelectorAll('option');
    var notForGuests =  capacityEl.querySelector('option[value="0"]');
    notForGuests.disabled = true;

    for (var i = 0, n = guests.length; i < n; i++) {
      if (+roomNumberEl.value === 100) {
        guests[i].disabled = true;
        notForGuests.disabled = false;
      } else if (+guests[i].value !== 0 && +roomNumberEl.value < +guests[i].value) {
        guests[i].disabled = true;
      } else {
        guests[i].disabled = false;
        notForGuests.disabled = true;
      }
    }

    changeCapacityHandler();
  };

  var validateCapacity = function () {
    if  (capacityEl.selectedOptions[0].hasAttribute('disabled')) {
      capacityEl.setCustomValidity('Выбрано неверное значение');
    } else {
      capacityEl.setCustomValidity('');
    }
  };

  var changeCapacityHandler = function () {
    validateCapacity();
  };

  var changeRoomNumberHandler = function () {
    changeRoomNumber();
  };

  var validateForm = function () {
    typeEl.addEventListener('change', changeTypeHandler);
    timeInEl.addEventListener('change', changeTimeInHandler);
    timeOutEl.addEventListener('change', changeTimeOutHandler);
    roomNumberEl.addEventListener('change', changeRoomNumberHandler);
    capacityEl.addEventListener('change', changeCapacityHandler);
  };

  var runForm = function () {
    changeRoomNumber();
    validateForm();
  };

  runForm();

  document.addEventListener('submit', function (evt) {
    evt.preventDefault();
    console.log('successfully submitted');
  });
})();
