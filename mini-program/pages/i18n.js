var module_locales = require('./locales.js');
var locales = module_locales.locales;

var localeIndex = wx.getStorageSync('langIndex') || 0;

var _ = function (x) {
  return locales[localeIndex][x];
}


module.exports = {
  _: _
}