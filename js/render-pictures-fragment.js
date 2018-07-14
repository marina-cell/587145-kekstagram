'use strict';

(function () {
  var CHILDREN_NUMBER = 2;

  var renderPicture = function (picture) {
    var pictureTemplate = document.querySelector('#picture').content;
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    return pictureElement;
  };

  window.renderPicturesFragment = function () {
    var picturesListElement = document.querySelector('.pictures');

    while (picturesListElement.children.length > CHILDREN_NUMBER) {
      picturesListElement.removeChild(picturesListElement.lastChild);
    }

    var picturesFragment = document.createDocumentFragment();

    window.gallery.filtered.forEach(function (picture) {
      picturesFragment.appendChild(renderPicture(picture));
    });

    picturesListElement.appendChild(picturesFragment);

    var picturesLinks = document.querySelectorAll('.picture__link');

    var setEventsForPictures = function (picture, data) {
      picture.addEventListener('click', function () {
        window.renderBigPicture(data);
      });
    };

    Array.from(picturesLinks).forEach(function (link, index) {
      setEventsForPictures(link, window.gallery.filtered[index]);
    });
  };
})();
