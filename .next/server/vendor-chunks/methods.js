"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/methods";
exports.ids = ["vendor-chunks/methods"];
exports.modules = {

/***/ "(ssr)/./node_modules/methods/index.js":
/*!***************************************!*\
  !*** ./node_modules/methods/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*!\n * methods\n * Copyright(c) 2013-2014 TJ Holowaychuk\n * Copyright(c) 2015-2016 Douglas Christopher Wilson\n * MIT Licensed\n */\n\n\n\n/**\n * Module dependencies.\n * @private\n */\n\nvar http = __webpack_require__(/*! http */ \"http\");\n\n/**\n * Module exports.\n * @public\n */\n\nmodule.exports = getCurrentNodeMethods() || getBasicNodeMethods();\n\n/**\n * Get the current Node.js methods.\n * @private\n */\n\nfunction getCurrentNodeMethods() {\n  return http.METHODS && http.METHODS.map(function lowerCaseMethod(method) {\n    return method.toLowerCase();\n  });\n}\n\n/**\n * Get the \"basic\" Node.js methods, a snapshot from Node.js 0.10.\n * @private\n */\n\nfunction getBasicNodeMethods() {\n  return [\n    'get',\n    'post',\n    'put',\n    'head',\n    'delete',\n    'options',\n    'trace',\n    'copy',\n    'lock',\n    'mkcol',\n    'move',\n    'purge',\n    'propfind',\n    'proppatch',\n    'unlock',\n    'report',\n    'mkactivity',\n    'checkout',\n    'merge',\n    'm-search',\n    'notify',\n    'subscribe',\n    'unsubscribe',\n    'patch',\n    'search',\n    'connect'\n  ];\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWV0aG9kcy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxtQkFBTyxDQUFDLGtCQUFNOztBQUV6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvdmlrYXNoeWFkYXYvRGV2ZWxvcGVyL0FsbGdpdEZpbGVzL0NvbmZsdXgtVHhuLXZpc3VhbGl6ZXIvbm9kZV9tb2R1bGVzL21ldGhvZHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBtZXRob2RzXG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE0IFRKIEhvbG93YXljaHVrXG4gKiBDb3B5cmlnaHQoYykgMjAxNS0yMDE2IERvdWdsYXMgQ2hyaXN0b3BoZXIgV2lsc29uXG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqIEBwcml2YXRlXG4gKi9cblxudmFyIGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRDdXJyZW50Tm9kZU1ldGhvZHMoKSB8fCBnZXRCYXNpY05vZGVNZXRob2RzKCk7XG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IE5vZGUuanMgbWV0aG9kcy5cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZ2V0Q3VycmVudE5vZGVNZXRob2RzKCkge1xuICByZXR1cm4gaHR0cC5NRVRIT0RTICYmIGh0dHAuTUVUSE9EUy5tYXAoZnVuY3Rpb24gbG93ZXJDYXNlTWV0aG9kKG1ldGhvZCkge1xuICAgIHJldHVybiBtZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBcImJhc2ljXCIgTm9kZS5qcyBtZXRob2RzLCBhIHNuYXBzaG90IGZyb20gTm9kZS5qcyAwLjEwLlxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBnZXRCYXNpY05vZGVNZXRob2RzKCkge1xuICByZXR1cm4gW1xuICAgICdnZXQnLFxuICAgICdwb3N0JyxcbiAgICAncHV0JyxcbiAgICAnaGVhZCcsXG4gICAgJ2RlbGV0ZScsXG4gICAgJ29wdGlvbnMnLFxuICAgICd0cmFjZScsXG4gICAgJ2NvcHknLFxuICAgICdsb2NrJyxcbiAgICAnbWtjb2wnLFxuICAgICdtb3ZlJyxcbiAgICAncHVyZ2UnLFxuICAgICdwcm9wZmluZCcsXG4gICAgJ3Byb3BwYXRjaCcsXG4gICAgJ3VubG9jaycsXG4gICAgJ3JlcG9ydCcsXG4gICAgJ21rYWN0aXZpdHknLFxuICAgICdjaGVja291dCcsXG4gICAgJ21lcmdlJyxcbiAgICAnbS1zZWFyY2gnLFxuICAgICdub3RpZnknLFxuICAgICdzdWJzY3JpYmUnLFxuICAgICd1bnN1YnNjcmliZScsXG4gICAgJ3BhdGNoJyxcbiAgICAnc2VhcmNoJyxcbiAgICAnY29ubmVjdCdcbiAgXTtcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/methods/index.js\n");

/***/ })

};
;