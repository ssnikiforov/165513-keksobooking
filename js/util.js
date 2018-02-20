'use strict';

(function () {
  var X_COORD_MIN = 0;
  var X_COORD_MAX = 1200;
  var Y_COORD_MIN = 150;
  var Y_COORD_MAX = 500;

  var MAP_PIN_WIDTH = 62;
  var MAP_PIN_HEIGHT = 84;

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

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomIndex: getRandomIndex,
    getRandomNumberFromRange: getRandomNumberFromRange,
    pin: {
      width: MAP_PIN_WIDTH,
      height: MAP_PIN_HEIGHT
    },
    map: {
      x: {
        min: X_COORD_MIN,
        max: X_COORD_MAX,
        getRandomizedValue: function () {
          return window.util.getRandomNumberFromRange(X_COORD_MIN, X_COORD_MAX);
        }
      },
      y: {
        min: Y_COORD_MIN,
        max: Y_COORD_MAX,
        getRandomizedValue: function () {
          return window.util.getRandomNumberFromRange(Y_COORD_MIN, Y_COORD_MAX);
        }
      }
    }
  };
})();
