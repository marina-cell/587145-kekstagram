'use strict';

window.util = (function () {
  var ESC_KEYCODE = 27;

  return {
    getRandomValue: function (minValue, maxValue) {
      return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    },
    getRandomValueFromArray: function (array) {
      return array[this.getRandomValue(0, array.length - 1)];
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE
          && evt.target.type !== 'text'
          && evt.target.type !== 'textarea') {
        action();
      }
    }
  };
})();
