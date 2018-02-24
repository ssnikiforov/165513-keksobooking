'use strict';

(function () {
  var ENTER_KEYCODE = 13;

  var SUBMIT_SUCCESS_MESSAGE = 'Данные формы были успешно сохранены';
  var ALERT_SHOW_TIME = 10000;
  var ALERT_SHOW_STEPS = 100;

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
    var stylesArr = [
      'z-index: 100;',
      'margin: 0 auto;',
      'padding: 30px;',
      'position: fixed;',
      'left: 0;',
      'right: 0;',
      'width: 100%;',
      'text-align: center;',
      'font-size: 24px;',
      'opacity: 1;'
    ];
    stylesArr.push(type === 'success' ? 'background-color: green;' : 'background-color: red;');

    var node = document.createElement('div');
    node.style = stylesArr.join(' ');

    return node;
  };

  var hideAlert = function (alert) {
    if (!alert) {
      return;
    }
    var currentOpacity = alert.style.opacity;
    var timer = setInterval(function () {
      currentOpacity -= 1 / ALERT_SHOW_STEPS;
      if (currentOpacity <= 0) {
        clearInterval(timer);
        document.body.removeChild(alert);
      }
      alert.style.opacity = currentOpacity;
    }, ALERT_SHOW_TIME / ALERT_SHOW_STEPS);
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

  window.util = {
    isEnterEvent: isEnterEvent,
    getRandomNumber: getRandomNumber,
    getRandomIndex: getRandomIndex,
    getRandomNumberFromRange: getRandomNumberFromRange,
    successHandler: successHandler,
    errorHandler: errorHandler
  };
})();
