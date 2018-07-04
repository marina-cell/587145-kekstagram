'use strict';

(function () {

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
    var CHILDREN_NUMBER = 2;

    while (picturesListElement.children.length > CHILDREN_NUMBER) {
      picturesListElement.removeChild(picturesListElement.lastChild);
    }

    var picturesFragment = document.createDocumentFragment();

    for (var i = 0; i < window.gallery.filtered.length; i++) {
      picturesFragment.appendChild(renderPicture(window.gallery.filtered[i]));
    }
    picturesListElement.appendChild(picturesFragment);

    var picturesLinks = document.querySelectorAll('.picture__link');

    var setEventsForPictures = function (picture, data) {
      picture.addEventListener('click', function () {
        window.renderBigPicture(data);
      });
    };

    for (var j = 0; j < picturesLinks.length; j++) {
      setEventsForPictures(picturesLinks[j], window.gallery.filtered[j]);
    }
  };
})();
