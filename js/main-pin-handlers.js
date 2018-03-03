'use strict';

(function () {
  var _map = document.querySelector('.map');
  var _mainPin = _map.querySelector('.map__pin--main');
  var _isPageActive = false;

  var mouseDownMainPinHandler = function (evt) {
    evt.preventDefault();

    if (!_isPageActive) {
      window.page.mainPinMoveHandler(_isPageActive);
      _isPageActive = true;
    }

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

      var leftOffset = _mainPin.offsetLeft - shift.x;
      var topOffset = _mainPin.offsetTop - shift.y;

      return {left: leftOffset, top: topOffset};
    };

    var calculatePinOffset = function (leftOffset, topOffset) {
      var xCoordMax = window.map.axisX.max;
      var xCoordMin = window.map.axisX.min;
      var yCoordMax = window.map.axisY.max;
      var yCoordMin = window.map.axisY.min;

      var mapPinWidthCorrection = Math.ceil(window.map.pin.width / 2);
      var mapPinHeightCorrection = window.map.pin.height - window.map.pin.tailHeight;

      if (leftOffset > xCoordMax - mapPinWidthCorrection) {
        leftOffset = xCoordMax - mapPinWidthCorrection;
      } else if (leftOffset < xCoordMin + mapPinWidthCorrection) {
        leftOffset = xCoordMin + mapPinWidthCorrection;
      }

      if (topOffset > yCoordMax - mapPinHeightCorrection) {
        topOffset = yCoordMax - mapPinHeightCorrection;
      } else if (topOffset < yCoordMin - mapPinHeightCorrection) {
        topOffset = yCoordMin - mapPinHeightCorrection;
      }

      return {left: leftOffset, top: topOffset};
    };

    var mainPinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var offset = calculateMainPinCoordinates(moveEvt);
      var pinOffset = calculatePinOffset(offset.left, offset.top);

      _mainPin.style.left = pinOffset.left + 'px';
      _mainPin.style.top = pinOffset.top + 'px';

      window.form.fillAddressField(pinOffset.left, pinOffset.top);
    };

    var mainPinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      var offset = calculateMainPinCoordinates(upEvt);
      var pinOffset = calculatePinOffset(offset.left, offset.top);

      _mainPin.style.left = pinOffset.left + 'px';
      _mainPin.style.top = pinOffset.top + 'px';

      window.form.fillAddressField(pinOffset.left, pinOffset.top);

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  };
  window.mainPinHandlers = {
    mouseDown: mouseDownMainPinHandler
  };
})();
