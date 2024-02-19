/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/
function evalStr (str) {
  var res = '';

  try {
    res = eval (/*JSON.parse*/ (str));
  } catch (e) {
    res = e.message;
  } finally {
    return res;
  }

}
