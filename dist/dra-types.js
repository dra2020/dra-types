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
__export(__webpack_require__(/*! ./schemas */ "./lib/schemas.ts"));
__export(__webpack_require__(/*! ./bucketmap */ "./lib/bucketmap.ts"));


/***/ }),

/***/ "./lib/bucketmap.ts":
/*!**************************!*\
  !*** ./lib/bucketmap.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketMap = {
    'default': 'dev-dra-us-west-2-723398989493',
    'development': 'dev-dra-us-west-2-723398989493',
    'production': 'dra-us-west-2-723398989493',
    'state': 'dra-us-west-2-723398989493',
    'state-dev': 'dev-dra-us-west-2-723398989493',
    'logs': 'dra-uswest-logs',
    'memsqs': 'dra-uswest-memsqs',
    'images': 'dra-uswest-images',
    'data': 'dra-us-west-datafiles',
    'data-dev': 'dra-us-west-datafiles-dev',
    'splits': 'dra-block-cache',
    'splits-dev': 'dra-block-cache-dev',
    'counties': 'dra-county-cache',
    'counties-dev': 'dra-county-cache',
    'geojson': 'dra-uswest-geojson',
    'geojson-dev': 'dra-uswest-geojson',
};


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
const Util = __webpack_require__(/*! @dra2020/util */ "@dra2020/util");
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
function vgeoidToHash(vgeoid) {
    // vgeoid is string of form: "vfeature_[geoid]_[chunkid]_[hash]"
    let re = /vfeature_([^_]*)_([^_*])_(.*)/;
    let a = re.exec(vgeoid);
    if (a && a.length == 4)
        vgeoid = a[3];
    else
        vgeoid = null;
    return vgeoid;
}
exports.vgeoidToHash = vgeoidToHash;
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
let reNumeric = /^(\D*)(\d*)(\D*)$/;
let reDistrictNumber = /^\d+$/;
let reDistrictNumeric = /^\d/;
// Normalize any numeric part to have no padded leading zeros
function canonicalDistrictID(districtID) {
    let a = reNumeric.exec(districtID);
    if (a && a.length == 4) {
        if (a[2].length > 0)
            a[2] = String(Number(a[2]));
        districtID = `${a[1]}${a[2]}${a[3]}`;
    }
    return districtID;
}
exports.canonicalDistrictID = canonicalDistrictID;
// Normalize any numeric part to have four digits with padded leading zeros
function canonicalSortingDistrictID(districtID) {
    let a = reNumeric.exec(districtID);
    if (a && a.length == 4) {
        let s = a[2];
        if (s.length > 0) {
            switch (s.length) {
                case 1:
                    s = `000${s}`;
                    break;
                case 2:
                    s = `00${s}`;
                    break;
                case 3:
                    s = `0${s}`;
                    break;
            }
            a[2] = s;
        }
        districtID = `${a[1]}${a[2]}${a[3]}`;
    }
    return districtID;
}
exports.canonicalSortingDistrictID = canonicalSortingDistrictID;
// Return numeric part of districtID (or -1 if there is none)
function canonicalNumericFromDistrictID(districtID) {
    let a = reNumeric.exec(districtID);
    if (a && a.length == 4) {
        let s = a[2];
        if (s.length > 0)
            return Number(s);
    }
    return -1;
}
exports.canonicalNumericFromDistrictID = canonicalNumericFromDistrictID;
function canonicalDistrictIDFromNumber(districtID, n) {
    let a = reNumeric.exec(districtID);
    if (a && a.length == 4) {
        a[2] = String(n);
        districtID = `${a[1]}${a[2]}${a[3]}`;
    }
    else
        districtID = String(n);
    return districtID;
}
exports.canonicalDistrictIDFromNumber = canonicalDistrictIDFromNumber;
function canonicalDistrictIDOrdering(order) {
    let keys = Object.keys(order);
    let i;
    let a = [];
    let template = undefined;
    keys = keys.map((s) => canonicalSortingDistrictID(s));
    keys.sort();
    order = {};
    for (i = 0; i < keys.length; i++)
        order[canonicalDistrictID(keys[i])] = i + 1;
    // Remove water districts
    if (order['ZZZ'])
        delete order['ZZZ'];
    if (order['ZZ'])
        delete order['ZZ'];
    return order;
}
exports.canonicalDistrictIDOrdering = canonicalDistrictIDOrdering;
let reArray = [
    /^(\d\d[^\s,"']*)[\s]*,[\s]*([^\s'"]+)[\s]*$/,
    /^["'](\d\d[^"']*)["'][\s]*,[\s]*["']([^"']*)["'][\s]*$/,
    /^(\d\d[^\s,]*)[\s]*,[\s]*["']([^"']*)["'][\s]*$/,
    /^["'](\d\d[^"']*)["'][\s]*,[\s]*([^\s]+)[\s]*$/,
];
function parseCSVLine(line) {
    if (line == null || line == '')
        return null;
    for (let i = 0; i < reArray.length; i++) {
        let a = reArray[i].exec(line);
        if (a && a.length === 3)
            return { geoid: a[1], districtID: a[2] };
    }
    return null;
}
exports.parseCSVLine = parseCSVLine;
function blockmapToState(blockMap) {
    for (var id in blockMap)
        if (blockMap.hasOwnProperty(id))
            return geoidToState(id);
    return null;
}
exports.blockmapToState = blockmapToState;
// blockToVTD:
//  Take BlockMapping (simple map of GEOID to districtID) and a per-state map of block-level GEOID to VTD
//  and return the output mapping of VTD to districtID, as well a data structure that describes any VTD's
//  that need to be split between districtIDs. Also returns the DistrictOrder structure that defines the
//  districtIDs that were used by the file.
//
//  The state (as specified by the first two digits of the GEOID) is also determined. If the GEOID's do
//  not all specify the same state, the mapping is considered invalid and the outValid flag is set to false.
//
function blockmapToVTDmap(blockMap, stateMap) {
    let res = {
        inBlockMap: blockMap,
        inStateMap: stateMap,
        outValid: true,
        outState: null,
        outMap: {},
        outOrder: {},
        outDistrictToSplit: {}
    };
    let bmGather = {};
    let revMap = {};
    let id;
    if (stateMap)
        for (id in stateMap)
            if (stateMap.hasOwnProperty(id))
                revMap[stateMap[id]] = null;
    // First aggregate into features across all the blocks
    for (id in blockMap)
        if (blockMap.hasOwnProperty(id)) {
            let state = geoidToState(id);
            if (res.outState == null)
                res.outState = state;
            else if (res.outState !== state) {
                res.outValid = false;
                break;
            }
            let districtID = canonicalDistrictID(blockMap[id]);
            // Just ignore ZZZ (water) blocks
            if (districtID === 'ZZZ')
                continue;
            let n = id.length;
            let geoid;
            // Simple test for block id (vs. voting district or block group) id
            if (n >= 15) {
                if (stateMap && stateMap[id] !== undefined)
                    geoid = stateMap[id];
                else {
                    geoid = id.substr(0, 12); // heuristic for mapping blockID to blockgroupID
                    if (revMap[geoid] === undefined) {
                        res.outValid = false;
                        break;
                    }
                }
            }
            else
                geoid = id;
            if (res.outOrder[districtID] === undefined)
                res.outOrder[districtID] = 0;
            let districtToBlocks = bmGather[geoid];
            if (districtToBlocks === undefined)
                bmGather[geoid] = { [districtID]: { [id]: true } };
            else {
                let thisDistrict = districtToBlocks[districtID];
                if (thisDistrict === undefined) {
                    thisDistrict = {};
                    districtToBlocks[districtID] = thisDistrict;
                }
                thisDistrict[id] = true;
            }
        }
    // Now determine actual mapping of blocks to features, looking for split features
    for (let geoid in bmGather)
        if (bmGather.hasOwnProperty(geoid)) {
            let districtToBlocks = bmGather[geoid];
            if (Util.countKeys(districtToBlocks) == 1) {
                res.outMap[geoid] = Util.nthKey(districtToBlocks);
            }
            else {
                for (let districtID in districtToBlocks)
                    if (districtToBlocks.hasOwnProperty(districtID)) {
                        let split = { state: '', datasource: '', geoid: geoid, blocks: Object.keys(districtToBlocks[districtID]) };
                        let splits = res.outDistrictToSplit[districtID];
                        if (splits === undefined) {
                            splits = [];
                            res.outDistrictToSplit[districtID] = splits;
                        }
                        splits.push(split);
                    }
            }
        }
    res.outOrder = canonicalDistrictIDOrdering(res.outOrder);
    return res;
}
exports.blockmapToVTDmap = blockmapToVTDmap;
exports.GEOIDToState = {
    '01': 'AL',
    '02': 'AK',
    '04': 'AZ',
    '05': 'AR',
    '06': 'CA',
    '08': 'CO',
    '09': 'CT',
    '10': 'DE',
    '12': 'FL',
    '13': 'GA',
    '15': 'HI',
    '16': 'ID',
    '17': 'IL',
    '18': 'IN',
    '19': 'IA',
    '20': 'KS',
    '21': 'KY',
    '22': 'LA',
    '23': 'ME',
    '24': 'MD',
    '25': 'MA',
    '26': 'MI',
    '27': 'MN',
    '28': 'MS',
    '29': 'MO',
    '30': 'MT',
    '31': 'NE',
    '32': 'NV',
    '33': 'NH',
    '34': 'NJ',
    '35': 'NM',
    '36': 'NY',
    '37': 'NC',
    '38': 'ND',
    '39': 'OH',
    '40': 'OK',
    '41': 'OR',
    '42': 'PA',
    '44': 'RI',
    '45': 'SC',
    '46': 'SD',
    '47': 'TN',
    '48': 'TX',
    '49': 'UT',
    '50': 'VT',
    '51': 'VA',
    '53': 'WA',
    '54': 'WV',
    '55': 'WI',
    '56': 'WY',
};
exports.StateToGEOID = {
    'AL': '01',
    'AK': '02',
    'AZ': '04',
    'AR': '05',
    'CA': '06',
    'CO': '08',
    'CT': '09',
    'DE': '10',
    'FL': '12',
    'GA': '13',
    'HI': '15',
    'ID': '16',
    'IL': '17',
    'IN': '18',
    'IA': '19',
    'KS': '20',
    'KY': '21',
    'LA': '22',
    'ME': '23',
    'MD': '24',
    'MA': '25',
    'MI': '26',
    'MN': '27',
    'MS': '28',
    'MO': '29',
    'MT': '30',
    'NE': '31',
    'NV': '32',
    'NH': '33',
    'NJ': '34',
    'NM': '35',
    'NY': '36',
    'NC': '37',
    'ND': '38',
    'OH': '39',
    'OK': '40',
    'OR': '41',
    'PA': '42',
    'RI': '44',
    'SC': '45',
    'SD': '46',
    'TN': '47',
    'TX': '48',
    'UT': '49',
    'VT': '50',
    'VA': '51',
    'WA': '53',
    'WV': '54',
    'WI': '55',
    'WY': '56',
};
function geoidToState(geoid) {
    let re = /^(..).*$/;
    let a = re.exec(geoid);
    if (a == null || a.length != 2)
        return null;
    return exports.GEOIDToState[a[1]];
}
exports.geoidToState = geoidToState;
const ValidStateUrls = {
    'alabama': true,
    'alaska': true,
    'arizona': true,
    'arkansas': true,
    'california': true,
    'colorado': true,
    'connecticut': true,
    'delaware': true,
    'florida': true,
    'georgia': true,
    'hawaii': true,
    'idaho': true,
    'illinois': true,
    'indiana': true,
    'iowa': true,
    'kansas': true,
    'kentucky': true,
    'louisiana': true,
    'maine': true,
    'maryland': true,
    'massachusetts': true,
    'michigan': true,
    'minnesota': true,
    'mississippi': true,
    'missouri': true,
    'montana': true,
    'nebraska': true,
    'nevada': true,
    'new-hampshire': true,
    'new-jersey': true,
    'new-mexico': true,
    'new-york': true,
    'north-carolina': true,
    'north-dakota': true,
    'ohio': true,
    'oklahoma': true,
    'oregon': true,
    'pennsylvania': true,
    'rhode-island': true,
    'south-carolina': true,
    'south-dakota': true,
    'tennessee': true,
    'texas': true,
    'utah': true,
    'vermont': true,
    'virginia': true,
    'washington': true,
    'west-virginia': true,
    'wisconsin': true,
    'wyoming': true,
};
function isStateUrl(s) {
    return (typeof s === 'string' && s in ValidStateUrls);
}
exports.isStateUrl = isStateUrl;


/***/ }),

/***/ "./lib/schemas.ts":
/*!************************!*\
  !*** ./lib/schemas.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Schemas = {
    'users': {
        FileOptions: { version: 5, name: 'users', map: false },
        Schema: {
            id: 'S',
            name: 'S',
            email: 'S',
            hashPW: 'S',
            verified: 'BOOL',
            admin: 'BOOL',
            roles: 'M',
            verifyGUID: 'S',
            resetGUID: 'S',
            resetTime: 'S',
            lastActive: 'S',
            resetCount: 'N',
            accessed: 'M',
            likeID: 'S',
            visitData: 'M',
        },
        KeySchema: { id: 'HASH' },
        GlobalSecondaryIndexes: [
            { email: 'HASH' },
            { verifyGUID: 'HASH' },
            { resetGUID: 'HASH' },
        ],
    },
    'state': {
        FileOptions: { version: 7, name: 'sessions', map: true },
        Schema: {
            id: 'S',
            name: 'S',
            type: 'S',
            description: 'S',
            labels: 'L',
            createdBy: 'S',
            lastActive: 'S',
            createTime: 'S',
            modifyTime: 'S',
            clientCount: 'N',
            maxClients: 'N',
            requestCount: 'N',
            deleted: 'BOOL',
            published: 'S',
            official: 'BOOL',
            loadFailed: 'BOOL',
            accessMap: 'M',
            revisions: 'L',
            xprops: 'M',
        },
        KeySchema: { createdBy: 'HASH', id: 'RANGE' },
        GlobalSecondaryIndexes: [
            { published: 'HASH' },
            { id: 'HASH' }
        ],
    },
    'splitblock': {
        FileOptions: { map: true },
        Schema: {
            id: 'S',
            chunk: 'S',
            chunkKey: 'S',
            state: 'S',
            datasource: 'S',
            geoid: 'S',
            blocks: 'L'
        },
        KeySchema: { id: 'HASH' },
        GlobalSecondaryIndexes: [
            { chunkKey: 'HASH', id: 'RANGE' },
        ],
    },
    'access': {
        FileOptions: { map: true, noobject: true },
        Schema: {
            id: 'S',
            value: 'S',
        },
        KeySchema: { id: 'HASH' }
    },
    'visitor': {
        FileOptions: { map: true },
        Schema: {
            id: 'S',
            lastModified: 'S',
        },
        KeySchema: { id: 'HASH' }
    },
    'session': {
        FileOptions: { map: true },
        Schema: {
            id: 'S',
            lastActive: 'S',
            value: 'S',
        },
        KeySchema: { id: 'HASH' }
    },
    'userlikes': {},
    'likes': {},
    'comments': {},
    'stats': {},
};


/***/ }),

/***/ "@dra2020/util":
/*!********************************!*\
  !*** external "@dra2020/util" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@dra2020/util");

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