/**
 * https://stackoverflow.com/questions/28257566/ace-editor-save-send-session-on-server-via-post
 *
 * to save session to server you need to convert it to plain object which can be passed
 * to json.Stringify.session="+ editor.session in your example simply calls session.toString
 * which is same as session.getValue
 * */


var filterHistory = function (deltas) {
 return deltas.filter(function (d) {
  return d.group != "fold";
 });
};

sessionToJSON = function (session) {
 return {
  selection: session.selection.toJSON(),
  value: session.getValue(),
  history: {
   undo: session.$undoManager.$undoStack.map(filterHistory),
   redo: session.$undoManager.$redoStack.map(filterHistory)
  },
  scrollTop: session.getScrollTop(),
  scrollLeft: session.getScrollLeft(),
  options: session.getOptions()
 };
};

sessionFromJSON = function (data) {
 var session = require("ace/ace").createEditSession(data.value);
 session.$undoManager.$doc = session; // workaround for a bug in ace
 session.setOptions(data.options);
 session.$undoManager.$undoStack = data.history.undo;
 session.$undoManager.$redoStack = data.history.redo;
 session.selection.fromJSON(data.selection);
 session.setScrollTop(data.scrollTop);
 session.setScrollLeft(data.scrollLeft);
 return session;
};

/**
 * now to get state of the session do
 * */
var session = editor.session;
var sessionData = sessionToJSON(session);
$.ajax({
        type: "POST",
        url: "aaaaa.php",
        cache: false,
        timeout: 10000,
        data: JSON.stringify(sessionData)
       });

/**
 * and to restore it from the server
 * */
var session = sessionFromJSON(JSON.parse(ajaxResponse));
editor.setSession(session);