'use strict';

var PICTURES_NUMBER = 25;
var MIN_LIKES_NUMBER = 15;
var MAX_LIKES_NUMBER = 200;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var getRandomValue = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

var getRandomValueFromArray = function (array) {
  return array[getRandomValue(0, array.length - 1)];
};

var getRandomComments = function (array) {
  var comments = [];
  for (var i = 0; i < PICTURES_NUMBER; i++) {
    comments[i] = [];
    comments[i].push(getRandomValueFromArray(array));
    // Добавление второго комментария (случайным образом)
    if (Math.round(Math.random())) {
      var anotherComment = getRandomValueFromArray(array);
      if (comments[i] !== anotherComment) {
        comments[i].push(getRandomValueFromArray(array));
      }
    }
  }
  return comments;
};

var getRandomUrlArray = function () {
  var urls = [];
  var i = 0;
  while (urls.length < PICTURES_NUMBER) {
    var address = getRandomValue(1, PICTURES_NUMBER);
    if (urls.indexOf('photos/' + address + '.jpg') === -1) {
      urls[i++] = 'photos/' + address + '.jpg';
    }
  }
  return urls;
};

var createPicturesArray = function () {
  var pictures = [];
  var urls = getRandomUrlArray();
  var comments = getRandomComments(COMMENTS);
  for (var i = 0; i < PICTURES_NUMBER; i++) {
    pictures[i] = {
      url: urls[i],
      likes: getRandomValue(MIN_LIKES_NUMBER, MAX_LIKES_NUMBER),
      comments: comments[i],
      description: getRandomValueFromArray(DESCRIPTIONS)
    };
  }
  return pictures;
};

var renderPicture = function (picture) {
  var pictureTemplate = document.querySelector('#picture').content;
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

  return pictureElement;
};

var renderPicturesFragment = function (pictures) {
  var picturesListElement = document.querySelector('.pictures');
  var picturesFragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    picturesFragment.appendChild(renderPicture(pictures[i]));
  }
  picturesListElement.appendChild(picturesFragment);
};

var createCommentsFragment = function (comments) {
  var commentsElement = document.querySelector('.social__comments');
  var commentsFragment = document.createDocumentFragment();

  while (commentsElement.firstChild) {
    commentsElement.removeChild(commentsElement.firstChild);
  }

  for (var i = 0; i < comments.length; i++) {
    var commentItem = document.createElement('li');
    commentItem.classList.add('social__comment', 'social__comment--text');

    var commentImage = new Image(35, 35);
    commentImage.classList.add('social__picture');
    commentImage.src = 'img/avatar-' + getRandomValue(1, 6) + '.svg';
    commentImage.alt = 'Аватар комментатора фотографии';
    commentItem.appendChild(commentImage);
    commentItem.insertAdjacentHTML('beforeend', comments[i]);
    commentsFragment.appendChild(commentItem);
  }
  commentsElement.appendChild(commentsFragment);
  commentsElement.style['padding-top'] = '20px';
};

var hideElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    document.querySelector(elements[i]).classList.add('visually-hidden');
  }
};

var renderBigPicture = function (picture) {
  var bigPictureElement = document.querySelector('.big-picture');

  bigPictureElement.classList.remove('hidden');

  bigPictureElement.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
  bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = picture.description;

  createCommentsFragment(picture.comments);
  hideElements(['.social__comment-count', '.social__loadmore']);
};

var renderPageElements = function () {
  var picturesForRender = createPicturesArray();

  renderPicturesFragment(picturesForRender);
  renderBigPicture(picturesForRender[0]);
};

renderPageElements();
