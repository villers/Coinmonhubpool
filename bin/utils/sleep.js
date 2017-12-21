"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms * 1000));
}

exports.default = sleep;