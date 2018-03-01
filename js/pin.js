'use strict';

(function () {
  var renderMapPin = function (template, ad) {
    var pinElement = template.cloneNode(true);
    var avatarElement = pinElement.querySelector('img');

    pinElement.style.left = ad.location.x - window.map.pin.width / 2 + 'px';
    pinElement.style.top = ad.location.y - window.map.pin.height + 'px';
    avatarElement.src = ad.author.avatar;

    return pinElement;
  };

  window.pin = {
    renderMapPin: renderMapPin
  };
})();
