'use strict';

(function () {

  var successHandler = function (picturesForRender) {
    window.renderPicturesFragment(picturesForRender);

    var picturesLinks = document.querySelectorAll('.picture__link');

    var setEventsForPictures = function (picture, data) {
      picture.addEventListener('click', function () {
        window.renderBigPicture(data);
      });
    };

    for (var i = 0; i < picturesLinks.length; i++) {
      setEventsForPictures(picturesLinks[i], picturesForRender[i]);
    }
  };

  window.backend.load(successHandler, window.backend.errorHandler);
})();
