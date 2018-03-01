'use strict';

(function () {
  var MAP_PIN_WIDTH = 62;
  var MAP_PIN_HEIGHT = 84;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var X_COORD_MIN = 0;
  var X_COORD_MAX = mapPins.offsetWidth;

  var Y_COORD_MIN = 150;
  var Y_COORD_MAX = 500;

  var renderMapPins = function (template, ads) {
    var mapPinsTemplate = template.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    for (var i = 0, n = ads.length; i < n; i++) {
      var pinElementTemplate = mapPinsTemplate.cloneNode(true);

      var renderedPinElement = window.pin.renderMapPin(pinElementTemplate, ads[i]);
      addClickListener(renderedPinElement, ads[i]);
      fragment.appendChild(renderedPinElement);
    }

    map.querySelector('.map__pins').appendChild(fragment);
  };

  var addClickListener = function (pinElement, ad) {
    pinElement.addEventListener('click', function () {
      window.card.renderCard(ad);
    });
  };

  window.map = {
    mapX: {
      min: X_COORD_MIN,
      max: X_COORD_MAX,
      getRandomizedValue: function () {
        return window.util.getRandomNumberFromRange(X_COORD_MIN, X_COORD_MAX);
      }
    },
    mapY: {
      min: Y_COORD_MIN,
      max: Y_COORD_MAX,
      getRandomizedValue: function () {
        return window.util.getRandomNumberFromRange(Y_COORD_MIN, Y_COORD_MAX);
      }
    },
    pin: {
      width: MAP_PIN_WIDTH,
      height: MAP_PIN_HEIGHT
    },
    renderMapPins: renderMapPins
  };
})();
