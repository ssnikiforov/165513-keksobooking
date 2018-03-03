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

  var map = document.querySelector('.map');

  var modifyFeatures = function (featureListElement, ad, cardElement) {
    var missingFeatures = FEATURES.filter(function (feature) {
      return !ad.offer.features.includes(feature);
    });

    missingFeatures.forEach(function (missingFeature) {
      featureListElement.removeChild(featureListElement.querySelector('.feature--' + missingFeature));
    });

    if (!featureListElement.getElementsByClassName('feature').length) {
      cardElement.removeChild(featureListElement);
    }
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
      bungalo: 'Сарай',
      house: 'Дом'
    };

    var adType = ad.offer.type;

    if (adType in adTypesReference) {
      typeElement.textContent = adTypesReference[adType];
    }
  };

  var modifyCard = function (template, ad) {
    var cardEl = template.cloneNode(true);
    cardEl.querySelector('h3').textContent = ad.offer.title;
    cardEl.querySelector('p small').textContent = ad.offer.address;
    cardEl.querySelector('.popup__price').textContent = '';

    var priceEl = document.createTextNode(ad.offer.price + ' \u20BD/ночь');
    cardEl.querySelector('.popup__price').appendChild(priceEl);

    var typeEl = cardEl.querySelector('h4');
    modifyTypes(typeEl, ad);

    var roomsAndGuestEl = cardEl.querySelector('h4').nextElementSibling;
    roomsAndGuestEl.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

    var checkInCheckOutEl = roomsAndGuestEl.nextElementSibling;
    checkInCheckOutEl.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresListEl = cardEl.querySelector('.popup__features');
    modifyFeatures(featuresListEl, ad, cardEl);

    var photosListEl = cardEl.querySelector('.popup__pictures');
    var descriptionEl = photosListEl.previousElementSibling;
    descriptionEl.textContent = ad.offer.description;

    modifyPhotos(photosListEl, ad);

    cardEl.querySelector('.popup__avatar').src = ad.author.avatar;

    return cardEl;
  };

  var addCloseCardEventListeners = function (card) {
    var closeCardEl = card.querySelector('.popup__close');

    closeCardEl.addEventListener('click', function () {
      closeCard(card);
    });
    closeCardEl.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, closeCard, card);
    });
    window.addEventListener('keydown', pressEscButtonHandler);
  };

  var closeCard = function (card) {
    map.removeChild(card);
    window.removeEventListener('keydown', pressEscButtonHandler);
  };

  var closeAllOpenedCards = function () {
    var openedCards = map.querySelectorAll('.map__card');
    [].forEach.call(openedCards, function (openedCard) {
      closeCard(openedCard);
    });
  };

  var pressEscButtonHandler = function (evt) {
    var cardEl = map.querySelector('.map__card');

    window.util.isEscEvent(evt, closeCard, cardEl);
  };

  var renderCard = function (ad) {
    var templateEl = document.querySelector('template').content;
    var cardTemplate = templateEl.querySelector('.map__card');
    var cardElementTemplate = cardTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(modifyCard(cardElementTemplate, ad));

    closeAllOpenedCards();

    var mapFiltersContainer = map.querySelector('.map__filters-container');
    map.insertBefore(fragment, mapFiltersContainer);

    var cardEl = map.querySelector('.map__card');
    addCloseCardEventListeners(cardEl);
  };

  window.card = {
    render: renderCard,
    closeAllOpened: closeAllOpenedCards
  };
})();
