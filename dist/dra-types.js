(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dra-types"] = factory();
	else
		root["dra-types"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/all.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/all.ts":
/*!********************!*\
  !*** ./lib/all.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./dra-types */ "./lib/dra-types.ts"));


/***/ }),

/***/ "./lib/dra-types.ts":
/*!**************************!*\
  !*** ./lib/dra-types.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Public libraries
const Hash = __webpack_require__(/*! object-hash */ "object-hash");
// Canonical hashing of splitblock data
function hash(o) {
    return Hash(o, { respectType: false,
        unorderedArrays: true,
        unorderedObjects: true,
        excludeKeys: (k) => (k === 'id' || k === 'chunk')
    });
}
function vgeoidToGeoid(vgeoid) {
    let re = /vfeature_([^_]*)_.*/;
    let a = re.exec(vgeoid);
    if (a == null || a.length != 2)
        return '';
    else
        return a[1];
}
exports.vgeoidToGeoid = vgeoidToGeoid;
function vgeoidToChunk(vgeoid) {
    // vgeoid is string of form: "vfeature_[geoid]_[chunkid]_[hash]"
    // the contents are chunked into a file of form "vfeature_chunk_[chunkid]"
    // So extract the chunk ID and download that.
    let re = /vfeature_([^_]*)_([^_*])_(.*)/;
    let a = re.exec(vgeoid);
    if (a && a.length == 4)
        vgeoid = `vfeature_chunk_${a[2]}`;
    else
        vgeoid = null;
    return vgeoid;
}
exports.vgeoidToChunk = vgeoidToChunk;
function isVfeature(geoid) {
    return geoid.indexOf('vfeature') === 0;
}
exports.isVfeature = isVfeature;
function splitToCacheKey(s) {
    if (s.id === undefined)
        s.id = hash(s);
    if (s.chunk === undefined)
        s.chunk = "0";
    return `_${s.state}_${s.datasource}_vfeature_${s.geoid}_${s.chunk}_${s.id}.geojson`;
}
exports.splitToCacheKey = splitToCacheKey;
function splitToChunkKey(s) {
    if (s.chunk === undefined)
        s.chunk = "0";
    return `_${s.state}_${s.datasource}_vfeature_chunk_${s.chunk}.geojson`;
}
exports.splitToChunkKey = splitToChunkKey;
function splitToPrefix(s) {
    if (s.blocks === undefined) {
        let re = /_([^_]*)_(.*)_vfeature.*\.geojson$/;
        let a = re.exec(s.id);
        if (a && a.length == 3)
            return `_${a[1]}_${a[2]}`;
        return s.id;
    }
    return `_${s.state}_${s.datasource}`;
}
exports.splitToPrefix = splitToPrefix;
function cacheKeysToChunkHash(keys) {
    return hash(keys);
}
exports.cacheKeysToChunkHash = cacheKeysToChunkHash;
let reDistrictNumber = /^\d+$/;
let reDistrictNumeric = /^\d/;
function canonicalDistrictID(districtID) {
    // Normalize purely numeric values (e.g. 001)
    if (reDistrictNumber.test(districtID))
        return String(Number(districtID));
    return districtID;
}
exports.canonicalDistrictID = canonicalDistrictID;
function canonicalDistrictIDOrdering(order) {
    let keys = Object.keys(order);
    let i;
    for (i = 0; i < keys.length; i++) {
        let s = keys[i];
        if (reDistrictNumeric.test(s)) {
            switch (s.length) {
                case 1:
                    keys[i] = `000${s}`;
                    break;
                case 2:
                    keys[i] = `00${s}`;
                    break;
                case 3:
                    keys[i] = `0${s}`;
                    break;
            }
        }
    }
    keys.sort();
    order = {};
    for (i = 0; i < keys.length; i++)
        order[canonicalDistrictID(keys[i])] = i + 1;
    return order;
}
exports.canonicalDistrictIDOrdering = canonicalDistrictIDOrdering;


/***/ }),

/***/ "object-hash":
/*!******************************!*\
  !*** external "object-hash" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("object-hash");

/***/ })

/******/ });
});
//# sourceMappingURL=dra-types.js.map