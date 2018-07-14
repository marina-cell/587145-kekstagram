'use strict';

(function () {
  var OK_STATUS = 200;
  var SHOW_ERROR_TIMEOUT = 3000; // 3s
  var XHR_TIMEOUT = 10000; // 10s

  window.backend = {
    load: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === OK_STATUS) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Истек таймаут ответа от сервера: ' + xhr.timeout + ' мс');
      });

      xhr.open('GET', URL);
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === OK_STATUS) {
          onLoad();
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Истек таймаут ответа от сервера: ' + xhr.timeout + ' мс');
      });

      xhr.timeout = XHR_TIMEOUT;
      xhr.open('POST', URL);
      xhr.send(data);
    },
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');

      node.style = 'position: fixed; left: 0; right: 0; z-index: 100; margin: 0 auto; padding: 10px; text-align: center; text-transform: none; font-size: 20px; color: red; background-color: pink';

      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
      setTimeout(function () {
        document.body.removeChild(node);
      }, SHOW_ERROR_TIMEOUT);
    }
  };
})();
