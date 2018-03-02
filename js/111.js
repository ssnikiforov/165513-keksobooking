/**
 * Created by snikiforov on 02/03/2018.
 */
// Файл debounce.js
'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 300; // ms

  var lastTimeout;
  window.debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  }
})();

// Файл similar.js
'use strict';
(function () {
  var coatColor;
  var eyesColor;
  var wizards = [];

  var getRank = function (wizard) {
    var rank = 0;

    if (wizard.colorCoat === coatColor) {
      rank += 2;
    }
    if (wizard.colorEyes === eyesColor) {
      rank += 1;
    }

    return rank;
  }

  var updateWizards = function () {
    window.render(wizards.slice().
    sort(function (left, right) {
      var rankDiff = getRank(right) - getRank(left);
      if (rankDiff === 0) {
        rankDiff = wizards.indexOf(left) - wizards.indexOf(right);
      }
      return rankDiff;
    }));
  }

  window.wizard.onEyesChange = function (color) {
    eyesColor = color;
    window.debounce(updateWizards);
  }

  window.wizard.onCoatChange = function (color) {
    coatColor = color;
    window.debounce(updateWizards);
  }

  var successHandler = function (data) {
    wizards = data;
    updateWizards();
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  var URL = 'https://1510.dump.academy/code-and-magick/data';
  window.load(URL, successHandler, errorHandler);
})();
