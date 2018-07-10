'use strict';

(function () {

  var DISPLAYED_COMMENTS_COUNT = 5;
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseButton = bigPictureElement.querySelector('.big-picture__cancel');
  var commentsCountElement = bigPictureElement.querySelector('.social__comment-count');

  var renderCommentsCounts = function (count, totalCount) {
    commentsCountElement.innerHTML = count + ' из ' + '<span class="comments-count">' + totalCount + '</span> комментариев';
  };

  var createCommentsFragment = function (comments) {
    var commentsElement = document.querySelector('.social__comments');
    var loadMoreButton = document.querySelector('.social__loadmore');
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
      commentItem.style.display = 'none';
      commentItem.insertAdjacentHTML('beforeend', comment);
      commentsFragment.appendChild(commentItem);
    });

    commentsElement.appendChild(commentsFragment);

    var length = comments.length;
    if (comments.length <= DISPLAYED_COMMENTS_COUNT) {
      loadMoreButton.classList.add('visually-hidden');
    } else {
      length = DISPLAYED_COMMENTS_COUNT;
      loadMoreButton.classList.remove('visually-hidden');
    }

    var renderMoreComments = function () {
      length += DISPLAYED_COMMENTS_COUNT;
      if (length >= comments.length) {
        length = comments.length;
        loadMoreButton.classList.add('visually-hidden');
        loadMoreButton.removeEventListener('click', renderMoreComments);
      }

      renderCommentsCounts(length, comments.length);
      renderComments(length);
    };

    loadMoreButton.addEventListener('click', renderMoreComments);

    renderComments(length);
  };

  var renderComments = function (length) {
    var commentElements = document.querySelectorAll('.social__comment');
    for (var i = 0; i < length; i++) {
      commentElements[i].style.display = '';
    }
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

    bigPictureElement.querySelector('.social__caption').textContent = picture.description;

    var commentsCount = picture.comments.length < DISPLAYED_COMMENTS_COUNT ? picture.comments.length : DISPLAYED_COMMENTS_COUNT;
    renderCommentsCounts(commentsCount, picture.comments.length);

    createCommentsFragment(picture.comments);

    bigPictureCloseButton.addEventListener('click', function () {
      closeBigPicture();
    });

    document.addEventListener('keydown', onBigPictureEscPress);
    document.body.classList.add('modal-open');
  };
})();
