'use strict';

(function () {
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var modifyFeatures = function (featureListElement, ad) {
    var missingFeatures = FEATURES.filter(function (feature) {
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

  var modifyCard = function (template, ad) {
    var cardElement = template.cloneNode(true);
    cardElement.querySelector('h3').textContent = ad.offer.title;
    cardElement.querySelector('p small').textContent = ad.offer.address;
    cardElement.querySelector('.popup__price').textContent = '';

    var priceEl = document.createTextNode(ad.offer.price + ' \u20BD/ночь');
    cardElement.querySelector('.popup__price').appendChild(priceEl);

    var typeEl = cardElement.querySelector('h4');
    modifyTypes(typeEl, ad);

    var roomsAndGuestEl = cardElement.querySelector('h4').nextElementSibling;
    roomsAndGuestEl.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

    var checkInCheckOutEl = roomsAndGuestEl.nextElementSibling;
    checkInCheckOutEl.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresListEl = cardElement.querySelector('.popup__features');
    modifyFeatures(featuresListEl, ad);

    var descriptionEl = featuresListEl.nextElementSibling;
    descriptionEl.textContent = ad.offer.description;

    var photosListEl = cardElement.querySelector('.popup__pictures');
    modifyPhotos(photosListEl, ad);

    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

    return cardElement;
  };

  var renderCard = function (ad) {
    var map = document.querySelector('.map');
    var templateEl = document.querySelector('template').content;
    var cardTemplate = templateEl.querySelector('.map__card');
    var cardElementTemplate = cardTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(modifyCard(cardElementTemplate, ad));

    var openedCards = map.querySelectorAll('.map__card');
    for (var i = 0, n = openedCards.length; i < n; i++) {
      map.removeChild(openedCards[i]);
    }

    var mapFiltersContainer = map.querySelector('.map__filters-container');
    map.insertBefore(fragment, mapFiltersContainer);
  };

  window.card = {
    renderCard: renderCard
  };
})();
