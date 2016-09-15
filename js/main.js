/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
  'use strict';

  var csInterface = new CSInterface ();

  function loadJSX (fileName) {
    var extensionRoot = csInterface.getSystemPath (SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript ('$.evalFile("' + extensionRoot + fileName + '")');
  }

  function init () {

    themeManager.init ();
    loadJSX ("json2.js");

    $ ("#btn_eval_js").click (function () {
      var fld_val    = document.getElementById ("fld_val");
      var fld_return = document.getElementById ('fld_return');
      if (!fld_return.value) {
        fld_return.value     = evalInChrome (fld_val.value);
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      } else {
        fld_return.value += '\n' + evalInChrome (fld_val.value);
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      }
      fld_val.focus ();
    });
    $ ("#btn_eval_jsx").click (function () {
      var elem        = document.getElementById ("fld_val");
      var elem_return = document.getElementById ('fld_return');
      evalInAi (elem.value, elem_return);
      elem.focus ();
    });
    $ ("#btn_clear").click (function () {
      $ ("#fld_return").val ('');
    });
    // todo: refactor this code to jQuery syntax
    document.getElementById ('lst_keywords').addEventListener ('change', function () {
      var elem = document.getElementById ('fld_val');
      insertAtCursor (elem, this.value);
    });
    $ ("#btn_repeat").click (function () {
      var elem = document.getElementById ("fld_val");
      var val  = document.getElementById ('lst_keywords').value;
      insertAtCursor (elem, val);
    });
    $ ("#btn_saveCode").click (function () {
      var str = document.getElementById ("fld_val").value;
      csInterface.evalScript ('saveCode("' + JSON.stringify (str) + '")', function (res) {
        alert (res);
      })
    });

    $ ("#btn_refrash").click (reloadPanel);
    $ ("#btn_close").click (function () {
      /*csInterface.evalScript ("killCEP()");*/
      new CSInterface ().closeExtension ();
    });

  }

  init ();

  // Reloads extension panel
  function reloadPanel () {
    location.reload ();
  }

  /**
   * Eval javascript string on chrome browser
   *
   * @param {String} str - the javascript code string
   * @return {String} res - the evaluation result or error message
   * */
  function evalInChrome (str) {
    var res = '';
    try {
      res = eval (str);
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
  function evalInAi (str, fld_return) {
    csInterface.evalScript ('evalStr(' + JSON.stringify (str) + ')', function (res) {
      if (!fld_return.value) {
        fld_return.value     = '[ai]: ' + res;
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      } else {
        fld_return.value += '\n' + '[ai]: ' + res;
        fld_return.scrollTop = fld_return.scrollHeight - fld_return.clientHeight;
      }
    });
  }

  function insertAtCursor (myField, myValue) {
    if (document.selection) {
      myField.focus ();
      document.selection.createRange ().text = myValue;
    }
    else if (myField.selectionStart || myField.selectionStart == '0') {
      var position           = myField.selectionStart;
      myField.value          = myField.value.substring (0, myField.selectionStart) + myValue + myField.value.substring (myField.selectionEnd, myField.value.length);
      myField.selectionStart = myField.selectionEnd = position + myValue.length;
    } else {
      myField.value += myValue;
    }
    myField.focus ();
  }

} ());
