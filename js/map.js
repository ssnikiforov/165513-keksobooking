'use strict';

(function () {
  var NUMBER_OF_ADS = 8;

  var renderMapPin = function (template, ad) {
    var pinElement = template.cloneNode(true);
    var avatarElement = pinElement.querySelector('img');

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';
    avatarElement.src = ad.author.avatar;

    return pinElement;
  };

  var renderMapPins = function (map, template, ads) {
    var mapPinsTemplate = template.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    for (var i = 0, n = ads.length; i < n; i++) {
      var pinElementTemplate = mapPinsTemplate.cloneNode(true);

      var renderedPinElement = renderMapPin(pinElementTemplate, ads[i]);
      addClickListener(renderedPinElement, ads[i]);
      fragment.appendChild(renderedPinElement);
    }

    map.querySelector('.map__pins').appendChild(fragment);
  };

  var addClickListener = function (pinElement, ad) {
    pinElement.addEventListener('click', function () {
      renderNotice(ad);
    });
  };

  var modifyFeatures = function (featureListElement, ad) {
    var features = window.data.constants.features;
    var missingFeatures = features.filter(function (feature) {
      return !ad.offer.features.includes(feature);
    });

    missingFeatures.forEach(function (missingFeature) {
      featureListElement.removeChild(featureListElement.querySelector('.feature--' + missingFeature));
    });
  };

  var modifyPhotos = function (photoListElement, ad) {
    var photoListItemEl = photoListElement.querySelector('li');
    while (photoListElement.firstChild) {
      photoListElement.removeChild(photoListElement.firstChild);
    }
    ad.offer.photos.forEach(function (photo) {
      var photoListItemElCloned = photoListItemEl.cloneNode(true);
      var photoImgElCloned = photoListItemElCloned.firstChild;
      photoImgElCloned.src = photo;
      photoImgElCloned.width = '100';
      photoImgElCloned.height = '100';
      photoListElement.appendChild(photoListItemElCloned);
    });
  };

  var modifyTypes = function (typeElement, ad) {
    var adTypesReference = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом'
    };

    var adType = ad.offer.type;

    if (adType in adTypesReference) {
      typeElement.textContent = adTypesReference[adType];
    }
  };

  var modifyNotice = function (template, ad) {
    var noticeElement = template.cloneNode(true);
    noticeElement.querySelector('h3').textContent = ad.offer.title;
    noticeElement.querySelector('p small').textContent = ad.offer.address;
    noticeElement.querySelector('.popup__price').textContent = '';

    var priceEl = document.createTextNode(ad.offer.price + ' \u20BD/ночь');
    noticeElement.querySelector('.popup__price').appendChild(priceEl);

    var typeEl = noticeElement.querySelector('h4');
    modifyTypes(typeEl, ad);

    var roomsAndGuestEl = noticeElement.querySelector('h4').nextElementSibling;
    roomsAndGuestEl.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

    var checkInCheckOutEl = roomsAndGuestEl.nextElementSibling;
    checkInCheckOutEl.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresListEl = noticeElement.querySelector('.popup__features');
    modifyFeatures(featuresListEl, ad);

    var descriptionEl = featuresListEl.nextElementSibling;
    descriptionEl.textContent = ad.offer.description;

    var photosListEl = noticeElement.querySelector('.popup__pictures');
    modifyPhotos(photosListEl, ad);

    noticeElement.querySelector('.popup__avatar').src = ad.author.avatar;

    return noticeElement;
  };

  var renderNotice = function (ad) {
    var noticeTemplate = template.querySelector('.map__card');
    var noticeElementTemplate = noticeTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(modifyNotice(noticeElementTemplate, ad));

    var mapFiltersContainer = map.querySelector('.map__filters-container');
    map.insertBefore(fragment, mapFiltersContainer);
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

  window.map = map;
})();
