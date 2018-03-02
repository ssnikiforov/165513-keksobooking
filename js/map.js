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

  var MAX_NUMBER_OF_PINS_ON_MAP = 4;

  var ads;
  var template;

  var renderMapPins = function (sourceTemplate, sourceAds) {
    ads = sourceAds;
    template = sourceTemplate;

    var mapPinsTemplate = template.querySelector('.map__pin');

    var mapPinsFilledFragment = getMapPinsFilledFragment(mapPinsTemplate, ads, MAX_NUMBER_OF_PINS_ON_MAP);

    map.querySelector('.map__pins').appendChild(mapPinsFilledFragment);
  };

  var getMapPinsFilledFragment = function (pinsTemplate, adsTemp, length) {
    var fragment = document.createDocumentFragment();

    for (var i = 0, n = length; i < n; i++) {
      var pinElementCloned = pinsTemplate.cloneNode(true);

      var renderedPinElement = window.pin.renderMapPin(pinElementCloned, adsTemp[i]);
      addClickListener(renderedPinElement, adsTemp[i]);
      fragment.appendChild(renderedPinElement);
    }

    return fragment;
  };

  var addClickListener = function (pinElement, ad) {
    pinElement.addEventListener('click', function () {
      window.card.renderCard(ad);
    });
  };

  var removeMapPins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0, n = pins.length; i < n; i++) {
      map.querySelector('.map__pins').removeChild(pins[i]);
    }
  };

  var filterValues = {
    'type': '',
    'price': '',
    'rooms': '',
    'guest': '',
    'featuresList': []
  };

  var PRICE_VALUES = {
    LOW_MIN: 0,
    LOW_MAX: 10000,
    MIDDLE_MAX: 50000,
    low: 'low',
    middle: 'middle',
    high: 'high'
  };

  var checkPrice = function (val) {
    if (val >= PRICE_VALUES.LOW_MIN && val < PRICE_VALUES.LOW_MAX) {
      return PRICE_VALUES.low;
    } else if (val >= PRICE_VALUES.LOW_MAX && val < PRICE_VALUES.MIDDLE_MAX) {
      return PRICE_VALUES.middle;
    } else if (val >= PRICE_VALUES.MIDDLE_MAX) {
      return PRICE_VALUES.high;
    }
    return true;
  };

  var getRank = function (elem) {
    var rank = 0;
    if (elem.offer.type === filterValues.type) {
      rank += 1;
    }
    if (checkPrice(elem.offer.price) === filterValues.price) {
      rank += 1;
    }
    if (elem.offer.rooms === +filterValues.rooms) {
      rank += 1;
    }
    if (elem.offer.guests === +filterValues.guests) {
      rank += 1;
    }
    for (var i = 0; i < filterValues.featuresList.length; i++) {
      var condition = elem.offer.features.some(function (it) {
        return it === filterValues.featuresList[i];
      });
      if (condition) {
        rank += 1;
      }
    }
    return rank;
  };

  var updateMapPins = function () {
    removeMapPins();
    window.card.closeAllOpenedCards();

    var adsCopy = ads.slice();
    var mapPinsTemplate = template.querySelector('.map__pin');

    var adSorted = adsCopy.sort(function (left, right) {
      return getRank(right) - getRank(left);
    });

    var mapPinsFilledFragment = getMapPinsFilledFragment(mapPinsTemplate, adSorted, MAX_NUMBER_OF_PINS_ON_MAP);
    map.querySelector('.map__pins').appendChild(mapPinsFilledFragment);
  };

  var addSelectOnChange = function (arg) {
    var node = document.querySelector('#housing-' + arg);
    node.addEventListener('change', function () {
      if (node.value === 'any') {
        filterValues[arg + ''] = true;
      } else {
        filterValues[arg + ''] = node.value;
      }

      window.util.debounce(updateMapPins);
    });
  };

  addSelectOnChange('type');
  addSelectOnChange('price');
  addSelectOnChange('rooms');
  addSelectOnChange('guests');

  var filterStates = {
    visible: '1',
    hidden: '0'
  };

  var showMapFilters = function (isActive) {
    var mapFiltersContainer = map.querySelector('.map__filters-container');
    if (isActive) {
      mapFiltersContainer.style.opacity = filterStates.visible;
    } else {
      mapFiltersContainer.style.opacity = filterStates.hidden;
    }
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
    renderMapPins: renderMapPins,
    removeMapPins: removeMapPins,
    showMapFilters: showMapFilters
  };
})();
