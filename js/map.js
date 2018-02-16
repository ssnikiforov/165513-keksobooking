'use strict';

(function () {
  var X_COORD_MIN = 300;
  var X_COORD_MAX = 900;
  var Y_COORD_MIN = 150;
  var Y_COORD_MAX = 500;
  var PIN_INITIAL_X = (X_COORD_MAX - X_COORD_MIN) / 2;
  var PIN_INITIAL_Y = (Y_COORD_MAX - Y_COORD_MIN) / 2;

  var NUMBER_OF_ADS = 8;
  var PRICE_MIN_BUNGALO = 0;
  var PRICE_MIN_FLAT = 1000;
  var PRICE_MIN_HOUSE = 5000;
  var PRICE_MIN_PALACE = 10000;

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
    var noticeFieldsets = noticeForm.querySelectorAll('.form__element');

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
    var mainPinX = PIN_INITIAL_X - window.pin.width / 2;
    var mainPinY = PIN_INITIAL_Y - window.pin.height;

    addressFormField.value = mainPinX + ', ' + mainPinY;
  };

  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var noticeForm = document.querySelector('.notice__form');
  var mainPin = map.querySelector('.map__pin--main');
  var ads = window.data.ads(NUMBER_OF_ADS);

  // TODO: remove this two lines later
  // activatePage(true);
  // switchFieldsetsActivation(true);

  // disable page by default
  var isPageActivated = false;
  switchFieldsetsActivation(isPageActivated);

  mainPin.addEventListener('mouseup', mainPinMoveHandler);

  // form validation
  var changeTypeHandler = function () {
    changePrices();
  };

  var changePrices = function () {
    var typeEl = noticeForm.querySelector('#type');
    var priceEl = noticeForm.querySelector('#price');

    if (typeEl.value === TYPES[0]) {
      priceEl.min = PRICE_MIN_FLAT;
      priceEl.placeholder = PRICE_MIN_FLAT;
    } else if (typeEl.value === TYPES[1]) {
      priceEl.min = PRICE_MIN_HOUSE;
      priceEl.placeholder = PRICE_MIN_HOUSE;
    } else if (typeEl.value === TYPES[2]) {
      priceEl.min = PRICE_MIN_BUNGALO;
      priceEl.placeholder = PRICE_MIN_BUNGALO;
    } else if (typeEl.value === 'palace') {
      priceEl.min = PRICE_MIN_PALACE;
      priceEl.placeholder = PRICE_MIN_PALACE;
    }
  };

  var changeTimeInHandler = function (evt) {
    var timeOutEl = noticeForm.querySelector('#timeout');

    if (evt.target.value === TIME_VALUES[0]) {
      timeOutEl.value = TIME_VALUES[0];
    } else if (evt.target.value === TIME_VALUES[1]) {
      timeOutEl.value = TIME_VALUES[1];
    } else if (evt.target.value === TIME_VALUES[2]) {
      timeOutEl.value = TIME_VALUES[2];
    }
  };

  var changeTimeOutHandler = function (evt) {
    var timeInEl = noticeForm.querySelector('#timein');

    if (evt.target.value === TIME_VALUES[0]) {
      timeInEl.value = TIME_VALUES[0];
    } else if (evt.target.value === TIME_VALUES[1]) {
      timeInEl.value = TIME_VALUES[1];
    } else if (evt.target.value === TIME_VALUES[2]) {
      timeInEl.value = TIME_VALUES[2];
    }
  };

  var changeRoomNumber = function () {
    var roomNumberEl = noticeForm.querySelector('#room_number');
    var capacityEl = noticeForm.querySelector('#capacity');

    var guests = capacityEl.querySelectorAll('option');
    var notForGuests = capacityEl.querySelector('option[value="0"]');
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
    var capacityEl = noticeForm.querySelector('#capacity');

    if (capacityEl.selectedOptions[0].hasAttribute('disabled')) {
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

  var clickResetButtonHandler = function () {
    resetPage();
  };

  var resetPage = function () {
    // все заполненные поля стираются
    noticeForm.reset();

    // метки похожих объявлений удаляются
    var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0, n = mapPins.length; i < n; i++) {
      map.querySelector('.map__pins').removeChild(mapPins[i]);
    }

    // карточка активного объявления удаляется
    var articles = map.querySelectorAll('.map__card');
    for (i = 0, n = articles.length; i < n; i++) {
      map.removeChild(articles[i]);
    }

    // метка адреса возвращается в исходное положение
    // TODO implement this in module5

    // значение поля адреса корректируется соответственно положению метки
    fillAddressField();
  };

  var submitFormHandler = function () {
    noticeForm.submit();

    // TODO: remove this stuff later
    // console.log('successfully submitted');
    // evt.preventDefault();
    // resetPage();
  };

  var initializeFormListeners = function () {
    var typeEl = noticeForm.querySelector('#type');
    var timeInEl = noticeForm.querySelector('#timein');
    var timeOutEl = noticeForm.querySelector('#timeout');
    var roomNumberEl = noticeForm.querySelector('#room_number');
    var capacityEl = noticeForm.querySelector('#capacity');
    var resetButtonEl = noticeForm.querySelector('.form__reset');

    typeEl.addEventListener('change', changeTypeHandler);
    timeInEl.addEventListener('change', changeTimeInHandler);
    timeOutEl.addEventListener('change', changeTimeOutHandler);
    roomNumberEl.addEventListener('change', changeRoomNumberHandler);
    capacityEl.addEventListener('change', changeCapacityHandler);
    resetButtonEl.addEventListener('click', clickResetButtonHandler);
    noticeForm.addEventListener('submit', submitFormHandler);
  };

  var runForm = function () {
    changePrices();
    changeRoomNumber();
    initializeFormListeners();
  };

  runForm();

  window.map = {
    randomCoordX: function () {
      return window.util.getRandomNumberFromRange(X_COORD_MIN, X_COORD_MAX)
    },
    randomCoordY: function () {
      return window.util.getRandomNumberFromRange(Y_COORD_MIN, Y_COORD_MAX)
    }

  }
})();
