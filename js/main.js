/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
 'use strict';

 const csInterface = new CSInterface();

 init();

 function init() {

  themeManager.init();
  loadJSX("json2.js");

  // localStorage.clear();
  /*  if (localStorage.output_field) {
   document.getElementById("output_field").className = localStorage.output_field;
   }*/
  if (localStorage.editorCut) {
   document.getElementById('editor').className = localStorage.editorCut;
  }

  let is_autocomplete = document.getElementById('is_autocomplete');
  // let fldOutput = document.getElementById('output_field');

  let aceThemes = getAceThemes();
  insertThemesList(aceThemes);

  ace.require("ace/ext/language_tools");

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/" + $("#themes").val());
  editor.getSession().setMode("ace/mode/javascript");
  editor.setOptions({
                     enableBasicAutocompletion: is_autocomplete.checked,
                     enableSnippets: false,
                     enableLiveAutocompletion: is_autocomplete.checked,
                    });

  if (localStorage.fntSize) {
   document.getElementById('editor').style.fontSize = localStorage.fntSize;
  }

  $("#themes").change(function () {
   var editor = ace.edit("editor");
   editor.setTheme("ace/theme/" + $("#themes").val());
   editor.getSession().setMode("ace/mode/javascript");
   localStorage.theme = $("#themes").val();
  });

  is_autocomplete.addEventListener('change', (e) => {
   editor.setOptions({
                      enableBasicAutocompletion: is_autocomplete.checked,
                      enableSnippets: false,
                      enableLiveAutocompletion: is_autocomplete.checked,
                     });
  });

  $("#editor").keyup(function (e) {
   if (e.ctrlKey && e.keyCode == 13) {
    var fld_return = document.getElementById('output_field');
    if (!fld_return.value) {
     fld_return.value = evalInChrome(editor.getValue());
     fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
    } else {
     fld_return.value += '\n' + evalInChrome(editor.getValue());
     fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
    }
    editor.focus();
   } else if ((e.metaKey || e.altKey) && e.keyCode == 13) {
    var elem_return = document.getElementById('output_field');
    evalInAi(editor.getValue(), elem_return);
    editor.focus();
   }
  });

  $("#btn_eval_js").click(function () {
   var fld_return = document.getElementById('output_field');
   if (!fld_return.value) {
    fld_return.value = evalInChrome(editor.getValue());
    fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
   } else {
    fld_return.value += '\n' + evalInChrome(editor.getValue());
    fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
   }
   editor.focus();
  });

  $("#btn_eval_jsx").click(function () {
   var elem_return = document.getElementById('output_field');
   evalInAi(editor.getValue(), elem_return);
   editor.focus();
  });

  $("#btn_clear_output").click(function () {
   $("#output_field").val('');
  });

  $("#btn_refrash").click(function reloadPanel() {
   location.reload();
  });

  $("#btn_close").click(function () {
   var apiVersion = csInterface.getCurrentApiVersion();
   if (apiVersion.major > 6) {
    csInterface.requestOpenExtension('js_console_dialog');
    csInterface.closeExtension();
   } else {
    csInterface.closeExtension();
   }
  });

  $("#btn_github").click(function () {
   window.cep.util.openURLInDefaultBrowser("https://github.com/dumbm1/ai_id_ps_console");
  });

 }

 function loadJSX(fileName) {
  var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
  csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
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
  csInterface.evalScript('evalStr(' + JSON.stringify(str) + ')', function (res) {
   if (!fld_return.value) {
    fld_return.value = '[ai]: ' + res;
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
   var theme = themesList[i];
   var optTheme = document.createElement('option');
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
   'ambiance',
   'chaos', 'chrome', 'cloud9_day', 'cloud9_night', 'clouds_midnight', 'cloud9_night_low_color', 'cloud_editor',
   'cloud_editor_dark', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor',
   'dawn', 'dracula', 'dreamweaver',
   'eclipse',
   'github', 'github_dark', 'gob', 'gruvbox', 'gruvbox_dark_hard', 'gruvbox_light_hard',
   'idle_fingers', 'iplastic',
   'katzenmilch', 'kr_theme', 'kuroir',
   'merbivore', 'merbivore_soft', 'mono_industrial', 'monokai',
   'nord_dark',
   'one_dark',
   'pastel_on_dark',
   'solarized_dark', 'solarized_light', 'sqlserver',
   'terminal', 'textmate', 'tomorrow', 'tomorrow_night', 'tomorrow_night_blue', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight',
   'vibrant_ink',
   'xcode'];
 }
}());
