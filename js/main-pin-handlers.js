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

    var dragged = false;

    var mainPinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var leftOffset = mainPin.offsetLeft - shift.x;
      var topOffset = mainPin.offsetTop - shift.y;

      var pinOffset = calculatePinOffset(leftOffset, topOffset);

      mainPin.style.left = pinOffset.left + 'px';
      mainPin.style.top = pinOffset.top + 'px';

      window.form.fillAddressField(pinOffset.left, pinOffset.top);
    };

    var calculatePinOffset = function (leftOffset, topOffset) {
      var xCoordMax = window.util.map.x.max;
      var xCoordMin = window.util.map.x.min;
      var yCoordMax = window.util.map.y.max;
      var yCoordMin = window.util.map.y.min;

      if (leftOffset > xCoordMax) {
        leftOffset = xCoordMax;
      } else if (leftOffset < xCoordMin) {
        leftOffset = xCoordMin;
      }

      if (topOffset > yCoordMax) {
        topOffset = yCoordMax;
      } else if (topOffset < yCoordMin) {
        topOffset = yCoordMin;
      }

      return {left: leftOffset, top: topOffset};
    };

    var painPinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', painPinMouseUpHandler);

      if (dragged) {
        var clickPreventDefaultHandler = function (clickEvt) {
          clickEvt.preventDefault();
          mainPin.removeEventListener('click', clickPreventDefaultHandler);
        };
        mainPin.addEventListener('click', clickPreventDefaultHandler);
      }
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', painPinMouseUpHandler);
  };
  window.mainPinHandlers = {
    mouseDownMainPinHandler: mouseDownMainPinHandler
  };
})();
