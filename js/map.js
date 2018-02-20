'use strict';

(function () {
  var NUMBER_OF_ADS = 8;

  var renderMapPins = function (map, template, ads) {
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
      window.card.renderNotice(ad);
    });
  };

  var switchFieldsetsActivation = function (activationFlag) {
    var noticeFieldsets = noticeForm.querySelectorAll('.form__element');

    for (var i = 0, n = noticeFieldsets.length; i < n; i++) {
      noticeFieldsets[i].disabled = !activationFlag;
    }
  };

  var activatePage = function (activationFlag) {
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    switchFieldsetsActivation(activationFlag);
  };

  var mainPinMoveHandler = function () {
    activatePage(true);
    window.form.fillAddressField();
    renderMapPins(map, template, ads);
  };

  var map = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var noticeForm = document.querySelector('.notice__form');
  var mainPin = map.querySelector('.map__pin--main');
  var ads = window.data.getAds(NUMBER_OF_ADS);

  // disable page by default
  var isPageActivated = false;
  switchFieldsetsActivation(isPageActivated);

  mainPin.addEventListener('mouseup', mainPinMoveHandler);
})();
