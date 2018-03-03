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

  var PRICE_MIN_BUNGALO = 0;
  var PRICE_MIN_FLAT = 1000;
  var PRICE_MIN_HOUSE = 5000;
  var PRICE_MIN_PALACE = 10000;

  var NOT_FOR_GUESTS_OPTION_VALUE = 100;

  var map = document.querySelector('.map');
  var cardsForm = document.querySelector('.notice__form');

  var fillAddressField = function (xCoordinate, yCoordinate) {
    var addressFormField = cardsForm.querySelector('#address');
    var initialPinX = map.offsetWidth / 2;
    var initialPinY = map.offsetHeight / 2;

    var mainPinX = (xCoordinate || initialPinX);
    var mainPinY = (yCoordinate + Math.ceil(window.map.pin.height / 2) + window.map.pin.tailHeight || initialPinY);
    addressFormField.value = mainPinX + ', ' + mainPinY;
  };

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

    [].forEach.call(guests, function (guest) {
      if (+roomNumberEl.value === NOT_FOR_GUESTS_OPTION_VALUE) {
        guest.disabled = true;
        notForGuests.disabled = false;
      } else if (+guest.value !== 0 && +roomNumberEl.value < +guest.value) {
        guest.disabled = true;
      } else {
        guest.disabled = false;
        notForGuests.disabled = true;
      }
    });

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

  var clickResetButtonHandler = function () {
    resetPage();
  };

  var resetPage = function () {

    var mainPin = map.querySelector('.map__pin--main');

    cardsForm.reset();

    window.map.removePins();

    var cards = map.querySelectorAll('.map__card');
    [].forEach.call(cards, function (card) {
      map.removeChild(card);
    });

    mainPin.style.removeProperty('top');
    mainPin.style.removeProperty('left');

    fillAddressField();

    window.page.activate(false);
  };

  var successHandler = function () {
    var alertNode = window.util.alertMessage.getNode('success');
    alertNode.textContent = window.util.alertMessage.getSuccessSubmitText;
    document.body.insertAdjacentElement('afterbegin', alertNode);
    window.util.alertMessage.hide(alertNode);
    resetPage();
  };

  var submitFormHandler = function (evt) {
    evt.preventDefault();

    var formData = new FormData(cardsForm);
    window.backend.upload(formData, successHandler, window.util.errorHandler);
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

    [].forEach.call(cardFieldsets, function (cardFieldset) {
      cardFieldset.disabled = !activationFlag;
    });

    var avatarFieldset = cardsForm.querySelector('.notice__header');
    avatarFieldset.disabled = !activationFlag;
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
    run: runForm
  };
})();
