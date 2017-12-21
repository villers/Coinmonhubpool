'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('axios/index');

var _index2 = _interopRequireDefault(_index);

var _sleep = require('../utils/sleep');

var _sleep2 = _interopRequireDefault(_sleep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBlank(str) {
  return !str || /^\s*$/.test(str);
}

_index2.default.interceptors.response.use(async response => {
  // get original request configuration
  const originalRequest = response.config;

  // if request is empty
  if (isBlank(response.data)) {
    if (originalRequest.retry === undefined) {
      originalRequest.retry = 1;
    }

    // check if not allready refreshing
    if (originalRequest.retry <= 50) {
      originalRequest.retry += 1;

      // wait 1 s berore retrying request
      await (0, _sleep2.default)(1);

      // try refresh
      return (0, _index2.default)(originalRequest);
    }
  }

  return response;
}, error => error);

exports.default = _index2.default;