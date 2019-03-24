var module_locales = require('./locales.js');
var locales = module_locales.locales;

var localeIndex = wx.getStorageSync('langIndex');


var _ = function (x) {
  return locales[localeIndex][x];
}


module.exports = {
  _: _
}