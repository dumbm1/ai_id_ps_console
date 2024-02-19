(function() {
  'use strict';
  var csInterface = new CSInterface();
  init();
  function init() {
    themeManager.init();
    if (csInterface.isWindowVisible()) {
      csInterface.requestOpenExtension('console.panel');
      csInterface.closeExtension();
    }
  }
}());
