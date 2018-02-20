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

      var topOffset = mainPin.offsetTop - shift.y;
      var leftOffset = mainPin.offsetLeft - shift.x;
      mainPin.style.top = topOffset + 'px';
      mainPin.style.left = leftOffset + 'px';

      window.form.fillAddressField();
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
  mainPin.addEventListener('mousedown', mouseDownMainPinHandler);
})();
