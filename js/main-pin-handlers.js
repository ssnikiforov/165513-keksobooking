'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var mouseDownMainPinHandler = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var calculateMainPinCoordinates = function (someEvt) {
      var shift = {
        x: startCoords.x - someEvt.clientX,
        y: startCoords.y - someEvt.clientY
      };

      startCoords = {
        x: someEvt.clientX,
        y: someEvt.clientY
      };

      var leftOffset = mainPin.offsetLeft - shift.x;
      var topOffset = mainPin.offsetTop - shift.y;

      return {left: leftOffset, top: topOffset};
    };

    var calculatePinOffset = function (leftOffset, topOffset) {
      var xCoordMax = window.map.mapX.max;
      var xCoordMin = window.map.mapX.min;
      var yCoordMax = window.map.mapY.max;
      var yCoordMin = window.map.mapY.min;

      if (leftOffset > xCoordMax - window.map.pin.width / 2) {
        leftOffset = xCoordMax - window.map.pin.width / 2;
      } else if (leftOffset < xCoordMin + window.map.pin.width / 2) {
        leftOffset = xCoordMin + window.map.pin.width / 2;
      }

      if (topOffset > yCoordMax) {
        topOffset = yCoordMax;
      } else if (topOffset < yCoordMin) {
        topOffset = yCoordMin;
      }

      return {left: leftOffset, top: topOffset};
    };

    var mainPinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var offset = calculateMainPinCoordinates(moveEvt);
      var pinOffset = calculatePinOffset(offset.left, offset.top);

      mainPin.style.left = pinOffset.left + 'px';
      mainPin.style.top = pinOffset.top + 'px';

      window.form.fillAddressField(pinOffset.left, pinOffset.top);
    };

    var mainPinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      var offset = calculateMainPinCoordinates(upEvt);
      var pinOffset = calculatePinOffset(offset.left, offset.top);

      mainPin.style.left = pinOffset.left + 'px';
      mainPin.style.top = pinOffset.top + 'px';

      window.form.fillAddressField(pinOffset.left, pinOffset.top);

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  };
  window.mainPinHandlers = {
    mouseDownMainPinHandler: mouseDownMainPinHandler
  };
})();
