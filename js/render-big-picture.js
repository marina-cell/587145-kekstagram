'use strict';

(function () {

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseButton = bigPictureElement.querySelector('.big-picture__cancel');

  var createCommentsFragment = function (comments) {
    var commentsElement = document.querySelector('.social__comments');
    var commentsFragment = document.createDocumentFragment();

    while (commentsElement.firstChild) {
      commentsElement.removeChild(commentsElement.firstChild);
    }

    comments.forEach(function (comment) {
      var commentItem = document.createElement('li');
      commentItem.classList.add('social__comment', 'social__comment--text');

      var commentImage = new Image(35, 35);
      commentImage.classList.add('social__picture');
      commentImage.src = 'img/avatar-' + window.util.getRandomValue(1, 6) + '.svg';
      commentImage.alt = 'Аватар комментатора фотографии';
      commentItem.appendChild(commentImage);
      commentItem.insertAdjacentHTML('beforeend', comment);
      commentsFragment.appendChild(commentItem);
    });
    commentsElement.appendChild(commentsFragment);
    commentsElement.style['padding-top'] = '20px';
  };

  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, closeBigPicture);
  };

  var closeBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
    document.body.classList.remove('modal-open');
  };

  window.renderBigPicture = function (picture) {
    bigPictureElement.classList.remove('hidden');

    bigPictureElement.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
    bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
    bigPictureElement.querySelector('.social__caption').textContent = picture.description;

    createCommentsFragment(picture.comments);
    window.util.hideElements(['.social__comment-count', '.social__loadmore']);

    bigPictureCloseButton.addEventListener('click', function () {
      closeBigPicture();
    });

    document.addEventListener('keydown', onBigPictureEscPress);
    document.body.classList.add('modal-open');
  };
})();
