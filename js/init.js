'use strict';

(function () {
  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var noticeForm = document.querySelector('.notice__form');
  var mainPin = map.querySelector('.map__pin--main');

  var activatePage = function (activationFlag) {
    if (!activationFlag) {
      isPageActivated = false;
      map.classList.add('map--faded');
      noticeForm.classList.add('notice__form--disabled');
    } else {
      map.classList.remove('map--faded');
      noticeForm.classList.remove('notice__form--disabled');
    }
    window.form.switchFieldsetsActivation(activationFlag);
  };

  var successHandler = function (ads) {
    window.map.renderMapPins(map, template, ads);
  };

  var mainPinMoveHandler = function () {
    if (!isPageActivated) {
      isPageActivated = true;
      activatePage(isPageActivated);
      window.backend.load(successHandler, window.util.errorHandler);
      window.form.fillAddressField();
    }
  };

  // disable page by default
  var isPageActivated = false;
  window.form.switchFieldsetsActivation(isPageActivated);

  mainPin.addEventListener('mouseup', mainPinMoveHandler);
  mainPin.addEventListener('mousedown', mainPinMoveHandler);
  mainPin.addEventListener('mousedown', window.mainPinHandlers.mouseDownMainPinHandler);

  window.form.runForm();

  window.init = {
    activatePage: activatePage
  };
})();
