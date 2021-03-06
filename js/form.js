'use strict';

(function () {

  var MAX_HASHTAG_NUMBER = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var FULL_SCALE = 453;
  var DEFAULT_SCALE_VALUE = 100;
  var MAX_PERCENT_VALUE = 100;
  var DEFAULT_PERCENT_VALUE = MAX_PERCENT_VALUE;
  var MAX_EFFECT_VALUE = 3;
  var MIN_PREVIEW_SIZE = 25;
  var PREVIEW_STEP = 25;
  var MAX_PREVIEW_SIZE = 100;

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

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadFileButton = document.querySelector('#upload-file');
  var uploadFormSubmitButton = uploadForm.querySelector('.img-upload__submit');
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
  var hashtagText = uploadForm.querySelector('.text__hashtags');
  var descriptionText = uploadForm.querySelector('.text__description');

  var calculateScaleOffset = function (coordinate) {
    var value = Math.round(coordinate * 100 / FULL_SCALE);
    value = (value < 0) ? 0 : value;
    value = (value > 100) ? 100 : value;
    return value;
  };

  var setOffsetForEffect = function (isDefault) {
    var currentEffect = effectsBlock.querySelector('input[name=effect]:checked').value;
    var scaleValue = scaleBlock.querySelector('.scale__value');
    var scaleLevel = scaleBlock.querySelector('.scale__level');

    var offset = isDefault ? DEFAULT_SCALE_VALUE : calculateScaleOffset(scalePin.offsetLeft);
    scaleValue.value = offset;
    scaleLevel.style.width = offset + '%';
    scalePin.style.left = offset + '%';

    switch (currentEffect) {
      case 'none': previewImage.style.filter = '';
        break;
      case 'chrome': previewImage.style.filter = 'grayscale(' + (offset / MAX_PERCENT_VALUE) + ')';
        break;
      case 'sepia': previewImage.style.filter = 'sepia(' + (offset / MAX_PERCENT_VALUE) + ')';
        break;
      case 'marvin': previewImage.style.filter = 'invert(' + offset + '%)';
        break;
      case 'phobos': previewImage.style.filter = 'blur(' + (offset * MAX_EFFECT_VALUE / MAX_PERCENT_VALUE) + 'px)';
        break;
      case 'heat': previewImage.style.filter = 'brightness(' + (offset * MAX_EFFECT_VALUE / MAX_PERCENT_VALUE) + ')';
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

  scalePin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoordinate = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoordinate - moveEvt.clientX;

      startCoordinate = moveEvt.clientX;

      var offset = calculateScaleOffset(scalePin.offsetLeft - shift);
      scalePin.style.left = offset + '%';

      setOffsetForEffect();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  picturesEffects.forEach(function (effect) {
    setEventsForEffects(effect);
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

  var onUploadWindowEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadWindow);
  };

  var setDefaultPictureSettings = function () {
    var currentCheckedEffect = effectsBlock.querySelector('input[name=effect]:checked');
    var defaultCheckedEffect = effectsBlock.querySelector('input[name=effect][checked]');
    currentCheckedEffect.checked = false;
    defaultCheckedEffect.checked = true;

    var defaultEffect = {
      effectId: '#' + defaultCheckedEffect.id,
      effectClass: 'effects__preview--' + defaultCheckedEffect.value
    };

    changeParamsForEffect(defaultEffect);
    changePreviewSize(DEFAULT_PERCENT_VALUE);
    hashtagText.value = '';
    descriptionText.value = '';
  };

  var openUploadWindow = function () {
    imgUploadWindow.classList.remove('hidden');
    setDefaultPictureSettings();
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

  // Валидация формы
  uploadForm.addEventListener('invalid', function (evt) {
    evt.target.style.outline = '2px solid #ff0000';
    evt.target.addEventListener('keydown', function () {
      evt.target.style = '';
      hashtagText.setCustomValidity('');
    });
  }, true);

  uploadFormSubmitButton.addEventListener('click', function () {
    if (hashtagText.value !== '') {
      var hashtags = hashtagText.value.split(' ');

      hashtags.forEach(function (element, index, array) {
        if (element.indexOf('#') !== 0) {
          hashtagText.setCustomValidity('Хеш-тег должен начинаться с символа # (решётка)');
        }
        if (element.substr(1).indexOf('#') !== -1) {
          hashtagText.setCustomValidity('Хэш-теги должны быть отделены пробелами друг от друга');
        }
        if (element === '#') {
          hashtagText.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
        }
        if (index > MAX_HASHTAG_NUMBER - 1) {
          hashtagText.setCustomValidity('Максимальное количество хэш-тегов равно: ' + MAX_HASHTAG_NUMBER);
        }
        if (array[index].length > MAX_HASHTAG_LENGTH) {
          hashtagText.setCustomValidity('Максимальная длина одного хэш-тега равна ' + MAX_HASHTAG_LENGTH + ' символов, включая решётку');
        }
        for (var j = index + 1; j < array.length; j++) {
          if (array[index].toLowerCase() === array[j].toLowerCase()) {
            hashtagText.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды. Теги нечувствительны к регистру');
          }
        }
      });
    }
  });

  var errorHandler = function (errorMessage) {
    var errorWindows = document.querySelectorAll('.img-upload__message--error');
    var errorWindow = errorWindows[errorWindows.length - 1];
    var node = document.createElement('div');
    node.style = 'padding: 10px; font-size: 20px';

    node.textContent = errorMessage;
    errorWindow.insertAdjacentElement('afterbegin', node);
    closeUploadWindow();
    errorWindow.classList.remove('hidden');
  };

  uploadForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(uploadForm), closeUploadWindow, errorHandler);
    evt.preventDefault();
  });
})();
