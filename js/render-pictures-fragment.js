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

  window.renderPicturesFragment = function (pictures) {
    var picturesListElement = document.querySelector('.pictures');
    var picturesFragment = document.createDocumentFragment();

    for (var i = 0; i < pictures.length; i++) {
      picturesFragment.appendChild(renderPicture(pictures[i]));
    }
    picturesListElement.appendChild(picturesFragment);
  };
})();
