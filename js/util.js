'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var SUBMIT_SUCCESS_MESSAGE = 'Данные формы были успешно сохранены';
  var ALERT_SHOW_TIME = 3000;

  var DEBOUNCE_TIMEOUT = 500;

  var _lastTimeout;

  var isEscEvent = function (evt, action, arg) {
    if (evt.keyCode === ESC_KEYCODE) {
      action(arg);
    }
  };

  var isEnterEvent = function (evt, action, arg) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action(arg);
    }
  };

  var getRandomNumber = function (value) {
    if (!value) {
      return value;
    }

    return Math.floor(Math.random() * value);
  };

  var getRandomNumberFromRange = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  var getRandomIndex = function (array) {
    return getRandomNumber(array.length);
  };

  var getAlertMessageNode = function (type) {
    var template = document.querySelector('template').content;
    var alertWrapperEl = template.querySelector('.alert-wrapper').cloneNode(true);

    alertWrapperEl.style.backgroundColor = type === 'success' ? '#dff0d8' : '#f2dede';

    return alertWrapperEl;
  };

  var hideAlert = function (alert) {
    if (!alert) {
      return;
    }

    var timer = setTimeout(function () {
      clearTimeout(timer);
      document.body.removeChild(alert);
    }, ALERT_SHOW_TIME);
  };

  var successHandler = function () {
    var alertNode = getAlertMessageNode('success');
    alertNode.textContent = SUBMIT_SUCCESS_MESSAGE;
    document.body.insertAdjacentElement('afterbegin', alertNode);
    hideAlert(alertNode);
  };

  var errorHandler = function (errorMessage) {
    var alertNode = getAlertMessageNode('error');
    alertNode.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', alertNode);
    hideAlert(alertNode);
  };

  var debounce = function (cb) {
    if (_lastTimeout) {
      clearTimeout(_lastTimeout);
    }
    _lastTimeout = setTimeout(cb, DEBOUNCE_TIMEOUT);
  };

  window.util = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    getRandomNumber: getRandomNumber,
    getRandomIndex: getRandomIndex,
    getRandomNumberFromRange: getRandomNumberFromRange,
    successHandler: successHandler,
    errorHandler: errorHandler,
    alertMessage: {
      getSuccessSubmitText: SUBMIT_SUCCESS_MESSAGE,
      getNode: getAlertMessageNode,
      hide: hideAlert
    },
    debounce: debounce
  };
})();
