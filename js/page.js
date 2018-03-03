'use strict';

(function () {
  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var cardsForm = document.querySelector('.notice__form');
  var mainPin = map.querySelector('.map__pin--main');

  // disable page by default
  var isPageActive = false;

  var activatePage = function (activationFlag) {
    if (activationFlag) { // do page active
      isPageActive = true;
      window.backend.load(successHandler, window.util.errorHandler);
      map.classList.remove('map--faded');
      cardsForm.classList.remove('notice__form--disabled');
      window.form.fillAddressField();
    } else { // do page inactive
      isPageActive = false;
      map.classList.add('map--faded');
      cardsForm.classList.add('notice__form--disabled');
    }
    window.form.switchFieldsetsActivation(activationFlag);
  };

  var successHandler = function (ads) {
    var adsClone = ads.slice();
    window.map.renderPins(template, adsClone);
    window.map.showFilters(true);
  };

  var initPage = function () {
    window.form.switchFieldsetsActivation(isPageActive);

    mainPin.addEventListener('mousedown', window.mainPinHandlers.mouseDown);

    window.form.run();
  };

  initPage();

  window.page = {
    activate: activatePage,
    isActive: isPageActive
  };
})();
