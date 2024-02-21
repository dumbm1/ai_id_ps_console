(function() {
  'use strict';
  var csInterface = new CSInterface();
  init();
  function init() {
    themeManager.init();
    if (csInterface.isWindowVisible()) {
      csInterface.requestOpenExtension('js_console_panel');
      csInterface.closeExtension();
    }
  }
}());
