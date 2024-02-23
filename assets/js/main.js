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
/*  if (localStorage.editorCut) {
   document.getElementById('editor').className = localStorage.editorCut;
  }*/
  

  // let is_autocomplete = document.getElementById('is_autocomplete');
  // let fldOutput = document.getElementById('output_field');
  let btn_settings = document.getElementById('btn_settings');

  let ace_settingsmenu;

  let aceMenuOpts;
  if (localStorage.aceMenuOpts) {
   aceMenuOpts = localStorage.aceMenuOpts;
  }
  

/*  let aceThemes = getAceThemes();
  insertThemesList(aceThemes);*/



  let editor = ace.edit("editor");

  ace.require("ace/ext/language_tools");
  ace.require('ace/ext/settings_menu').init(editor);
  
  // editor.setOptions(JSON.parse(localStorage.aceMenuOpts));
  if(aceMenuOpts) {
   editor.setOptions(JSON.parse(aceMenuOpts));
  }


  // editor.setTheme("ace/theme/" + $("#themes").val());
  // editor.getSession().setMode("ace/mode/javascript");
  editor.setOptions({
                     enableBasicAutocompletion: true,
                     /*                     enableBasicAutocompletion: is_autocomplete.checked,
                      enableSnippets: false,
                      enableLiveAutocompletion: is_autocomplete.checked,*/
                    });

  btn_settings.addEventListener('click', (e) => {
   editor.showSettingsMenu();
   
   ace_settingsmenu = document.getElementById('ace_settingsmenu');

   console.log(`Clock to settings button == ${e.target == btn_settings};\nAce settings menu is open;\nMenu element below:`);
   console.log(ace_settingsmenu);
   
   ace_settingsmenu.style.fontSize = '12px';
   ace_settingsmenu.querySelectorAll('input[type=number]').forEach((elem)=>{
    elem.style.width = '4rem';
   })

   setTimeout(() => {
    document.documentElement.addEventListener('click', (e) => {
     if (!e.target.contains(ace_settingsmenu)) return;

     aceMenuOpts = editor.getOptions();
     localStorage.aceMenuOpts = JSON.stringify(aceMenuOpts);

/*     console.log(`Click outside of Ace menu == ${e.target.contains(ace_settingsmenu)};\nAce settings menu is closed.`);
     console.log(editor.getOptions());*/
    });
   }, 300);

  });

  /*  document.documentElement.addEventListener('click', (e) => {
   /!*   if (e.target != btn_settings) {
   console.log(e.target);

   // console.log('Меню закрыто');
   }*!/

   if (e.target.contains(document.getElementById('ace_settingsmenu'))) {
   console.log('Меню закрыто');
   }
   });*/

  /*  btn_settings.addEventListener('click', (e) => {
   console.log('Клик на кнопке settings');

   if (isSettingsMenuOpen === false) {
   editor.showSettingsMenu();
   isSettingsMenuOpen = true;
   console.log('Меню появиилось, пользователь выставляет настройки');

   setTimeout(() => {
   document.addEventListener('click', (e) => {
   if (isSettingsMenuOpen === true && e.target != document.getElementById('ace_settingsmenu')) {
   console.log('Клик на документе при открытом меню');
   isSettingsMenuOpen = false;
   console.log('Меню закрылось');
   console.log('Взяли настройки - let aceEditorOpts = editor.getOptions()');
   console.log('Далее надо записать актуальные настройки в LocalStorage');
   console.log('Чтобы потом во время следующей сессии установить актуальные настройки из LocalStorage - editor.setOptions(aceEditorOpts)');
   // document.removeEventListener('click');
   }
   }, 1000);
   });
   }

   // alert(JSON.stringify(options));
   // alert(options.enableLiveAutocompletion);
   });*/

/*  $("#themes").change(function () {
   let editor = ace.edit("editor");
   editor.setTheme("ace/theme/" + $("#themes").val());
   editor.getSession().setMode("ace/mode/javascript");
   localStorage.theme = $("#themes").val();
  });*/

/*  is_autocomplete.addEventListener('change', (e) => {
   editor.setOptions({
                      enableBasicAutocompletion: is_autocomplete.checked,
                      enableSnippets: false,
                      enableLiveAutocompletion: is_autocomplete.checked,
                     });
  });*/

  $("#editor").keyup(function (e) {
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

  $("#btn_eval_js").click(function () {
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

  $("#btn_eval_jsx").click(function () {
   let elem_return = document.getElementById('output_field');
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
   let apiVersion = csInterface.getCurrentApiVersion();
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

 /**
  * @param {Array}
  * */
/* function insertThemesList(themesList) {
  for (var i = 0; i < themesList.length; i++) {
   let theme = themesList[i];
   let optTheme = document.createElement('option');
   optTheme.innerHTML = theme;
   if (localStorage.theme == theme) {
    optTheme.selected = true;
   } else {
    optTheme.selected = false;
   }
   document.getElementById("themes").appendChild(optTheme);
  }
 }*/

/* function getAceThemes() {
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
 }*/
}());
