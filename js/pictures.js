'use strict';

var PICTURES_NUMBER = 25;
var MIN_LIKES_NUMBER = 15;
var MAX_LIKES_NUMBER = 200;
var FULL_SCALE = 453;
var DEFAULT_SCALE_VALUE = 100;
var DEFAULT_PERCENT_VALUE = 100;
var MIN_PREVIEW_SIZE = 25;
var PREVIEW_STEP = 25;
var MAX_PREVIEW_SIZE = 100;
var ESC_KEYCODE = 27;
var MAX_HASHTAG_NUMBER = 5;
var MAX_HASHTAG_LENGTH = 20;

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

var picturesEffects = [
  {
    effectId: '#effect-none',
    effectClass: 'effects__preview--none'
  },
  {
    effectId: '#effect-chrome',
    effectClass: 'effects__preview--chrome'
  },
  {
    effectId: '#effect-sepia',
    effectClass: 'effects__preview--sepia'
  },
  {
    effectId: '#effect-marvin',
    effectClass: 'effects__preview--marvin'
  },
  {
    effectId: '#effect-phobos',
    effectClass: 'effects__preview--phobos'
  },
  {
    effectId: '#effect-heat',
    effectClass: 'effects__preview--heat'
  }
];

var bigPictureElement = document.querySelector('.big-picture');
var bigPictureCloseButton = bigPictureElement.querySelector('.big-picture__cancel');
var uploadFileButton = document.querySelector('#upload-file');
var imgUploadWindow = document.querySelector('.img-upload__overlay');
var uploadCloseWindow = document.querySelector('#upload-cancel');
var previewImageBlock = document.querySelector('.img-upload__preview');
var previewImage = previewImageBlock.querySelector('img');
var effectsBlock = document.querySelector('.effects');
var scaleBlock = document.querySelector('.scale');
var scalePin = scaleBlock.querySelector('.scale__pin');
var resizeMinusButton = document.querySelector('.resize__control--minus');
var resizePlusButton = document.querySelector('.resize__control--plus');
var resizeValue = document.querySelector('.resize__control--value');
var uploadForm = document.querySelector('.img-upload__form');
var hashtagText = uploadForm.querySelector('.text__hashtags');
var uploadFormSubmitButton = uploadForm.querySelector('.img-upload__submit');

uploadForm.addEventListener('invalid', function (evt) {
  evt.target.style.outline = '2px solid #ff0000';
  evt.target.addEventListener('keydown', function () {
    evt.target.style = 'initial';
    hashtagText.setCustomValidity('');
  });
}, true);

uploadFormSubmitButton.addEventListener('click', function () {
  if (hashtagText.value !== '') {
    var hashtags = hashtagText.value.split(' ');

    for (var i = 0; i < hashtags.length; i++) {
      var element = hashtags[i];
      if (hashtags[i].indexOf('#') !== 0) {
        hashtagText.setCustomValidity('Хеш-тег должен начинаться с символа # (решётка)');
      }
      if (hashtags[i].substr(1).indexOf('#') !== -1) {
        hashtagText.setCustomValidity('Хэш-теги должны быть отделены пробелами друг от друга');
      }
      if (hashtags[i] === '#') {
        hashtagText.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
      }
      if (i > MAX_HASHTAG_NUMBER - 1) {
        hashtagText.setCustomValidity('Максимальное количество хэш-тегов равно: ' + MAX_HASHTAG_NUMBER);
      }
      if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
        hashtagText.setCustomValidity('Максимальная длина одного хэш-тега равна ' + MAX_HASHTAG_LENGTH + ' символов, включая решётку');
      }
      for (var j = i + 1; j < hashtags.length; j++) {
        if (element.toLowerCase() === hashtags[j].toLowerCase()) {
          hashtagText.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды. Теги нечувствительны к регистру');
        }
      }
    }
  }
});

var changePreviewSize = function (size) {
  resizeValue.readonly = false;
  resizeValue.value = size + '%';
  previewImageBlock.style.transform = 'scale(' + size / 100 + ')';
};

resizeMinusButton.addEventListener('click', function () {
  var size = parseInt(resizeValue.value, 10);
  if (size - PREVIEW_STEP >= MIN_PREVIEW_SIZE) {
    size -= PREVIEW_STEP;
  }

  changePreviewSize(size);
});

resizePlusButton.addEventListener('click', function () {
  var size = parseInt(resizeValue.value, 10);
  if (size + PREVIEW_STEP <= MAX_PREVIEW_SIZE) {
    size += PREVIEW_STEP;
  }

  changePreviewSize(size);
});

var setOffsetForEffect = function (isDefault) {
  var currentEffect = effectsBlock.querySelector('input[name=effect]:checked').value;
  var scaleValue = scaleBlock.querySelector('.scale__value');

  var offset = isDefault ? DEFAULT_SCALE_VALUE : Math.round(scalePin.offsetLeft * 100 / FULL_SCALE);
  scaleValue.value = offset;

  switch (currentEffect) {
    case 'none': previewImage.style.filter = '';
      break;
    case 'chrome': previewImage.style.filter = 'grayscale(' + (offset * 0.01) + ')';
      break;
    case 'sepia': previewImage.style.filter = 'sepia(' + (offset * 0.01) + ')';
      break;
    case 'marvin': previewImage.style.filter = 'invert(' + offset + '%)';
      break;
    case 'phobos': previewImage.style.filter = 'blur(' + (offset * 0.03) + 'px)';
      break;
    case 'heat': previewImage.style.filter = 'brightness(' + (offset * 0.03) + ')';
      break;
  }
};

var changeParamsForEffect = function (effect) {
  previewImage.className = effect.effectClass;
  setOffsetForEffect(true);

  if (effect.effectId === picturesEffects[0].effectId) {
    scaleBlock.classList.add('hidden');
  } else {
    scaleBlock.classList.remove('hidden');
  }
};

var setEventsForEffects = function (effect) {
  effectsBlock.querySelector(effect.effectId).addEventListener('click', function () {
    changeParamsForEffect(effect);
  });
};

scalePin.addEventListener('mouseup', function () {
  setOffsetForEffect();
});

for (var j = 0; j < picturesEffects.length; j++) {
  setEventsForEffects(picturesEffects[j]);
}

var onUploadWindowEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE
      && evt.target.type !== 'text'
      && evt.target.type !== 'textarea') {
    closeUploadWindow();
  }
};

var openUploadWindow = function () {
  imgUploadWindow.classList.remove('hidden');
  changePreviewSize(DEFAULT_PERCENT_VALUE);
  var defaultEffect = {
    effectId: '#' + effectsBlock.querySelector('input[name=effect]:checked').id,
    effectClass: 'effects__preview--' + effectsBlock.querySelector('input[name=effect]:checked').value
  };
  changeParamsForEffect(defaultEffect);

  document.addEventListener('keydown', onUploadWindowEscPress);
};

var closeUploadWindow = function () {
  imgUploadWindow.classList.add('hidden');
  uploadFileButton.value = '';

  document.removeEventListener('keydown', onUploadWindowEscPress);
};

uploadFileButton.addEventListener('change', function () {
  openUploadWindow();
});

uploadCloseWindow.addEventListener('click', function () {
  closeUploadWindow();
});


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

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && evt.target.type !== 'text') {
    closeBigPicture();
  }
};

var closeBigPicture = function () {
  bigPictureElement.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

var renderBigPicture = function (picture) {
  bigPictureElement.classList.remove('hidden');

  bigPictureElement.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
  bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = picture.description;

  createCommentsFragment(picture.comments);
  hideElements(['.social__comment-count', '.social__loadmore']);

  bigPictureCloseButton.addEventListener('click', function () {
    closeBigPicture();
  });

  document.addEventListener('keydown', onBigPictureEscPress);
};

var renderPageElements = function () {
  var picturesForRender = createPicturesArray();

  renderPicturesFragment(picturesForRender);

  var picturesLinks = document.querySelectorAll('.picture__link');

  for (var i = 0; i < picturesLinks.length; i++) {
    setEventsForPictures(picturesLinks[i], picturesForRender[i]);
  }
};

var setEventsForPictures = function (picture, data) {
  picture.addEventListener('click', function () {
    renderBigPicture(data);
  });
};

renderPageElements();
