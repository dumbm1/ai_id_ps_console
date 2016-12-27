(function() {
  'use strict';
  var csInterface = new CSInterface();
  init();
  function init() {
    themeManager.init();
    if (csInterface.isWindowVisible()) {
      csInterface.requestOpenExtension('com.wk.console_wk.panel');
      csInterface.closeExtension();
    }
  }
}());
