'use strict';

(function () {

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

  var getRandomComments = function (array) {
    var comments = [];
    for (var i = 0; i < PICTURES_NUMBER; i++) {
      comments[i] = [];
      comments[i].push(window.util.getRandomValueFromArray(array));
      // Добавление второго комментария (случайным образом)
      if (Math.round(Math.random())) {
        var anotherComment = window.util.getRandomValueFromArray(array);
        if (comments[i] !== anotherComment) {
          comments[i].push(window.util.getRandomValueFromArray(array));
        }
      }
    }
    return comments;
  };

  var getRandomUrlArray = function () {
    var urls = [];
    var i = 0;
    while (urls.length < PICTURES_NUMBER) {
      var address = window.util.getRandomValue(1, PICTURES_NUMBER);
      if (urls.indexOf('photos/' + address + '.jpg') === -1) {
        urls[i++] = 'photos/' + address + '.jpg';
      }
    }
    return urls;
  };

  window.createPicturesArray = function () {
    var pictures = [];
    var urls = getRandomUrlArray();
    var comments = getRandomComments(COMMENTS);
    for (var i = 0; i < PICTURES_NUMBER; i++) {
      pictures[i] = {
        url: urls[i],
        likes: window.util.getRandomValue(MIN_LIKES_NUMBER, MAX_LIKES_NUMBER),
        comments: comments[i],
        description: window.util.getRandomValueFromArray(DESCRIPTIONS)
      };
    }
    return pictures;
  };
})();
