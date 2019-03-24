var module_locales = require('./locales.js');
var locales = module_locales.locales;


var _ = function (x) {
  var localeIndex = wx.getStorageSync('langIndex') || 0;
  return locales[localeIndex][x];
}


module.exports = {
  _: _
}