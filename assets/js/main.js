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

  const appId      = csInterface.getHostEnvironment().appId,
        appVersion = csInterface.getHostEnvironment().appVersion;

  // console.log(appId == 'ILST', +appVersion.slice(0, 2));

  const btn_settings = document.getElementById('btn_settings');

  let aceMenuSettings;

  let aceMenuOpts;
  let aceLastSessionCode;

  if (localStorage.aceMenuOpts) {
   aceMenuOpts = localStorage.aceMenuOpts;
   aceLastSessionCode = localStorage.aceLastSessionCode;
  }

  ace.require("ace/ext/language_tools");
  const reformateCode = ace.require('ace/ext/beautify');
  const aceMenu = ace.require('ace/ext/settings_menu');
  ace.require('ace/ext/searchbox');

  const editor = ace.edit("editor");

  if (!aceMenuOpts) {
   editor.setTheme("ace/theme/gruvbox");
   editor.session.setMode("ace/mode/javascript");
  }

  aceMenu.init(editor);

  editor.commands.addCommand({
                              name: "beautify",
                              description: "Format selection (Beautify)",
                              exec: function (editor) {
                               reformateCode.beautify(editor.session);
                              },
                              bindKey: "Ctrl-Alt-L",
                             });

  editor.commands.addCommand({
                              name: "foldAll",
                              description: "Fold all code",
                              exec: function (editor) {
                               editor.session.foldAll();
                              },
                              bindKey: "Ctrl-Shift--",
                             });

  editor.commands.addCommand({
                              name: "unfold",
                              description: "Unfold all code",
                              exec: function (editor) {
                               editor.session.unfold();
                              },
                              bindKey: "Ctrl-Shift-=",
                             });

  if (aceMenuOpts) {
   editor.setOptions(JSON.parse(aceMenuOpts));
  }

  if (aceLastSessionCode) {
   editor.session.setValue(aceLastSessionCode);
  }

  editor.setOptions({
                     enableBasicAutocompletion: true,
                     wrapBehavioursEnabled: false,
                    });

  editor.session.on('change', function (delta) {
   // delta.start, delta.end, delta.lines, delta.action
   localStorage.aceLastSessionCode = editor.session.getValue();

  });

  if (appId == 'ILST' && +appVersion.slice(0, 2) < 26) { // bug with editor  in some old Illustrator versions
   window.addEventListener('resize', () => {
    editor.setTheme(editor.getOptions().theme);
   });

   editor.commands.addCommand({
                               name: "redraw-editor",
                               description: "Redraw editor via change theme to currrent theme",
                               exec: function (editor) {
                                editor.setTheme(editor.getOptions().theme);
                               },
                               bindKey: "Ctrl-Shift-R",
                              });

   editor.setOptions({
                      highlightSelectedWord: false, // if 'true' - has wrong and strange behavior on some old Illustrator versions
                     });
  }

  /*    document.getElementById('btn_test').addEventListener('click', (e) => {
   // beautify.beautify(editor.session);
   // console.log(editor.getCopyText());
   // console.log(editor.session.getValue());
   // console.log(editor.getOptions());
   // editor.session.foldAll();
   // editor.session.unfold();
   let aceCurrentTheme = editor.getOptions().theme;
   editor.setTheme(aceCurrentTheme);
   });*/


  btn_settings.addEventListener('click', (e) => {
   editor.showSettingsMenu();

   aceMenuSettings = document.getElementById('ace_settingsmenu');

   aceMenuSettings.style.fontSize = '12px';
   aceMenuSettings.querySelectorAll('input[type=number]').forEach((elem) => {
    elem.style.width = '4rem';
   });

   setTimeout(() => {
    document.documentElement.addEventListener('click', (e) => {
     if (!e.target.contains(aceMenuSettings)) return;

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

  document.getElementById('btn_reset_jsx').addEventListener('click', () => {
   let apiVersion = csInterface.getCurrentApiVersion();
   if (apiVersion.major > 6) {
    csInterface.requestOpenExtension('js_console_dialog');
    csInterface.closeExtension();
   } else {
    csInterface.closeExtension();
   }
  });

  document.getElementById('btn_github').addEventListener('click', () => {
   window.cep.util.openURLInDefaultBrowser("https://github.com/dumbm1/ai_id_ps_console");
  });

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
    fld_return.value = '[jsx]: ' + res;
    fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
   } else {
    fld_return.value += '\n' + '[jsx]: ' + res;
    fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
   }
  });
 }

}());
