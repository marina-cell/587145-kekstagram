'use strict';

(function () {

  var picturesLinks = document.querySelectorAll('.picture__link');

  var picturesForRender = window.createPicturesArray();

  window.renderPicturesFragment(picturesForRender);

  var setEventsForPictures = function (picture, data) {
    picture.addEventListener('click', function () {
      window.renderBigPicture(data);
    });
  };

  for (var i = 0; i < picturesLinks.length; i++) {
    setEventsForPictures(picturesLinks[i], picturesForRender[i]);
  }
})();
