'use strict';

(function () {
  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var cardsForm = document.querySelector('.notice__form');
  var mainPin = map.querySelector('.map__pin--main');

  var isPageActive = false;

  var activatePage = function () {
    if (!window.page.isActive) {
      window.page.isActive = true;
      window.backend.load(successHandler, window.util.errorHandler);
      map.classList.remove('map--faded');
      cardsForm.classList.remove('notice__form--disabled');
      window.form.fillAddressField();

      window.form.switchFieldsetsActivation(true);
      window.form.changePrices(true);
    }
  };

  var disablePage = function () {
    if (window.page.isActive) {
      window.page.isActive = false;
      map.classList.add('map--faded');
      cardsForm.classList.add('notice__form--disabled');

      window.form.switchFieldsetsActivation(false);
      window.form.changePrices(false);
    }
  };

  var successHandler = function (ads) {
    var adsClone = ads.slice();
    window.map.renderPins(template, adsClone);
    window.map.showFilters(true);
  };

  var initPage = function () {
    window.form.switchFieldsetsActivation(false);
    mainPin.addEventListener('mousedown', window.mainPinHandlers.mouseDown);
    window.form.run();
  };

  initPage();

  window.page = {
    activate: activatePage,
    disable: disablePage,
    isActive: isPageActive
  };
})();
