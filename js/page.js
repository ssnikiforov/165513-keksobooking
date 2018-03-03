'use strict';

(function () {
  var _map = document.querySelector('.map');
  var _template = document.querySelector('template').content;
  var _cardsForm = document.querySelector('.notice__form');
  var _mainPin = _map.querySelector('.map__pin--main');

  // disable page by default
  var _isPageActivated = false;

  var activatePage = function (activationFlag) {
    if (!activationFlag) {
      _isPageActivated = false;
      _map.classList.add('map--faded');
      _cardsForm.classList.add('notice__form--disabled');
    } else {
      _map.classList.remove('map--faded');
      _cardsForm.classList.remove('notice__form--disabled');
    }
    window.form.switchFieldsetsActivation(activationFlag);
  };

  var successHandler = function (ads) {
    var adsClone = ads.slice();
    window.map.renderPins(_template, adsClone);
    window.map.showFilters(true);
  };

  var mainPinMoveHandler = function (activationFlag) {
    if (!activationFlag) {
      _isPageActivated = true;
      activatePage(_isPageActivated);
      window.backend.load(successHandler, window.util.errorHandler);
      window.form.fillAddressField();
    }
  };

  var initPage = function () {
    window.form.switchFieldsetsActivation(_isPageActivated);

    _mainPin.addEventListener('mousedown', window.mainPinHandlers.mouseDown);

    window.form.run();
  };

  initPage();

  window.page = {
    activate: activatePage,
    mainPinMoveHandler: mainPinMoveHandler
  };
})();
