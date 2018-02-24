'use strict';

(function () {
  var TYPES = [
    'flat',
    'house',
    'bungalo'
  ];

  var TIME_VALUES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var cardsForm = document.querySelector('.notice__form');

  var PRICE_MIN_BUNGALO = 0;
  var PRICE_MIN_FLAT = 1000;
  var PRICE_MIN_HOUSE = 5000;
  var PRICE_MIN_PALACE = 10000;

  var NOT_FOR_GUESTS_OPTION_VALUE = 100;

  var fillAddressField = function (xCoordinate, yCoordinate) {
    var addressFormField = cardsForm.querySelector('#address');
    var initialPinX = (window.map.mapX.max - window.map.mapX.min) / 2;
    var initialPinY = (window.map.mapY.max - window.map.mapY.min) / 2;

    xCoordinate = typeof xCoordinate !== 'undefined' ? xCoordinate : initialPinX;
    yCoordinate = typeof yCoordinate !== 'undefined' ? yCoordinate : initialPinY;

    var mainPinX = xCoordinate;
    var mainPinY = yCoordinate - window.map.pin.height;

    addressFormField.value = mainPinX + ', ' + mainPinY;
  };

  // form validation
  var changeTypeHandler = function () {
    changePrices();
  };

  var changePrices = function () {
    var typeEl = cardsForm.querySelector('#type');
    var priceEl = cardsForm.querySelector('#price');
    var typesConstants = TYPES;

    if (typeEl.value === typesConstants[0]) {
      priceEl.min = PRICE_MIN_FLAT;
      priceEl.placeholder = PRICE_MIN_FLAT;
    } else if (typeEl.value === typesConstants[1]) {
      priceEl.min = PRICE_MIN_HOUSE;
      priceEl.placeholder = PRICE_MIN_HOUSE;
    } else if (typeEl.value === typesConstants[2]) {
      priceEl.min = PRICE_MIN_BUNGALO;
      priceEl.placeholder = PRICE_MIN_BUNGALO;
    } else if (typeEl.value === 'palace') {
      priceEl.min = PRICE_MIN_PALACE;
      priceEl.placeholder = PRICE_MIN_PALACE;
    }
  };

  var changeTimeInHandler = function (evt) {
    var timeOutEl = cardsForm.querySelector('#timeout');
    var timeValuesConstants = TIME_VALUES;

    if (evt.target.value === timeValuesConstants[0]) {
      timeOutEl.value = timeValuesConstants[0];
    } else if (evt.target.value === timeValuesConstants[1]) {
      timeOutEl.value = timeValuesConstants[1];
    } else if (evt.target.value === timeValuesConstants[2]) {
      timeOutEl.value = timeValuesConstants[2];
    }
  };

  var changeTimeOutHandler = function (evt) {
    var timeInEl = cardsForm.querySelector('#timein');
    var timeValuesConstants = TIME_VALUES;

    if (evt.target.value === timeValuesConstants[0]) {
      timeInEl.value = timeValuesConstants[0];
    } else if (evt.target.value === timeValuesConstants[1]) {
      timeInEl.value = timeValuesConstants[1];
    } else if (evt.target.value === timeValuesConstants[2]) {
      timeInEl.value = timeValuesConstants[2];
    }
  };

  var changeRoomNumber = function () {
    var roomNumberEl = cardsForm.querySelector('#room_number');
    var capacityEl = cardsForm.querySelector('#capacity');

    var guests = capacityEl.querySelectorAll('option');
    var notForGuests = capacityEl.querySelector('option[value="0"]');
    notForGuests.disabled = true;

    for (var i = 0, n = guests.length; i < n; i++) {
      if (+roomNumberEl.value === NOT_FOR_GUESTS_OPTION_VALUE) {
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
    var capacityEl = cardsForm.querySelector('#capacity');

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

  var clickResetButtonHandler = function (evt) {
    resetPage(evt);
  };

  var resetPage = function (evt) {
    evt.preventDefault();

    var map = document.querySelector('.map');
    var mainPin = map.querySelector('.map__pin--main');

    // все заполненные поля стираются
    cardsForm.reset();

    // метки похожих объявлений удаляются
    var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0, n = mapPins.length; i < n; i++) {
      map.querySelector('.map__pins').removeChild(mapPins[i]);
    }

    // карточка активного объявления удаляется
    var cards = map.querySelectorAll('.map__card');
    for (i = 0, n = cards.length; i < n; i++) {
      map.removeChild(cards[i]);
    }

    // метка адреса возвращается в исходное положение
    mainPin.style.removeProperty('top');
    mainPin.style.removeProperty('left');

    // значение поля адреса корректируется соответственно положению метки
    fillAddressField();

    // отключить форму
    window.init.activatePage(false);
  };

  var submitFormHandler = function (evt) {
    evt.preventDefault();

    var formData = new FormData(cardsForm);
    window.backend.save(formData, window.util.successHandler, window.util.errorHandler);
    cardsForm.reset();
  };

  var initializeFormListeners = function () {
    var typeEl = cardsForm.querySelector('#type');
    var timeInEl = cardsForm.querySelector('#timein');
    var timeOutEl = cardsForm.querySelector('#timeout');
    var roomNumberEl = cardsForm.querySelector('#room_number');
    var capacityEl = cardsForm.querySelector('#capacity');
    var resetButtonEl = cardsForm.querySelector('.form__reset');

    typeEl.addEventListener('change', changeTypeHandler);
    timeInEl.addEventListener('change', changeTimeInHandler);
    timeOutEl.addEventListener('change', changeTimeOutHandler);
    roomNumberEl.addEventListener('change', changeRoomNumberHandler);
    capacityEl.addEventListener('change', changeCapacityHandler);
    resetButtonEl.addEventListener('click', clickResetButtonHandler);
    cardsForm.addEventListener('submit', submitFormHandler);
  };

  var switchFieldsetsActivation = function (activationFlag) {
    var cardFieldsets = cardsForm.querySelectorAll('.form__element');

    for (var i = 0, n = cardFieldsets.length; i < n; i++) {
      cardFieldsets[i].disabled = !activationFlag;
    }
  };

  var runForm = function () {
    fillAddressField();
    changePrices();
    changeRoomNumber();
    initializeFormListeners();
  };

  window.form = {
    fillAddressField: fillAddressField,
    switchFieldsetsActivation: switchFieldsetsActivation,
    runForm: runForm
  };
})();
