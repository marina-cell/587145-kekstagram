'use strict';

(function () {

  var filtersBlock = document.querySelector('.img-filters');
  var filterButtons = filtersBlock.querySelectorAll('.img-filters__button');
  var newPicturesFilter = filtersBlock.querySelector('#filter-new');
  var discussedPicturesFilter = filtersBlock.querySelector('#filter-discussed');

  var shuffle = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var num = Math.floor(Math.random() * (i + 1));
      var d = arr[num];
      arr[num] = arr[i];
      arr[i] = d;
    }
    return arr;
  };

  var filterPictures = function (filter) {
    window.gallery.filtered = window.gallery.initial.slice();
    if (filter === newPicturesFilter) {
      window.gallery.filtered = shuffle(window.gallery.filtered).slice(0, 10);
    } else if (filter === discussedPicturesFilter) {
      window.gallery.filtered.sort(function (left, right) {
        return left.comments.length - right.comments.length;
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
          for (var i = 0; i < filterButtons.length; i++) {
            filterButtons[i].classList.remove('img-filters__button--active');
          }
          button.classList.add('img-filters__button--active');
          filterPictures(evt.target);
        });
      });
      filtersBlock.classList.remove('img-filters--inactive');
    },
  };
})();
