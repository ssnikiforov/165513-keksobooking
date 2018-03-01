'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');

  var PRICE_MIN_BUNGALO = 0;
  var PRICE_MIN_FLAT = 1000;
  var PRICE_MIN_HOUSE = 5000;
  var PRICE_MIN_PALACE = 10000;

  var NOT_FOR_GUESTS_OPTION_VALUE = 100;

  var fillAddressField = function (xCoordinate, yCoordinate) {
    var map = document.querySelector('.map');
    var addressFormField = noticeForm.querySelector('#address');
    var initialPinX = map.offsetWidth / 2;
    var initialPinY = map.offsetHeight / 2;

    var mainPinX = (xCoordinate || initialPinX);
    var mainPinY = (yCoordinate || initialPinY);
    addressFormField.value = mainPinX + ', ' + mainPinY;
  };

  // form validation
  var changeTypeHandler = function () {
    changePrices();
  };

  var changePrices = function () {
    var typeEl = noticeForm.querySelector('#type');
    var priceEl = noticeForm.querySelector('#price');
    var typesConstants = window.data.constants.types;

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
    var timeOutEl = noticeForm.querySelector('#timeout');
    var timeValuesConstants = window.data.constants.timeValues;

    if (evt.target.value === timeValuesConstants[0]) {
      timeOutEl.value = timeValuesConstants[0];
    } else if (evt.target.value === timeValuesConstants[1]) {
      timeOutEl.value = timeValuesConstants[1];
    } else if (evt.target.value === timeValuesConstants[2]) {
      timeOutEl.value = timeValuesConstants[2];
    }
  };

  var changeTimeOutHandler = function (evt) {
    var timeInEl = noticeForm.querySelector('#timein');
    var timeValuesConstants = window.data.constants.timeValues;

    if (evt.target.value === timeValuesConstants[0]) {
      timeInEl.value = timeValuesConstants[0];
    } else if (evt.target.value === timeValuesConstants[1]) {
      timeInEl.value = timeValuesConstants[1];
    } else if (evt.target.value === timeValuesConstants[2]) {
      timeInEl.value = timeValuesConstants[2];
    }
  };

  var changeRoomNumber = function () {
    var roomNumberEl = noticeForm.querySelector('#room_number');
    var capacityEl = noticeForm.querySelector('#capacity');

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

  var clickResetButtonHandler = function (evt) {
    resetPage(evt);
  };

  var resetPage = function (evt) {
    evt.preventDefault();

    var map = document.querySelector('.map');
    var mainPin = map.querySelector('.map__pin--main');

    // все заполненные поля стираются
    noticeForm.reset();

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

  var submitFormHandler = function () {
    noticeForm.submit();
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

  var switchFieldsetsActivation = function (activationFlag) {
    var noticeFieldsets = noticeForm.querySelectorAll('.form__element');

    for (var i = 0, n = noticeFieldsets.length; i < n; i++) {
      noticeFieldsets[i].disabled = !activationFlag;
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
