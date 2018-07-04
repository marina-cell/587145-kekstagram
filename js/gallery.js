'use strict';

(function () {

  var successHandler = function (picturesForRender) {
    window.gallery = {
      initial: picturesForRender,
      filtered: picturesForRender
    };

    window.renderPicturesFragment();
    window.filters.renderFilterBlock();
  };

  window.backend.load(successHandler, window.backend.errorHandler);
})();
