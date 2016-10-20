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

    var aceThemes = ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn',
      'dreamweaver', 'eclipse', 'github', 'idle-fingers', 'iplastic', 'katzenmilch', 'ke_theme', 'kuroir', 'merbivore',
      'merbivore_soft', 'mono_industrial', 'monokai', 'pastel_on_dark', 'solarized_light', 'solarized_dark', 'sqlserver',
      'terminal', 'textmate', 'tomorrow', 'tomorrow_night', 'tomorrow_night_blue', 'tomorrow_night_bright',
      'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'];

    for (var i = 0; i < aceThemes.length; i++) {
      var obj = aceThemes[i];

    }


    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/" + $("#themes").val());
    editor.getSession().setMode("ace/mode/javascript");



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

    $("#btn_refrash").click(reloadPanel);
    $("#btn_close").click(function() {
      /*csInterface.evalScript ("killCEP()");*/
      new CSInterface().closeExtension();
    });

  }

  init();

  function reloadPanel() {
    location.reload();
  }

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
}());
