/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function() {
  'use strict';

  var csInterface = new CSInterface();

  function loadJSX(fileName) {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  }

  function init() {

    themeManager.init();
    loadJSX("json2.js");

    // localStorage.clear();
    if (localStorage.fld_return) {
      document.getElementById("fld_return").className = localStorage.fld_return;
    }
    if (localStorage.editorCut) {
      document.getElementById('editor').className = localStorage.editorCut;
    }

    var aceThemes = getAceThemes();
    insertThemesList(aceThemes);

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/" + $("#themes").val());
    editor.getSession().setMode("ace/mode/javascript");

    if (localStorage.fntSize) {
      document.getElementById('editor').style.fontSize = localStorage.fntSize;
    }

    $("#themes").change(function() {
      var editor = ace.edit("editor");
      editor.setTheme("ace/theme/" + $("#themes").val());
      editor.getSession().setMode("ace/mode/javascript");
      localStorage.theme = $("#themes").val();
    })

/*    var elem = document.getElementById('editor');
    if (elem.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        elem.addEventListener("wheel", onWheel);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        elem.addEventListener("mousewheel", onWheel);
      } else {
        // Firefox < 17
        elem.addEventListener("MozMousePixelScroll", onWheel);
      }
    } else { // IE8-
      elem.attachEvent("onmousewheel", onWheel);
    }
    function onWheel(e) {
      if (e.altKey) {
        var fntSize                                      = document.getElementById('editor').style.fontSize;
        fntSize                                          = parseInt(fntSize);
        document.getElementById('editor').style.fontSize = (fntSize - 1) + 'px';
      } else if (e.shiftKey) {
        var fntSize                                      = document.getElementById('editor').style.fontSize;
        fntSize                                          = parseInt(fntSize);
        document.getElementById('editor').style.fontSize = 1 + fntSize + 'px';
      }
      localStorage.fntSize = document.getElementById('editor').style.fontSize;
    }*/

    $("#editor").keyup(function(e) {
      if (e.ctrlKey && e.keyCode == 13) {
        var fld_return = document.getElementById('fld_return');
        if (!fld_return.value) {
          fld_return.value     = evalInChrome(editor.getValue());
          fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
        } else {
          fld_return.value += '\n' + evalInChrome(editor.getValue());
          fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
        }
        editor.focus();
      } else if ((e.metaKey || e.altKey) && e.keyCode == 13) {
        var elem_return = document.getElementById('fld_return');
        evalInAi(editor.getValue(), elem_return);
        editor.focus();
      }
    })
    $("#btn_output").click(function() {
      $("#fld_return").toggleClass('hideOutput');
      localStorage.fld_return = document.getElementById('fld_return').className;
      if ($("#editor").hasClass('editor-cut')) {
        $("#editor").removeClass('editor-cut');
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/" + $("#themes").val());
        editor.getSession().setMode("ace/mode/javascript");
        localStorage.theme = $("#themes").val();
      } else {
        $("#editor").addClass('editor-cut');
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/" + $("#themes").val());
        editor.getSession().setMode("ace/mode/javascript");
        localStorage.theme = $("#themes").val();
      }
      localStorage.editorCut = document.getElementById('editor').className;
    })
    $("#btn_eval_js").click(function() {
      var fld_return = document.getElementById('fld_return');
      if (!fld_return.value) {
        fld_return.value     = evalInChrome(editor.getValue());
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      } else {
        fld_return.value += '\n' + evalInChrome(editor.getValue());
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      }
      editor.focus();
    });
    $("#btn_eval_jsx").click(function() {
      var elem_return = document.getElementById('fld_return');
      evalInAi(editor.getValue(), elem_return);
      editor.focus();
    });
    $("#btn_clear").click(function() {
      $("#fld_return").val('');
    });

    $("#btn_refrash").click(function reloadPanel() {
      location.reload();
    });
    $("#btn_close").click(function() {
      /*csInterface.evalScript ("killCEP()");*/
      new CSInterface().closeExtension();
    });
    $("#btn_github").click(function() {
      window.cep.util.openURLInDefaultBrowser("https://github.com/dumbm1/ai_id_ps_console");
    });

  }

  init();

  /**
   * Eval javascript string on chrome browser
   *
   * @param {String} str - the javascript code string
   * @return {String} res - the evaluation result or error message
   * */
  function evalInChrome(str) {
    var res = '';
    try {
      res = eval(str);
    } catch (e) {
      res = e/*.message + ', ' + e.line*/;
    }
    return '[chrome]: ' + res;
  }

  /**
   * Eval javascript string on chrome browser
   *
   * @param {String} str - the javascript code string
   * */
  function evalInAi(str, fld_return) {
    csInterface.evalScript('evalStr(' + JSON.stringify(str) + ')', function(res) {
      if (!fld_return.value) {
        fld_return.value     = '[ai]: ' + res;
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      } else {
        fld_return.value += '\n' + '[ai]: ' + res;
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      }
    });
  }

  /**
   * @param {Array}
   * */
  function insertThemesList(themesList) {
    for (var i = 0; i < themesList.length; i++) {
      var theme          = themesList[i];
      var optTheme       = document.createElement('option');
      optTheme.innerHTML = theme;
      if (localStorage.theme == theme) {
        optTheme.selected = true;
      } else {
        optTheme.selected = false;
      }
      document.getElementById("themes").appendChild(optTheme);
    }
  }

  function getAceThemes() {
    return [
      'ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn',
      'dreamweaver', 'eclipse', 'github', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir',
      'merbivore', 'merbivore_soft', 'mono_industrial', 'monokai', 'pastel_on_dark', 'solarized_light',
      'solarized_dark', 'sqlserver', 'terminal', 'textmate', 'tomorrow', 'tomorrow_night',
      'tomorrow_night_blue', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight',
      'vibrant_ink', 'xcode'];
  }
}());
