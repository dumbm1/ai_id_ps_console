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

  const btn_settings = document.getElementById('btn_settings');

  let ace_settingsmenu;

  let aceMenuOpts;
  if (localStorage.aceMenuOpts) {
   aceMenuOpts = localStorage.aceMenuOpts;
  }

  const editor = ace.edit("editor");

  ace.require("ace/ext/language_tools");
  ace.require('ace/ext/settings_menu').init(editor);

  if (aceMenuOpts) {
   editor.setOptions(JSON.parse(aceMenuOpts));
  }

  editor.setOptions({
                     enableBasicAutocompletion: true,
                    });

  btn_settings.addEventListener('click', (e) => {
   editor.showSettingsMenu();

   ace_settingsmenu = document.getElementById('ace_settingsmenu');

   ace_settingsmenu.style.fontSize = '12px';
   ace_settingsmenu.querySelectorAll('input[type=number]').forEach((elem) => {
    elem.style.width = '4rem';
   });

   setTimeout(() => {
    document.documentElement.addEventListener('click', (e) => {
     if (!e.target.contains(ace_settingsmenu)) return;

     aceMenuOpts = editor.getOptions();
     localStorage.aceMenuOpts = JSON.stringify(aceMenuOpts);

    });
   }, 300);

  });

  document.getElementById('editor').addEventListener('keyup', (e) => {
   if (e.ctrlKey && e.keyCode == 13) {
    let fld_return = document.getElementById('output_field');
    if (!fld_return.value) {
     fld_return.value = evalInChrome(editor.getValue());
     fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
    } else {
     fld_return.value += '\n' + evalInChrome(editor.getValue());
     fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
    }
    editor.focus();
   } else if ((e.metaKey || e.altKey) && e.keyCode == 13) {
    let elem_return = document.getElementById('output_field');
    evalInAi(editor.getValue(), elem_return);
    editor.focus();
   }
  });

  document.getElementById('btn_eval_js').addEventListener('click', (e) => {
   let fld_return = document.getElementById('output_field');
   if (!fld_return.value) {
    fld_return.value = evalInChrome(editor.getValue());
    fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
   } else {
    fld_return.value += '\n' + evalInChrome(editor.getValue());
    fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
   }
   editor.focus();
  });

  document.getElementById('btn_eval_jsx').addEventListener('click', (e) => {
   let elem_return = document.getElementById('output_field');
   evalInAi(editor.getValue(), elem_return);
   editor.focus();
  });

  document.getElementById('btn_clear_output').addEventListener('click', (e) => {
   const output_field = document.getElementById('output_field');
   output_field.value = '';
  });

  document.getElementById('btn_refresh').addEventListener('click', () => location.reload());

  document.getElementById('btn_close').addEventListener('click', () => {
   let apiVersion = csInterface.getCurrentApiVersion();
   if (apiVersion.major > 6) {
    csInterface.requestOpenExtension('js_console_dialog');
    csInterface.closeExtension();
   } else {
    csInterface.closeExtension();
   }
  });

  document.getElementById('btn_github').addEventListener('click', () => window.cep.util.openURLInDefaultBrowser("https://github.com/dumbm1/ai_id_ps_console"));

 }

 function loadJSX(fileName) {
  let extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
  csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
 }

 /**
  * Eval javascript string on chrome browser
  *
  * @param {String} str - the javascript code string
  * @return {String} res - the evaluation result or error message
  * */
 function evalInChrome(str) {
  let res = '';
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

}());
