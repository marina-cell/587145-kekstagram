'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('#upload-file');
  var preview = document.querySelector('.img-upload__preview img');
  var smallPreviews = document.querySelectorAll('.effects__preview');

  var renderPreviewImage = function (previewImage) {
    preview.src = previewImage;

    Array.from(smallPreviews).forEach(function (element) {
      element.style['background-image'] = 'url(' + previewImage + ')';
    });
  };

  fileChooser.addEventListener('change', function () {
    renderPreviewImage('');

    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        renderPreviewImage(reader.result);
      });

      reader.readAsDataURL(file);
    }
  });
})();
