'use strict';

(function () {
  var NUMBER_OF_ADS = 8;

  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var noticeForm = document.querySelector('.notice__form');
  var mainPin = map.querySelector('.map__pin--main');
  var ads = window.data.getAds(NUMBER_OF_ADS);

  var activatePage = function (activationFlag) {
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    window.form.switchFieldsetsActivation(activationFlag);
  };

  var mainPinMoveHandler = function () {
    if (!isPageActivated) {
      isPageActivated = true;
      activatePage(isPageActivated);
      window.map.renderMapPins(map, template, ads);
      window.form.fillAddressField();
    }
  };

  // disable page by default
  var isPageActivated = false;
  window.form.switchFieldsetsActivation(isPageActivated);

  mainPin.addEventListener('mouseup', mainPinMoveHandler);

  window.form.runForm();
})();
