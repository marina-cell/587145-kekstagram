'use strict';

(function () {

  var filtersBlock = document.querySelector('.img-filters');
  var filterButtons = filtersBlock.querySelectorAll('.img-filters__button');
  var newPicturesFilter = filtersBlock.querySelector('#filter-new');
  var discussedPicturesFilter = filtersBlock.querySelector('#filter-discussed');

  var shuffle = function (arr) {
    return arr.sort(function () {
      return Math.random() - 0.5;
    });
  };

  var filterPictures = function (filter) {
    window.gallery.filtered = window.gallery.initial.slice();
    if (filter === newPicturesFilter) {
      window.gallery.filtered = shuffle(window.gallery.filtered).slice(0, 10);
    } else if (filter === discussedPicturesFilter) {
      window.gallery.filtered.sort(function (left, right) {
        return right.comments.length - left.comments.length;
      });
    }
    window.debounce(function () {
      window.renderPicturesFragment();
    });
  };

  window.filters = {
    renderFilterBlock: function () {
      Array.from(filterButtons).forEach(function (button) {
        button.addEventListener('click', function (evt) {
          // Удалим класс active у всех кнопок
          Array.from(filterButtons).forEach(function (btn) {
            btn.classList.remove('img-filters__button--active');
          });
          // И добавим активной
          button.classList.add('img-filters__button--active');
          filterPictures(evt.target);
        });
      });
      filtersBlock.classList.remove('img-filters--inactive');
    },
  };
})();
