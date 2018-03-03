'use strict';

(function () {
  var PinSize = {
    WIDTH: 65,
    HEIGHT: 65
  };
  var TAIL_HEIGHT = 16;

  var _map = document.querySelector('.map');
  var _mapPins = _map.querySelector('.map__pins');
  var X_COORD_MIN = 0;
  var X_COORD_MAX = _mapPins.offsetWidth;

  var Y_COORD_MIN = 150;
  var Y_COORD_MAX = 500;

  var MAX_NUMBER_OF_PINS_ON_MAP = 4;

  var Price = {
    MIN: 10000,
    MAX: 50000
  };

  var _ads;
  var _template;

  var renderMapPins = function (sourceTemplate, sourceAds) {
    _ads = sourceAds;
    _template = sourceTemplate;

    var mapPinsTemplate = _template.querySelector('.map__pin');

    var mapPinsFilledFragment = getMapPinsFilledFragment(mapPinsTemplate, _ads);

    _map.querySelector('.map__pins').appendChild(mapPinsFilledFragment);
  };

  var getMapPinsFilledFragment = function (pinsTemplate, fillingAds) {
    var fragment = document.createDocumentFragment();
    var resultLength = fillingAds.length < MAX_NUMBER_OF_PINS_ON_MAP ? fillingAds.length : MAX_NUMBER_OF_PINS_ON_MAP;

    for (var i = 0, n = resultLength; i < n; i++) {
      var pinElementCloned = pinsTemplate.cloneNode(true);

      var renderedPinElement = window.pin.renderMapPin(pinElementCloned, fillingAds[i]);
      addClickListener(renderedPinElement, fillingAds[i]);
      fragment.appendChild(renderedPinElement);
    }

    return fragment;
  };

  var addClickListener = function (pinElement, ad) {
    pinElement.addEventListener('click', function () {
      window.card.render(ad);
    });
  };

  var removeMapPins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    [].forEach.call(pins, function (pin) {
      _map.querySelector('.map__pins').removeChild(pin);
    });
  };

  var filters = document.querySelector('.map__filters');
  var typeSelect = filters.querySelector('#housing-type');
  var priceSelect = filters.querySelector('#housing-price');
  var roomsSelect = filters.querySelector('#housing-rooms');
  var guestsSelect = filters.querySelector('#housing-guests');

  var filterValues = {
    type: '',
    price: '',
    rooms: '',
    guest: '',
    featuresList: []
  };

  var filterByValue = function (filteredArray, key, value) {
    return filteredArray.filter(function (filterableItem) {
      return filterableItem.offer[key].toString() === value;
    });
  };

  var filterByPrice = function (filteredArray, value) {
    return filteredArray.filter(function (filterableItem) {
      var price = +filterableItem.offer.price;
      var priceType = 'any';
      if (price >= Price.MIN && price <= Price.MAX) {
        priceType = 'middle';
      } else if (price > Price.MAX) {
        priceType = 'high';
      } else {
        priceType = 'low';
      }
      return priceType === value;
    });
  };

  var filterByFeatures = function (filteredArray) {
    var checkedFeatures = filters.querySelectorAll('#housing-features [type="checkbox"]:checked');
    var filteredByFeaturesArray = filteredArray;
    [].forEach.call(checkedFeatures, function (eachItem) {
      filteredByFeaturesArray = filteredByFeaturesArray.filter(function (item) {
        return item.offer.features.indexOf(eachItem.value) >= 0;
      });
    });
    return filteredByFeaturesArray;
  };

  var updateMapPins = function () {
    var adsCopy = _ads.slice();

    // do filtration
    if (typeSelect.value !== 'any') {
      adsCopy = filterByValue(adsCopy, 'type', typeSelect.value);
    }
    if (priceSelect.value !== 'any') {
      adsCopy = filterByPrice(adsCopy, priceSelect.value);
    }
    if (roomsSelect.value !== 'any') {
      adsCopy = filterByValue(adsCopy, 'rooms', roomsSelect.value);
    }
    if (guestsSelect.value !== 'any') {
      adsCopy = filterByValue(adsCopy, 'guests', guestsSelect.value);
    }
    adsCopy = filterByFeatures(adsCopy);

    // clean map
    removeMapPins();
    window.card.closeAllOpened();

    // render
    var mapPinsTemplate = _template.querySelector('.map__pin');
    var mapPinsFilledFragment = getMapPinsFilledFragment(mapPinsTemplate, adsCopy);
    _map.querySelector('.map__pins').appendChild(mapPinsFilledFragment);
  };

  var addChangeSelectHandler = function (arg) {
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

  addChangeSelectHandler('type');
  addChangeSelectHandler('price');
  addChangeSelectHandler('rooms');
  addChangeSelectHandler('guests');

  var features = document.querySelector('#housing-features');
  features.addEventListener('change', function (evt) {
    if (evt.target.type === 'checkbox') {
      if (evt.target.checked) {
        filterValues.featuresList.push(evt.target.value);
      } else {
        filterValues.featuresList.splice(filterValues.featuresList.indexOf(evt.target.value), 1);
      }
    }
    window.util.debounce(updateMapPins);
  });

  var filterStates = {
    visible: '1',
    hidden: '0'
  };

  var showMapFilters = function (isActive) {
    var mapFiltersContainer = _map.querySelector('.map__filters-container');
    if (isActive) {
      mapFiltersContainer.style.opacity = filterStates.visible;
    } else {
      mapFiltersContainer.style.opacity = filterStates.hidden;
    }
  };

  window.map = {
    axisX: {
      min: X_COORD_MIN,
      max: X_COORD_MAX,
      getRandomizedValue: function () {
        return window.util.getRandomNumberFromRange(X_COORD_MIN, X_COORD_MAX);
      }
    },
    axisY: {
      min: Y_COORD_MIN,
      max: Y_COORD_MAX,
      getRandomizedValue: function () {
        return window.util.getRandomNumberFromRange(Y_COORD_MIN, Y_COORD_MAX);
      }
    },
    pin: {
      width: PinSize.WIDTH,
      height: PinSize.HEIGHT,
      tailHeight: TAIL_HEIGHT
    },
    renderPins: renderMapPins,
    removePins: removeMapPins,
    showFilters: showMapFilters
  };
})();
