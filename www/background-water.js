/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var canvas = document.getElementById("canvas");
	
	var Splat = __webpack_require__(2);
	__webpack_require__(64);
	
	
	// This is some webpack magic to ensure the dynamically required scripts are loaded
	
	var splatSystemPath = "splat-ecs/lib/systems";
	// WARNING: can't use splatSystemPath variable here, or webpack won't pick it up
	var splatSystemRequire = __webpack_require__(65);
	
	var localSystemPath = "./systems";
	var localSystemRequire = __webpack_require__(110);
	
	var localScriptPath = "./scripts";
	var localScriptRequire = __webpack_require__(113);
	
	function generateManifest(files, folder) {
	  return files.reduce(function(manifest, file) {
	    var basename = file.substr(2);
	    manifest[basename] = folder + "/" + basename;
	    return manifest;
	  }, {});
	}
	
	__webpack_require__(116);
	
	var imageContext = __webpack_require__(117);
	var imageManifest = generateManifest(imageContext.keys(), "images");
	
	var soundContext = __webpack_require__(119);
	var soundManifest = generateManifest(soundContext.keys(), "sounds");
	
	var localDataPath = "./data";
	var localDataRequire = __webpack_require__(121);
	
	var componentContext = __webpack_require__(130);
	var componentManifest = generateComponentManifest(componentContext);
	
	function generateComponentManifest(context) {
	  var files = context.keys();
	  return files.reduce(function(manifest, file) {
	    var name = snakeToCamelCase(basename(file).substr(2));
	    manifest[name] = context(file);
	    return manifest;
	  }, {});
	}
	
	function snakeToCamelCase(str) {
	  return str.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
	}
	
	function basename(path) {
	  var pos = path.lastIndexOf(".");
	  if (pos !== -1) {
	    return path.substring(0, pos);
	  }
	  return path;
	}
	
	function customRequire(path) {
	  if (path.indexOf(splatSystemPath) === 0) {
	    var splatName = "./" + path.substr(splatSystemPath.length + 1) + ".js";
	    return splatSystemRequire(splatName);
	  }
	  if (path.indexOf(localSystemPath) === 0) {
	    var localName = "./" + path.substr(localSystemPath.length + 1) + ".js";
	    return localSystemRequire(localName);
	  }
	  if (path.indexOf(localScriptPath) === 0) {
	    var scriptName = "./" + path.substr(localScriptPath.length + 1) + ".js";
	    return localScriptRequire(scriptName);
	  }
	  if (path === "./data/components") {
	    return componentManifest;
	  }
	  if (path === "./data/images") {
	    return imageManifest;
	  }
	  if (path === "./data/sounds") {
	    return soundManifest;
	  }
	  if (path.indexOf(localDataPath) === 0) {
	    var dataName = "./" + path.substr(localDataPath.length + 1) + ".json";
	    return localDataRequire(dataName);
	  }
	  console.error("Unable to load module: \"", path, "\"");
	  return undefined;
	}
	
	window.game = new Splat.Game(canvas, customRequire);
	window.game.start();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var buffer = __webpack_require__(3);
	
	/**
	 * @namespace Splat
	 */
	module.exports = {
	  makeBuffer: buffer.makeBuffer,
	  flipBufferHorizontally: buffer.flipBufferHorizontally,
	  flipBufferVertically: buffer.flipBufferVertically,
	
	  ads: __webpack_require__(5),
	  AStar: __webpack_require__(6),
	  BinaryHeap: __webpack_require__(7),
	  Game: __webpack_require__(8),
	  iap: __webpack_require__(55),
	  Input: __webpack_require__(14),
	  leaderboards: __webpack_require__(56),
	  math: __webpack_require__(57),
	  openUrl: __webpack_require__(59),
	  NinePatch: __webpack_require__(60),
	  Particles: __webpack_require__(61),
	  saveData: __webpack_require__(63),
	  Scene: __webpack_require__(23)
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @module splat-ecs/lib/buffer */
	
	var platform = __webpack_require__(4);
	
	/**
	 * Make an invisible {@link canvas}.
	 * @param {number} width The width of the canvas
	 * @param {number} height The height of the canvas
	 * @returns {external:canvas} A canvas DOM element
	 * @private
	 */
	function makeCanvas(width, height) {
	  var c = document.createElement("canvas");
	  c.width = width;
	  c.height = height;
	  // when retina support is enabled, context.getImageData() reads from the wrong pixel causing NinePatch to break
	  if (platform.isEjecta()) {
	    c.retinaResolutionEnabled = false;
	  }
	  return c;
	}
	
	/**
	 * Make an invisible canvas buffer, and draw on it.
	 * @param {number} width The width of the buffer
	 * @param {number} height The height of the buffer
	 * @param {drawCallback} drawFun The callback that draws on the buffer
	 * @returns {external:canvas} The drawn buffer
	 */
	function makeBuffer(width, height, drawFun) {
	  var canvas = makeCanvas(width, height);
	  var ctx = canvas.getContext("2d");
	  // when image smoothing is enabled, the image gets blurred and the pixel data isn't correct even when the image shouldn't be scaled which breaks NinePatch
	  if (platform.isEjecta()) {
	    ctx.imageSmoothingEnabled = false;
	  }
	  drawFun(ctx);
	  return canvas;
	}
	
	/**
	 * Make a horizonally-flipped copy of a buffer or image.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The flipped buffer
	 */
	function flipBufferHorizontally(buffer) {
	  return makeBuffer(buffer.width, buffer.height, function(context) {
	    context.scale(-1, 1);
	    context.drawImage(buffer, -buffer.width, 0);
	  });
	}
	
	/**
	 * Make a vertically-flipped copy of a buffer or image.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The flipped buffer
	 */
	function flipBufferVertically(buffer) {
	  return makeBuffer(buffer.width, buffer.height, function(context) {
	    context.scale(1, -1);
	    context.drawImage(buffer, 0, -buffer.height);
	  });
	}
	/**
	 * Make a copy of a buffer that is rotated 90 degrees clockwise.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The rotated buffer
	 */
	function rotateClockwise(buffer) {
	  var w = buffer.height;
	  var h = buffer.width;
	  var w2 = Math.floor(w / 2);
	  var h2 = Math.floor(h / 2);
	  return makeBuffer(w, h, function(context) {
	    context.translate(w2, h2);
	    context.rotate(Math.PI / 2);
	    context.drawImage(buffer, -h2, -w2);
	  });
	}
	/**
	 * Make a copy of a buffer that is rotated 90 degrees counterclockwise.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The rotated buffer
	 */
	function rotateCounterclockwise(buffer) {
	  var w = buffer.height;
	  var h = buffer.width;
	  var w2 = Math.floor(w / 2);
	  var h2 = Math.floor(h / 2);
	  return makeBuffer(w, h, function(context) {
	    context.translate(w2, h2);
	    context.rotate(-Math.PI / 2);
	    context.drawImage(buffer, -h2, -w2);
	  });
	}
	
	module.exports = {
	  makeBuffer: makeBuffer,
	  flipBufferHorizontally: flipBufferHorizontally,
	  flipBufferVertically: flipBufferVertically,
	  rotateClockwise: rotateClockwise,
	  rotateCounterclockwise: rotateCounterclockwise
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
	  isChromeApp: function() {
	    return window.chrome && window.chrome.app && window.chrome.app.runtime;
	  },
	  isEjecta: function() {
	    return window.ejecta;
	  }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @namespace Splat.ads
	 */
	
	var platform = __webpack_require__(4);
	
	if (platform.isEjecta()) {
	  var adBanner = new window.Ejecta.AdBanner();
	
	  var isLandscape = window.innerWidth > window.innerHeight;
	
	  var sizes = {
	    "iPhone": {
	      "portrait": {
	        "width": 320,
	        "height": 50
	      },
	      "landscape": {
	        "width": 480,
	        "height": 32
	      }
	    },
	    "iPad": {
	      "portrait": {
	        "width": 768,
	        "height": 66
	      },
	      "landscape": {
	        "width": 1024,
	        "height": 66
	      }
	    }
	  };
	
	  var device = window.navigator.userAgent.indexOf("iPad") >= 0 ? "iPad" : "iPhone";
	  var size = sizes[device][isLandscape ? "landscape" : "portrait"];
	
	  module.exports = {
	    /**
	     * Show an advertisement.
	     * @alias Splat.ads.show
	     * @param {boolean} isAtBottom true if the ad should be shown at the bottom of the screen. false if it should be shown at the top.
	     */
	    "show": function(isAtBottom) {
	      adBanner.isAtBottom = isAtBottom;
	      adBanner.show();
	    },
	    /**
	     * Hide the current advertisement.
	     * @alias Splat.ads.hide
	     */
	    "hide": function() {
	      adBanner.hide();
	    },
	    /**
	     * The width of the ad that will show.
	     * @alias Splat.ads#width
	     */
	    "width": size.width,
	    /**
	     * The height of the ad that will show.
	     * @alias Splat.ads#height
	     */
	    "height": size.height
	  };
	} else {
	  module.exports = {
	    "show": function() {},
	    "hide": function() {},
	    "width": 0,
	    "height": 0
	  };
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var BinaryHeap = __webpack_require__(7);
	
	/**
	 * Implements the [A* pathfinding algorithm]{@link http://en.wikipedia.org/wiki/A*_search_algorithm} on a 2-dimensional grid. You can use this to find a path between a source and destination coordinate while avoiding obstacles.
	 * @constructor
	 * @alias Splat.AStar
	 * @param {isWalkable} isWalkable A function to test if a coordinate is walkable by the entity you're performing the pathfinding for.
	 */
	function AStar(isWalkable) {
	  this.destX = 0;
	  this.destY = 0;
	  this.scaleX = 1;
	  this.scaleY = 1;
	  this.openNodes = {};
	  this.closedNodes = {};
	  this.openHeap = new BinaryHeap(function(a, b) {
	    return a.f - b.f;
	  });
	  this.isWalkable = isWalkable;
	}
	/**
	 * The [A* heuristic]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html}, commonly referred to as h(x), that estimates how far a location is from the destination. This implementation is the [Manhattan method]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#manhattan-distance}, which is good for situations when the entity can travel in four directions. Feel free to replace this with a different heuristic implementation.
	 * @param {number} x The x coordinate to estimate the distance to the destination.
	 * @param {number} y The y coordinate to estimate the distance to the destination.
	 */
	AStar.prototype.heuristic = function(x, y) {
	  // manhattan method
	  var dx = Math.abs(x - this.destX) / this.scaleX;
	  var dy = Math.abs(y - this.destY) / this.scaleY;
	  return dx + dy;
	};
	/**
	 * Make a node to track a given coordinate
	 * @param {number} x The x coordinate of the node
	 * @param {number} y The y coordinate of the node
	 * @param {object} parent The parent node for the current node. This chain of parents eventually points back at the starting node.
	 * @param {number} g The g(x) travel cost from the parent node to this node.
	 * @private
	 */
	AStar.prototype.makeNode = function(x, y, parent, g) {
	  g += parent.g;
	  var h = this.heuristic(x, y);
	
	  return {
	    x: x,
	    y: y,
	    parent: parent,
	    f: g + h,
	    g: parent.g + g,
	    h: h
	  };
	};
	/**
	 * Update the g(x) travel cost to a node if a new lower-cost path is found.
	 * @param {string} key The key of the node on the open list.
	 * @param {object} parent A parent node that may have a shorter path for the node specified in key.
	 * @param {number} g The g(x) travel cost from parent to the node specified in key.
	 * @private
	 */
	AStar.prototype.updateOpenNode = function(key, parent, g) {
	  var node = this.openNodes[key];
	  if (!node) {
	    return false;
	  }
	
	  var newG = parent.g + g;
	
	  if (newG >= node.g) {
	    return true;
	  }
	
	  node.parent = parent;
	  node.g = newG;
	  node.f = node.g + node.h;
	
	  var pos = this.openHeap.indexOf(node);
	  this.openHeap.bubbleUp(pos);
	
	  return true;
	};
	/**
	 * Create a neighbor node to a parent node, and add it to the open list for consideration.
	 * @param {string} key The key of the new neighbor node.
	 * @param {number} x The x coordinate of the new neighbor node.
	 * @param {number} y The y coordinate of the new neighbor node.
	 * @param {object} parent The parent node of the new neighbor node.
	 * @param {number} g The travel cost from the parent to the new parent node.
	 * @private
	 */
	AStar.prototype.insertNeighbor = function(key, x, y, parent, g) {
	  var node = this.makeNode(x, y, parent, g);
	  this.openNodes[key] = node;
	  this.openHeap.insert(node);
	};
	AStar.prototype.tryNeighbor = function(x, y, parent, g) {
	  var key = makeKey(x, y);
	  if (this.closedNodes[key]) {
	    return;
	  }
	  if (!this.isWalkable(x, y)) {
	    return;
	  }
	  if (!this.updateOpenNode(key, parent, g)) {
	    this.insertNeighbor(key, x, y, parent, g);
	  }
	};
	AStar.prototype.getNeighbors = function getNeighbors(parent) {
	  var diagonalCost = 1.4;
	  var straightCost = 1;
	  this.tryNeighbor(parent.x - this.scaleX, parent.y - this.scaleY, parent, diagonalCost);
	  this.tryNeighbor(parent.x, parent.y - this.scaleY, parent, straightCost);
	  this.tryNeighbor(parent.x + this.scaleX, parent.y - this.scaleY, parent, diagonalCost);
	
	  this.tryNeighbor(parent.x - this.scaleX, parent.y, parent, straightCost);
	  this.tryNeighbor(parent.x + this.scaleX, parent.y, parent, straightCost);
	
	  this.tryNeighbor(parent.x - this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
	  this.tryNeighbor(parent.x, parent.y + this.scaleY, parent, straightCost);
	  this.tryNeighbor(parent.x + this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
	};
	
	function generatePath(node) {
	  var path = [];
	  while (node.parent) {
	    var ix = node.x;
	    var iy = node.y;
	    while (ix !== node.parent.x || iy !== node.parent.y) {
	      path.unshift({ x: ix, y: iy });
	
	      var dx = node.parent.x - ix;
	      if (dx > 0) {
	        ix++;
	      } else if (dx < 0) {
	        ix--;
	      }
	      var dy = node.parent.y - iy;
	      if (dy > 0) {
	        iy++;
	      } else if (dy < 0) {
	        iy--;
	      }
	    }
	    node = node.parent;
	  }
	  return path;
	}
	
	function makeKey(x, y) {
	  return x + "," + y;
	}
	
	/**
	 * Search for an optimal path between srcX, srcY and destX, destY, while avoiding obstacles.
	 * @param {number} srcX The starting x coordinate
	 * @param {number} srcY The starting y coordinate
	 * @param {number} destX The destination x coordinate
	 * @param {number} destY The destination y coordinate
	 * @returns {Array} The optimal path, in the form of an array of objects that each have an x and y property.
	 */
	AStar.prototype.search = function aStar(srcX, srcY, destX, destY) {
	  function scale(c, s) {
	    var downscaled = Math.floor(c / s);
	    return downscaled * s;
	  }
	  srcX = scale(srcX, this.scaleX);
	  srcY = scale(srcY, this.scaleY);
	  this.destX = scale(destX, this.scaleX);
	  this.destY = scale(destY, this.scaleY);
	
	  if (!this.isWalkable(this.destX, this.destY)) {
	    return [];
	  }
	
	  var srcKey = makeKey(srcX, srcY);
	  var srcNode = {
	    x: srcX,
	    y: srcY,
	    g: 0,
	    h: this.heuristic(srcX, srcY)
	  };
	  srcNode.f = srcNode.h;
	  this.openNodes = {};
	  this.openNodes[srcKey]  = srcNode;
	  this.openHeap = new BinaryHeap(function(a, b) {
	    return a.f - b.f;
	  });
	  this.openHeap.insert(srcNode);
	  this.closedNodes = {};
	
	  var node = this.openHeap.deleteRoot();
	  while (node) {
	    var key = makeKey(node.x, node.y);
	    delete this.openNodes[key];
	    this.closedNodes[key] = node;
	    if (node.x === this.destX && node.y === this.destY) {
	      return generatePath(node);
	    }
	    this.getNeighbors(node);
	    node = this.openHeap.deleteRoot();
	  }
	  return [];
	};
	
	module.exports = AStar;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * An implementation of the [Binary Heap]{@link https://en.wikipedia.org/wiki/Binary_heap} data structure suitable for priority queues.
	 * @constructor
	 * @alias Splat.BinaryHeap
	 * @param {compareFunction} cmp A comparison function that determines how the heap is sorted.
	 */
	function BinaryHeap(cmp) {
	  /**
	   * The comparison function for sorting the heap.
	   * @member {compareFunction}
	   * @private
	   */
	  this.cmp = cmp;
	  /**
	   * The list of elements in the heap.
	   * @member {Array}
	   * @private
	   */
	  this.array = [];
	  /**
	   * The number of elements in the heap.
	   * @member {number}
	   * @readonly
	   */
	  this.length = 0;
	}
	/**
	 * Calculate the index of a node's parent.
	 * @param {number} i The index of the child node
	 * @returns {number}
	 * @private
	 */
	BinaryHeap.prototype.parentIndex = function(i) {
	  return Math.floor((i - 1) / 2);
	};
	/**
	 * Calculate the index of a parent's first child node.
	 * @param {number} i The index of the parent node
	 * @returns {number}
	 * @private
	 */
	BinaryHeap.prototype.firstChildIndex = function(i) {
	  return (2 * i) + 1;
	};
	/**
	 * Bubble a node up the heap, stopping when it's value should not be sorted before its parent's value.
	 * @param {number} pos The index of the node to bubble up.
	 * @private
	 */
	BinaryHeap.prototype.bubbleUp = function(pos) {
	  if (pos === 0) {
	    return;
	  }
	
	  var data = this.array[pos];
	  var parentIndex = this.parentIndex(pos);
	  var parent = this.array[parentIndex];
	  if (this.cmp(data, parent) < 0) {
	    this.array[parentIndex] = data;
	    this.array[pos] = parent;
	    this.bubbleUp(parentIndex);
	  }
	};
	/**
	 * Store a new node in the heap.
	 * @param {object} data The data to store
	 */
	BinaryHeap.prototype.insert = function(data) {
	  this.array.push(data);
	  this.length = this.array.length;
	  var pos = this.array.length - 1;
	  this.bubbleUp(pos);
	};
	/**
	 * Bubble a node down the heap, stopping when it's value should not be sorted after its parent's value.
	 * @param {number} pos The index of the node to bubble down.
	 * @private
	 */
	BinaryHeap.prototype.bubbleDown = function(pos) {
	  var left = this.firstChildIndex(pos);
	  var right = left + 1;
	  var largest = pos;
	  if (left < this.array.length && this.cmp(this.array[left], this.array[largest]) < 0) {
	    largest = left;
	  }
	  if (right < this.array.length && this.cmp(this.array[right], this.array[largest]) < 0) {
	    largest = right;
	  }
	  if (largest !== pos) {
	    var tmp = this.array[pos];
	    this.array[pos] = this.array[largest];
	    this.array[largest] = tmp;
	    this.bubbleDown(largest);
	  }
	};
	/**
	 * Remove the heap's root node, and return it. The root node is whatever comes first as determined by the {@link compareFunction}.
	 * @returns {data} The root node's data.
	 */
	BinaryHeap.prototype.deleteRoot = function() {
	  var root = this.array[0];
	  if (this.array.length <= 1) {
	    this.array = [];
	    this.length = 0;
	    return root;
	  }
	  this.array[0] = this.array.pop();
	  this.length = this.array.length;
	  this.bubbleDown(0);
	  return root;
	};
	/**
	 * Search for a node in the heap.
	 * @param {object} data The data to search for.
	 * @returns {number} The index of the data in the heap, or -1 if it is not found.
	 */
	BinaryHeap.prototype.indexOf = function(data) {
	  for (var i = 0; i < this.array.length; i++) {
	    if (this.array[i] === data) {
	      return i;
	    }
	  }
	  return -1;
	};
	
	module.exports = BinaryHeap;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var AssetLoader = __webpack_require__(9);
	var loadImage = __webpack_require__(12);
	var Input = __webpack_require__(14);
	var Prefabs = __webpack_require__(20);
	var Scene = __webpack_require__(23);
	var SoundManager = __webpack_require__(52);
	var splitFilmStripAnimations = __webpack_require__(54);
	
	function Game(canvas, customRequire) {
	  this.animations = customRequire("./data/animations");
	  splitFilmStripAnimations(this.animations);
	  this.canvas = canvas;
	  this.context = canvas.getContext("2d");
	  this.images = new AssetLoader(customRequire("./data/images"), loadImage);
	  this.inputs = new Input(customRequire("./data/inputs"), canvas);
	  this.require = customRequire;
	  this.sounds = new SoundManager(customRequire("./data/sounds"));
	  this.prefabs = new Prefabs(customRequire("./data/prefabs"));
	  this.lastTime = -1;
	  this.remainingDebugTime = undefined;
	
	  this.scaleCanvasToCssSize();
	  window.addEventListener("resize", this.onCanvasResize.bind(this));
	
	  this.scenes = this.makeScenes(customRequire("./data/scenes"));
	  this.run = this.run.bind(this);
	}
	Game.prototype.makeScenes = function(sceneList) {
	  var names = Object.keys(sceneList);
	  var scenes = {};
	  for (var i = 0; i < names.length; i++) {
	    var name = names[i];
	    scenes[name] = new Scene(name, {
	      animations: this.animations,
	      canvas: this.canvas,
	      context: this.context,
	      images: this.images,
	      inputs: this.inputs,
	      prefabs: this.prefabs,
	      require: this.require,
	      scaleCanvasToCssSize: this.scaleCanvasToCssSize.bind(this),
	      scaleCanvasToFitRectangle: this.scaleCanvasToFitRectangle.bind(this),
	      scenes: scenes,
	      sounds: this.sounds
	    });
	    if (sceneList[name].first) {
	      scenes[name].start();
	    }
	  }
	  return scenes;
	};
	Game.prototype.start = function() {
	  if (this.running) {
	    return;
	  }
	  this.running = true;
	  this.lastTime = -1;
	  window.requestAnimationFrame(this.run);
	};
	Game.prototype.stop = function() {
	  this.running = false;
	};
	Game.prototype.run = function(time) {
	  var scenes = Object.keys(this.scenes);
	
	  if (this.lastTime === -1) {
	    this.lastTime = time;
	  }
	  var elapsed = time - this.lastTime;
	  this.lastTime = time;
	
	  for (var i = 0; i < scenes.length; i++) {
	    var name = scenes[i];
	    var scene = this.scenes[name];
	    scene.simulate(elapsed);
	  }
	  for (i = 0; i < scenes.length; i++) {
	    name = scenes[i];
	    scene = this.scenes[name];
	    this.context.save();
	    scene.render(elapsed);
	    this.context.restore();
	  }
	
	  if (this.remainingDebugTime !== undefined) {
	    this.remainingDebugTime -= elapsed;
	    if (this.remainingDebugTime <= 0) {
	      this.remainingDebugTime = undefined;
	      this.logDebugTimes();
	    }
	  }
	
	  if (this.running) {
	    window.requestAnimationFrame(this.run);
	  }
	};
	Game.prototype.timeSystems = function(total) {
	  var scenes = Object.keys(this.scenes);
	  for (var i = 0; i < scenes.length; i++) {
	    var name = scenes[i];
	    var scene = this.scenes[name];
	    scene.simulation.resetTimings();
	    scene.renderer.resetTimings();
	  }
	  this.remainingDebugTime = total;
	};
	Game.prototype.logDebugTimes = function() {
	  var scenes = Object.keys(this.scenes);
	  var timings = [];
	  for (var i = 0; i < scenes.length; i++) {
	    var name = scenes[i];
	    var scene = this.scenes[name];
	    timings = timings.concat(scene.simulation.timings());
	    timings = timings.concat(scene.renderer.timings());
	  }
	  console.table(groupTimings(timings));
	};
	function groupTimings(timings) {
	  var total = timings.map(function(timing) {
	    return timing.time;
	  }).reduce(function(a, b) {
	    return a + b;
	  });
	  timings.sort(function(a, b) {
	    return b.time - a.time;
	  }).forEach(function(timing) {
	    timing.percent = timing.time / total;
	  });
	  return timings;
	}
	Game.prototype.onCanvasResize = function() {
	  this.resizer();
	};
	Game.prototype.scaleCanvasToCssSize = function() {
	  this.resizer = function() {
	    var canvasStyle = window.getComputedStyle(this.canvas);
	    var width = parseInt(canvasStyle.width);
	    var height = parseInt(canvasStyle.height);
	    this.canvas.width = width;
	    this.canvas.height = height;
	  }.bind(this);
	  this.resizer();
	};
	Game.prototype.scaleCanvasToFitRectangle = function(width, height) {
	  this.resizer = function() {
	    var canvasStyle = window.getComputedStyle(this.canvas);
	    var cssWidth = parseInt(canvasStyle.width);
	    var cssHeight = parseInt(canvasStyle.height);
	    var cssAspectRatio = cssWidth / cssHeight;
	
	    var desiredWidth = width;
	    var desiredHeight = height;
	    var desiredAspectRatio = width / height;
	    if (desiredAspectRatio > cssAspectRatio) {
	      desiredHeight = Math.floor(width / cssAspectRatio);
	    } else if (desiredAspectRatio < cssAspectRatio) {
	      desiredWidth = Math.floor(height * cssAspectRatio);
	    }
	
	    this.canvas.width = desiredWidth;
	    this.canvas.height = desiredHeight;
	  }.bind(this);
	  this.resizer();
	};
	
	module.exports = Game;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var loadAssets = __webpack_require__(10);
	
	/**
	 * Loads external assets, lets you track their progress, and lets you access the loaded data.
	 * @constructor
	 */
	function AssetLoader(manifest, loader) {
	  this.assets = loadAssets(manifest, loader, function(err) {
	    if (err) {
	      console.error(err);
	    }
	  });
	}
	AssetLoader.prototype.bytesLoaded = function() {
	  return Object.keys(this.assets).reduce(function(accum, key) {
	    var asset = this.assets[key];
	    return accum + asset.loaded;
	  }.bind(this), 0);
	};
	AssetLoader.prototype.totalBytes = function() {
	  return Object.keys(this.assets).reduce(function(accum, key) {
	    var asset = this.assets[key];
	    return accum + asset.total;
	  }.bind(this), 0);
	};
	/**
	 * Retrieve a loaded asset.
	 * @param {string} name The name given to the asset in the manifest.
	 * @returns {object}
	 */
	AssetLoader.prototype.get = function(name) {
	  var asset = this.assets[name];
	  if (asset === undefined) {
	    console.error("No such asset:", name);
	    return undefined;
	  }
	  return asset.data;
	};
	
	module.exports = AssetLoader;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var once = __webpack_require__(11);
	
	module.exports = function(manifest, loader, callback) {
	  callback = once(callback);
	
	  var finished = 0;
	  var keys = Object.keys(manifest);
	  return keys.reduce(function(assets, key) {
	    var url = manifest[key];
	    assets[key] = loader(url, function(err) {
	      if (err) {
	        callback(err);
	        return;
	      }
	      finished++;
	      if (finished === keys.length) {
	        callback(undefined, assets);
	      }
	    });
	    return assets;
	  }, {});
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(fn) {
	  var called = false;
	  return function() {
	    if (!called) {
	      called = true;
	      return fn.apply(this, arguments);
	    }
	  };
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var loadAsset = __webpack_require__(13);
	
	function blobToImage(blob) {
	  var image = new Image();
	  image.src = window.URL.createObjectURL(blob);
	  return image;
	}
	
	module.exports = function(url, callback) {
	  return loadAsset(url, "blob", function(err, asset) {
	    if (err) {
	      callback(err);
	      return;
	    }
	    asset.data = blobToImage(asset.data);
	    callback(undefined, asset);
	  });
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var once = __webpack_require__(11);
	
	module.exports = function(url, responseType, callback) {
	  callback = once(callback);
	  var asset = {
	    loaded: 0,
	    total: 1,
	    data: undefined
	  };
	
	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	  request.responseType = responseType;
	  request.addEventListener("progress", function(e) {
	    if (e.lengthComputable) {
	      asset.loaded = e.loaded;
	      asset.total = e.total;
	    }
	  });
	  request.addEventListener("load", function() {
	    asset.data = request.response;
	    asset.loaded = asset.total;
	    callback(undefined, asset);
	  });
	  request.addEventListener("abort", function(e) {
	    asset.error = e;
	    callback(e);
	  });
	  request.addEventListener("error", function(e) {
	    asset.error = e;
	    callback(e);
	  });
	  try {
	    request.send();
	  } catch (e) {
	    callback(e);
	  }
	  return asset;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Gamepad = __webpack_require__(15);
	var Keyboard = __webpack_require__(17);
	var keyMap = __webpack_require__(18).US;
	var keyboard = new Keyboard(keyMap);
	var Mouse = __webpack_require__(19);
	
	function Input(config, canvas) {
	  this.config = config;
	  this.gamepad = new Gamepad();
	  this.mouse = new Mouse(canvas);
	  this.lastButtonState = {};
	  this.delayedButtonUpdates = {};
	  // FIXME: add support for virtual axes
	  this.virtualButtons = {};
	}
	Input.prototype.axis = function(name) {
	  var input = this.config.axes[name];
	  if (input === undefined) {
	    console.error("No such axis: " + name);
	    return false;
	  }
	  for (var i = 0; i < input.length; i++) {
	    var physicalInput = input[i];
	    var device = physicalInput.device;
	    if (device === "mouse") {
	      if (physicalInput.axis === "x") {
	        return this.mouse.x;
	      }
	      if (physicalInput.axis === "y") {
	        return this.mouse.y;
	      }
	    }
	    if (device === "gamepad") {
	      return this.gamepad.axis(0, physicalInput.axis);
	    }
	  }
	};
	Input.prototype.button = function(name) {
	  var input = this.config.buttons[name];
	  if (input === undefined) {
	    console.error("No such button: " + name);
	    return false;
	  }
	  for (var i = 0; i < input.length; i++) {
	    var physicalInput = input[i];
	    var device = physicalInput.device;
	    if (device === "keyboard") {
	      if (keyboard.isPressed(physicalInput.button)) {
	        return true;
	      }
	    }
	    if (device === "mouse") {
	      if (this.mouse.isPressed(physicalInput.button)) {
	        return true;
	      }
	    }
	    if (device === "gamepad") {
	      if (this.gamepad.button(0, physicalInput.button)) {
	        return true;
	      }
	    }
	    if (device === "virtual") {
	      if (physicalInput.state) {
	        return true;
	      }
	    }
	  }
	  return false;
	};
	Input.prototype.buttonPressed = function(name) {
	  var current = this.button(name);
	  var last = this.lastButtonState[name];
	  if (last === undefined) {
	    last = true;
	  }
	  this.delayedButtonUpdates[name] = current;
	  return current && !last;
	};
	Input.prototype.buttonReleased = function(name) {
	  var current = this.button(name);
	  var last = this.lastButtonState[name];
	  if (last === undefined) {
	    last = false;
	  }
	  this.delayedButtonUpdates[name] = current;
	  return !current && last;
	};
	Input.prototype.setButton = function(name, instance, state) {
	  var virtualName = name + "|" + instance;
	  var virtual = this.virtualButtons[virtualName];
	  if (virtual) {
	    virtual.state = state;
	  } else {
	    virtual = {
	      device: "virtual",
	      state: state
	    };
	    this.virtualButtons[virtualName] = virtual;
	    var inputs = this.config.buttons[name];
	    if (inputs) {
	      inputs.push(virtual);
	    } else {
	      this.config.buttons[name] = [virtual];
	    }
	  }
	};
	Input.prototype.processUpdates = function() {
	  this.gamepad.update();
	  Object.keys(this.delayedButtonUpdates).forEach(function(name) {
	    this.lastButtonState[name] = this.delayedButtonUpdates[name];
	    delete this.delayedButtonUpdates[name];
	  }.bind(this));
	};
	
	module.exports = Input;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var mappings = __webpack_require__(16);
	
	function getMapping(gamepadId, userAgent) {
	  return mappings.filter(function(mapping) {
	    return gamepadId.indexOf(mapping.id) !== -1 && userAgent.indexOf(mapping.userAgent) !== -1;
	  })[0] || mappings[0];
	}
	
	function transformButton(mapping, gp, button, i) {
	  var mb = mapping.buttons[i] || { name: "button " + i };
	  gp.buttons[mb.name] = button.pressed;
	  if (mb.axis) {
	    if (button.pressed) {
	      gp.axes[mb.axis] = mb.axisValue;
	    } else if (gp.axes[mb.axis] === undefined) {
	      gp.axes[mb.axis] = 0;
	    }
	  }
	  return gp;
	}
	
	function scaleAxis(axis, scale) {
	  if (scale === "to positive") {
	    return (axis + 1.0) / 2.0;
	  }
	  if (scale === "to negative") {
	    return (axis + 1.0) / -2.0;
	  }
	  return axis;
	}
	
	function transformAxis(mapping, threshold, gp, axis, i) {
	  var ma = mapping.axes[i] || { name: "axis " + i };
	  gp.axes[ma.name] = scaleAxis(axis, ma.scale);
	  if (ma.buttons) {
	    if (ma.buttons[0] !== null) {
	      gp.buttons[ma.buttons[0]] = axis < -threshold;
	    }
	    if (ma.buttons[1] !== null) {
	      gp.buttons[ma.buttons[1]] = axis > threshold;
	    }
	  }
	  return gp;
	}
	
	function transformGamepad(threshold, gamepad) {
	  var gp = {
	    id: gamepad.id,
	    buttons: {},
	    axes: {}
	  };
	  var mapping = getMapping(gamepad.id, navigator.userAgent);
	  gp = gamepad.buttons.reduce(transformButton.bind(undefined, mapping), gp),
	  gp = gamepad.axes.reduce(transformAxis.bind(undefined, mapping, threshold), gp);
	  return gp;
	}
	
	function isDefined(val) {
	  return val !== undefined;
	}
	
	function Gamepad() {
	  this.threshold = 0.05;
	  this.gamepads = [];
	}
	Gamepad.prototype.update = function() {
	  if (typeof navigator.getGamepads !== "function") {
	    return;
	  }
	  // navigator.getGamepads() returns an array-like object, not an actual object
	  // so convert to an array so we can call map()
	  //
	  // WTF: webkit always returns 4 gamepads, so remove the undefined ones
	  var gamepads = Array.prototype.slice.call(navigator.getGamepads()).filter(isDefined);
	  this.gamepads = gamepads.map(transformGamepad.bind(undefined, this.threshold));
	};
	Gamepad.prototype.axis = function(gamepad, axis) {
	  if (gamepad >= this.gamepads.length) {
	    return 0;
	  }
	  return this.gamepads[gamepad].axes[axis];
	};
	Gamepad.prototype.count = function() {
	  return this.gamepads.length;
	};
	Gamepad.prototype.button = function(gamepad, button) {
	  if (gamepad >= this.gamepads.length) {
	    return false;
	  }
	  return this.gamepads[gamepad].buttons[button];
	};
	Gamepad.prototype.name = function(gamepad) {
	  if (gamepad >= this.gamepads.length) {
	    return undefined;
	  }
	  return this.gamepads[gamepad].id;
	};
	
	module.exports = Gamepad;


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = [
		{
			"id": "Logitech Gamepad F310",
			"userAgent": "Firefox",
			"buttons": [
				{
					"name": "a"
				},
				{
					"name": "b"
				},
				{
					"name": "x"
				},
				{
					"name": "y"
				},
				{
					"name": "left shoulder"
				},
				{
					"name": "right shoulder"
				},
				{
					"name": "back"
				},
				{
					"name": "start"
				},
				{
					"name": "home"
				},
				{
					"name": "left stick"
				},
				{
					"name": "right stick"
				}
			],
			"axes": [
				{
					"name": "left stick x",
					"buttons": [
						"left stick left",
						"left stick right"
					]
				},
				{
					"name": "left stick y",
					"buttons": [
						"left stick up",
						"left stick down"
					]
				},
				{
					"name": "left trigger",
					"scale": "to positive",
					"buttons": [
						null,
						"left trigger"
					]
				},
				{
					"name": "right stick x",
					"buttons": [
						"right stick left",
						"right stick right"
					]
				},
				{
					"name": "right stick y",
					"buttons": [
						"right stick up",
						"right stick down"
					]
				},
				{
					"name": "right trigger",
					"scale": "to positive",
					"buttons": [
						null,
						"right trigger"
					]
				},
				{
					"name": "dpad x",
					"buttons": [
						"dpad left",
						"dpad right"
					]
				},
				{
					"name": "dpad y",
					"buttons": [
						"dpad up",
						"dpad down"
					]
				}
			]
		},
		{
			"id": "Logitech Gamepad F310",
			"userAgent": "WebKit",
			"buttons": [
				{
					"name": "a"
				},
				{
					"name": "b"
				},
				{
					"name": "x"
				},
				{
					"name": "y"
				},
				{
					"name": "left shoulder"
				},
				{
					"name": "right shoulder"
				},
				{
					"name": "left trigger",
					"axis": "left trigger",
					"axisValue": 1
				},
				{
					"name": "right trigger",
					"axis": "right trigger",
					"axisValue": 1
				},
				{
					"name": "back"
				},
				{
					"name": "start"
				},
				{
					"name": "left stick"
				},
				{
					"name": "right stick"
				},
				{
					"name": "dpad up",
					"axis": "dpad y",
					"axisValue": -1
				},
				{
					"name": "dpad down",
					"axis": "dpad y",
					"axisValue": 1
				},
				{
					"name": "dpad left",
					"axis": "dpad x",
					"axisValue": -1
				},
				{
					"name": "dpad right",
					"axis": "dpad x",
					"axisValue": 1
				},
				{
					"name": "home"
				}
			],
			"axes": [
				{
					"name": "left stick x",
					"buttons": [
						"left stick left",
						"left stick right"
					]
				},
				{
					"name": "left stick y",
					"buttons": [
						"left stick up",
						"left stick down"
					]
				},
				{
					"name": "right stick x",
					"buttons": [
						"right stick left",
						"right stick right"
					]
				},
				{
					"name": "right stick y",
					"buttons": [
						"right stick up",
						"right stick down"
					]
				}
			]
		},
		{
			"id": "Sony Computer Entertainment Wireless Controller",
			"userAgent": "Firefox",
			"buttons": [
				{
					"name": "x"
				},
				{
					"name": "a"
				},
				{
					"name": "b"
				},
				{
					"name": "y"
				},
				{
					"name": "left shoulder"
				},
				{
					"name": "right shoulder"
				},
				{
					"name": "left trigger"
				},
				{
					"name": "right trigger"
				},
				{
					"name": "back"
				},
				{
					"name": "start"
				},
				{
					"name": "left stick"
				},
				{
					"name": "right stick"
				},
				{
					"name": "home"
				},
				{
					"name": "touch"
				}
			],
			"axes": [
				{
					"name": "left stick x",
					"buttons": [
						"left stick left",
						"left stick right"
					]
				},
				{
					"name": "left stick y",
					"buttons": [
						"left stick up",
						"left stick down"
					]
				},
				{
					"name": "right stick x",
					"buttons": [
						"right stick left",
						"right stick right"
					]
				},
				{
					"name": "left trigger",
					"scale": "to positive"
				},
				{
					"name": "right trigger",
					"scale": "to positive"
				},
				{
					"name": "right stick y",
					"buttons": [
						"right stick up",
						"right stick down"
					]
				},
				{
					"name": "dpad x",
					"buttons": [
						"dpad left",
						"dpad right"
					]
				},
				{
					"name": "dpad y",
					"buttons": [
						"dpad up",
						"dpad down"
					]
				}
			]
		},
		{
			"id": "Sony Computer Entertainment Wireless Controller",
			"userAgent": "WebKit",
			"buttons": [
				{
					"name": "a"
				},
				{
					"name": "b"
				},
				{
					"name": "x"
				},
				{
					"name": "y"
				},
				{
					"name": "left shoulder"
				},
				{
					"name": "right shoulder"
				},
				{
					"name": "left trigger",
					"axis": "left trigger",
					"axisValue": 1
				},
				{
					"name": "right trigger",
					"axis": "right trigger",
					"axisValue": 1
				},
				{
					"name": "back"
				},
				{
					"name": "start"
				},
				{
					"name": "left stick"
				},
				{
					"name": "right stick"
				},
				{
					"name": "dpad up",
					"axis": "dpad y",
					"axisValue": -1
				},
				{
					"name": "dpad down",
					"axis": "dpad y",
					"axisValue": 1
				},
				{
					"name": "dpad left",
					"axis": "dpad x",
					"axisValue": -1
				},
				{
					"name": "dpad right",
					"axis": "dpad x",
					"axisValue": 1
				},
				{
					"name": "home"
				},
				{
					"name": "touch"
				}
			],
			"axes": [
				{
					"name": "left stick x",
					"buttons": [
						"left stick left",
						"left stick right"
					]
				},
				{
					"name": "left stick y",
					"buttons": [
						"left stick up",
						"left stick down"
					]
				},
				{
					"name": "right stick x",
					"buttons": [
						"right stick left",
						"right stick right"
					]
				},
				{
					"name": "right stick y",
					"buttons": [
						"right stick up",
						"right stick down"
					]
				}
			]
		},
		{
			"id": "Sony PLAYSTATION(R)3 Controller",
			"userAgent": "Firefox",
			"buttons": [
				{
					"name": "back"
				},
				{
					"name": "left stick"
				},
				{
					"name": "right stick"
				},
				{
					"name": "start"
				},
				{
					"name": "dpad up",
					"axis": "dpad y",
					"axisValue": -1
				},
				{
					"name": "dpad right",
					"axis": "dpad x",
					"axisValue": 1
				},
				{
					"name": "dpad down",
					"axis": "dpad y",
					"axisValue": 1
				},
				{
					"name": "dpad left",
					"axis": "dpad x",
					"axisValue": -1
				},
				{
					"name": "left trigger"
				},
				{
					"name": "right trigger"
				},
				{
					"name": "left shoulder"
				},
				{
					"name": "right shoulder"
				},
				{
					"name": "y"
				},
				{
					"name": "b"
				},
				{
					"name": "a"
				},
				{
					"name": "x"
				},
				{
					"name": "home"
				}
			],
			"axes": [
				{
					"name": "left stick x",
					"buttons": [
						"left stick left",
						"left stick right"
					]
				},
				{
					"name": "left stick y",
					"buttons": [
						"left stick up",
						"left stick down"
					]
				},
				{
					"name": "right stick x",
					"buttons": [
						"right stick left",
						"right stick right"
					]
				},
				{
					"name": "right stick y",
					"buttons": [
						"right stick up",
						"right stick down"
					]
				},
				{
					"name": "dunno 1"
				},
				{
					"name": "dunno 2"
				},
				{
					"name": "dunno 3"
				},
				{
					"name": "dunno 4"
				},
				{
					"name": "dpad up",
					"scale": "to positive"
				},
				{
					"name": "dpad right",
					"scale": "to positive"
				},
				{
					"name": "dpad down",
					"scale": "to positive"
				},
				{
					"name": "dunno 8"
				},
				{
					"name": "left trigger",
					"scale": "to positive"
				},
				{
					"name": "right trigger",
					"scale": "to positive"
				},
				{
					"name": "left shoulder",
					"scale": "to positive"
				},
				{
					"name": "right shoulder",
					"scale": "to positive"
				},
				{
					"name": "y",
					"scale": "to positive"
				},
				{
					"name": "b",
					"scale": "to positive"
				},
				{
					"name": "a",
					"scale": "to positive"
				},
				{
					"name": "x",
					"scale": "to positive"
				},
				{
					"name": "dunno 9"
				},
				{
					"name": "dunno 10"
				},
				{
					"name": "dunno 11"
				},
				{
					"name": "accelerometer x"
				},
				{
					"name": "accelerometer y"
				},
				{
					"name": "accelerometer z"
				}
			]
		},
		{
			"id": "Sony PLAYSTATION(R)3 Controller",
			"userAgent": "WebKit",
			"buttons": [
				{
					"name": "a"
				},
				{
					"name": "b"
				},
				{
					"name": "x"
				},
				{
					"name": "y"
				},
				{
					"name": "left shoulder"
				},
				{
					"name": "right shoulder"
				},
				{
					"name": "left trigger",
					"axis": "left trigger",
					"axisValue": 1
				},
				{
					"name": "right trigger",
					"axis": "right trigger",
					"axisValue": 1
				},
				{
					"name": "back"
				},
				{
					"name": "start"
				},
				{
					"name": "left stick"
				},
				{
					"name": "right stick"
				},
				{
					"name": "dpad up",
					"axis": "dpad y",
					"axisValue": -1
				},
				{
					"name": "dpad down",
					"axis": "dpad y",
					"axisValue": 1
				},
				{
					"name": "dpad left",
					"axis": "dpad x",
					"axisValue": -1
				},
				{
					"name": "dpad right",
					"axis": "dpad x",
					"axisValue": 1
				},
				{
					"name": "home"
				}
			],
			"axes": [
				{
					"name": "left stick x",
					"buttons": [
						"left stick left",
						"left stick right"
					]
				},
				{
					"name": "left stick y",
					"buttons": [
						"left stick up",
						"left stick down"
					]
				},
				{
					"name": "right stick x",
					"buttons": [
						"right stick left",
						"right stick right"
					]
				},
				{
					"name": "right stick y",
					"buttons": [
						"right stick up",
						"right stick down"
					]
				}
			]
		}
	];

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Keyboard input handling.
	 * @constructor
	 * @param {module:KeyMap} keymap A map of keycodes to descriptive key names.
	 */
	function Keyboard(keyMap) {
		/**
		 * The current key states.
		 * @member {object}
		 * @private
		 */
		this.keys = {};
	
		var self = this;
		for (var kc in keyMap) {
			if (keyMap.hasOwnProperty(kc)) {
				this.keys[keyMap[kc]] = 0;
			}
		}
		window.addEventListener("keydown", function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				if (self.keys[keyMap[event.keyCode]] === 0) {
					self.keys[keyMap[event.keyCode]] = 2;
				}
				return false;
			}
		});
		window.addEventListener("keyup", function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				self.keys[keyMap[event.keyCode]] = 0;
				return false;
			}
		});
	}
	/**
	 * Test if a key is currently pressed.
	 * @param {string} name The name of the key to test
	 * @returns {boolean}
	 */
	Keyboard.prototype.isPressed = function(name) {
		return this.keys[name] >= 1;
	};
	/**
	 * Test if a key is currently pressed, also making it look like the key was unpressed.
	 * This makes is so multiple successive calls will not return true unless the key was repressed.
	 * @param {string} name The name of the key to test
	 * @returns {boolean}
	 */
	Keyboard.prototype.consumePressed = function(name) {
		var p = this.keys[name] === 2;
		if (p) {
			this.keys[name] = 1;
		}
		return p;
	};
	
	module.exports = Keyboard;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * Keyboard code mappings that map keycodes to key names. A specific named map should be given to {@link Keyboard}.
	 * @module KeyMap
	 */
	module.exports = {
		"US": {
			8: "backspace",
			9: "tab",
			13: "enter",
			16: "shift",
			17: "ctrl",
			18: "alt",
			19: "pause/break",
			20: "capslock",
			27: "escape",
			32: "space",
			33: "pageup",
			34: "pagedown",
			35: "end",
			36: "home",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
			45: "insert",
			46: "delete",
			48: "0",
			49: "1",
			50: "2",
			51: "3",
			52: "4",
			53: "5",
			54: "6",
			55: "7",
			56: "8",
			57: "9",
			65: "a",
			66: "b",
			67: "c",
			68: "d",
			69: "e",
			70: "f",
			71: "g",
			72: "h",
			73: "i",
			74: "j",
			75: "k",
			76: "l",
			77: "m",
			78: "n",
			79: "o",
			80: "p",
			81: "q",
			82: "r",
			83: "s",
			84: "t",
			85: "u",
			86: "v",
			87: "w",
			88: "x",
			89: "y",
			90: "z",
			91: "leftwindow",
			92: "rightwindow",
			93: "select",
			96: "numpad-0",
			97: "numpad-1",
			98: "numpad-2",
			99: "numpad-3",
			100: "numpad-4",
			101: "numpad-5",
			102: "numpad-6",
			103: "numpad-7",
			104: "numpad-8",
			105: "numpad-9",
			106: "multiply",
			107: "add",
			109: "subtract",
			110: "decimalpoint",
			111: "divide",
			112: "f1",
			113: "f2",
			114: "f3",
			115: "f4",
			116: "f5",
			117: "f6",
			118: "f7",
			119: "f8",
			120: "f9",
			121: "f10",
			122: "f11",
			123: "f12",
			144: "numlock",
			145: "scrolllock",
			186: "semicolon",
			187: "equals",
			188: "comma",
			189: "dash",
			190: "period",
			191: "forwardslash",
			192: "graveaccent",
			219: "openbracket",
			220: "backslash",
			221: "closebraket",
			222: "singlequote"
		}
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var platform = __webpack_require__(4);
	
	// prevent springy scrolling on ios
	document.ontouchmove = function(e) {
	  e.preventDefault();
	};
	
	// prevent right-click on desktop
	window.oncontextmenu = function() {
	  return false;
	};
	
	var relMouseCoords = function(canvas, event) {
	  var x = event.pageX - canvas.offsetLeft + document.body.scrollLeft;
	  var y = event.pageY - canvas.offsetTop + document.body.scrollTop;
	
	  // scale based on ratio of canvas internal dimentions to css dimensions
	  var style = window.getComputedStyle(canvas);
	  var cw = parseInt(style.width);
	  var ch = parseInt(style.height);
	
	  x *= canvas.width / cw;
	  y *= canvas.height / ch;
	
	  return {
	    x: Math.floor(x),
	    y: Math.floor(y)
	  };
	};
	
	function relMouseCoordsEjecta(canvas, event) {
	  var ratioX = canvas.width / window.innerWidth;
	  var ratioY = canvas.height / window.innerHeight;
	  var x = event.pageX * ratioX;
	  var y = event.pageY * ratioY;
	  return { x: x, y: y };
	}
	
	if (platform.isEjecta()) {
	  relMouseCoords = relMouseCoordsEjecta;
	}
	
	/**
	 * Mouse and touch input handling. An instance of Mouse is available as {@link Splat.Game#mouse}.
	 *
	 * The first touch will emulates a mouse press with button 0.
	 * This means you can use the mouse ({@link Mouse#isPressed}) APIs and your game will work on touch screens (as long as you only need the left button).
	 *
	 * A mouse press will emulate a touch if the device does not support touch.
	 * This means you can use {@link Mouse#touches}, and your game will still work on a PC with a mouse.
	 *
	 * @constructor
	 * @param {external:canvas} canvas The canvas to listen for events on.
	 */
	function Mouse(canvas) {
	  /**
	* The x coordinate of the cursor relative to the left side of the canvas.
	* @member {number}
	*/
	  this.x = 0;
	  /**
	   * The y coordinate of the cursor relative to the top of the canvas.
	   * @member {number}
	   */
	  this.y = 0;
	  /**
	   * The current button states.
	   * @member {Array}
	   * @private
	   */
	  this.buttons = [false, false, false];
	
	  /**
	   * An array of the current touches on a touch screen device. Each touch has a `x`, `y`, and `id` field.
	   * @member {Array}
	   */
	  this.touches = [];
	
	  /**
	   * A function that is called when a mouse button or touch is released.
	   * @callback onmouseupHandler
	   * @param {number} x The x coordinate of the mouse or touch that was released.
	   * @param {number} y The y coordinate of the mouse or touch that was released.
	   */
	  /**
	   * A function that will be called when a mouse button is released, or a touch has stopped.
	   * This is useful for opening a URL with {@link Splat.openUrl} to avoid popup blockers.
	   * @member {onmouseupHandler}
	   */
	  this.onmouseup = undefined;
	
	  var self = this;
	  canvas.addEventListener("mousedown", function(event) {
	    var m = relMouseCoords(canvas, event);
	    self.x = m.x;
	    self.y = m.y;
	    self.buttons[event.button] = true;
	    updateTouchFromMouse();
	  });
	  canvas.addEventListener("mouseup", function(event) {
	    var m = relMouseCoords(canvas, event);
	    self.x = m.x;
	    self.y = m.y;
	    self.buttons[event.button] = false;
	    updateTouchFromMouse();
	    if (self.onmouseup) {
	      self.onmouseup(self.x, self.y);
	    }
	  });
	  canvas.addEventListener("mousemove", function(event) {
	    var m = relMouseCoords(canvas, event);
	    self.x = m.x;
	    self.y = m.y;
	    updateTouchFromMouse();
	  });
	
	  function updateTouchFromMouse() {
	    if (self.supportsTouch()) {
	      return;
	    }
	    var idx = touchIndexById("mouse");
	    if (self.isPressed(0)) {
	      if (idx !== undefined) {
	        var touch = self.touches[idx];
	        touch.x = self.x;
	        touch.y = self.y;
	      } else {
	        self.touches.push({
	          id: "mouse",
	          x: self.x,
	          y: self.y
	        });
	      }
	    } else if (idx !== undefined) {
	      self.touches.splice(idx, 1);
	    }
	  }
	  function updateMouseFromTouch(touch) {
	    self.x = touch.x;
	    self.y = touch.y;
	    if (self.buttons[0] === false) {
	      self.buttons[0] = true;
	    }
	  }
	  function touchIndexById(id) {
	    for (var i = 0; i < self.touches.length; i++) {
	      if (self.touches[i].id === id) {
	        return i;
	      }
	    }
	    return undefined;
	  }
	  function eachChangedTouch(event, onChangeFunc) {
	    var touches = event.changedTouches;
	    for (var i = 0; i < touches.length; i++) {
	      onChangeFunc(touches[i]);
	    }
	  }
	  canvas.addEventListener("touchstart", function(event) {
	    eachChangedTouch(event, function(touch) {
	      var t = relMouseCoords(canvas, touch);
	      t.id = touch.identifier;
	      if (self.touches.length === 0) {
	        t.isMouse = true;
	        updateMouseFromTouch(t);
	      }
	      self.touches.push(t);
	    });
	  });
	  canvas.addEventListener("touchmove", function(event) {
	    eachChangedTouch(event, function(touch) {
	      var idx = touchIndexById(touch.identifier);
	      var t = self.touches[idx];
	      var coords = relMouseCoords(canvas, touch);
	      t.x = coords.x;
	      t.y = coords.y;
	      if (t.isMouse) {
	        updateMouseFromTouch(t);
	      }
	    });
	  });
	  canvas.addEventListener("touchend", function(event) {
	    eachChangedTouch(event, function(touch) {
	      var idx = touchIndexById(touch.identifier);
	      var t = self.touches.splice(idx, 1)[0];
	      if (t.isMouse) {
	        if (self.touches.length === 0) {
	          self.buttons[0] = false;
	        } else {
	          self.touches[0].isMouse = true;
	          updateMouseFromTouch(self.touches[0]);
	        }
	      }
	      if (self.onmouseup) {
	        self.onmouseup(t.x, t.y);
	      }
	    });
	  });
	}
	/**
	 * Test whether the device supports touch events. This is useful to customize messages to say either "click" or "tap".
	 * @returns {boolean}
	 */
	Mouse.prototype.supportsTouch = function() {
	  return "ontouchstart" in window || navigator.msMaxTouchPoints;
	};
	/**
	 * Test if a mouse button is currently pressed.
	 * @param {number} button The button number to test. Button 0 is typically the left mouse button, as well as the first touch location.
	 * @returns {boolean}
	 */
	Mouse.prototype.isPressed = function(button) {
	  return this.buttons[button];
	};
	
	module.exports = Mouse;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var clone = __webpack_require__(21);
	var setOrAddComponent = __webpack_require__(22);
	
	function Prefabs(prefabs) {
	  this.prefabs = prefabs;
	}
	Prefabs.prototype.instantiate = function(entities, name) {
	  var id = entities.create();
	  var prefab = this.prefabs[name];
	  Object.keys(prefab).forEach(function(key) {
	    if (key === "id") {
	      return;
	    }
	    setOrAddComponent(entities, id, key, clone(prefab[key]));
	  });
	  return id;
	};
	Prefabs.prototype.register = function(name, components) {
	  this.prefabs[name] = components;
	};
	Prefabs.prototype.registerMultiple = function(prefabs) {
	  Object.keys(prefabs).forEach(function(key) {
	    this.registerPrefab(key, prefabs[key]);
	  }.bind(this));
	};
	
	module.exports = Prefabs;


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function clone(obj) {
	  if (obj === undefined) {
	    return undefined;
	  }
	  return JSON.parse(JSON.stringify(obj));
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function setOrAddComponent(entities, entity, component, value) {
	  if (typeof value !== "object") {
	    entities.setComponent(entity, component, value);
	  } else {
	    var data = entities.addComponent(entity, component);
	    Object.keys(value).forEach(function(valKey) {
	      data[valKey] = value[valKey];
	    });
	  }
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var clone = __webpack_require__(21);
	var components = __webpack_require__(24);
	var ECS = __webpack_require__(46).EntityComponentSystem;
	var EntityPool = __webpack_require__(46).EntityPool;
	var registerComponents = __webpack_require__(51);
	
	function Scene(name, globals) {
	  this.data = {};
	  this.entities = new EntityPool();
	  this.globals = globals;
	  this.name = name;
	  this.onEnter = function() {};
	  this.onExit = function() {};
	  this.renderer = new ECS();
	  this.state = "stopped";
	  this.speed = 1.0;
	  this.simulation = new ECS();
	  this.simulationStepTime = 5;
	
	  this.firstTime = true;
	  this.accumTime = 0;
	
	  var sceneData = globals.require("./data/scenes")[name];
	  if (typeof sceneData.onEnter === "string") {
	    this.onEnter = globals.require(sceneData.onEnter);
	  }
	  if (typeof sceneData.onExit === "string") {
	    this.onExit = globals.require(sceneData.onExit);
	  }
	}
	Scene.prototype.start = function(sceneArgs) {
	  if (this.state !== "stopped") {
	    return;
	  }
	  this.state = "starting";
	  this.tempArguments = sceneArgs;
	};
	Scene.prototype._initialize = function() {
	  this.entities = new EntityPool();
	  this.firstTime = true;
	  this.accumTime = 0;
	
	  this.data = {
	    animations: this.globals.animations,
	    arguments: this.tempArguments || {},
	    canvas: this.globals.canvas,
	    context: this.globals.context,
	    entities: this.entities,
	    images: this.globals.images,
	    inputs: this.globals.inputs,
	    prefabs: this.globals.prefabs,
	    require: this.globals.require,
	    scaleCanvasToCssSize: this.globals.scaleCanvasToCssSize,
	    scaleCanvasToFitRectangle: this.globals.scaleCanvasToFitRectangle,
	    scenes: this.globals.scenes,
	    sounds: this.globals.sounds,
	    switchScene: this.switchScene.bind(this)
	  };
	
	  this.simulation = new ECS();
	  this.renderer = new ECS();
	  this.simulation.add(function processInputUpdates() {
	    this.globals.inputs.processUpdates();
	  }.bind(this));
	
	  var systems = this.globals.require("./data/systems");
	  this.installSystems(systems.simulation, this.simulation, this.data);
	  this.installSystems(systems.renderer, this.renderer, this.data);
	
	  registerComponents(this.entities, components);
	  registerComponents(this.entities, this.globals.require("./data/components"));
	  var entities = this.globals.require("./data/entities");
	  this.entities.load(clone(entities[this.name]) || []);
	
	  this.onEnter(this.data);
	};
	Scene.prototype.stop = function() {
	  if (this.state === "stopped") {
	    return;
	  }
	  this.state = "stopped";
	  this.onExit(this.data);
	};
	Scene.prototype.switchScene = function(scene, sceneArgs) {
	  this.stop();
	  this.data.scenes[scene].start(sceneArgs);
	};
	Scene.prototype.installSystems = function(systems, ecs, data) {
	  for (var i = 0; i < systems.length; i++) {
	    var system = systems[i];
	
	    if (system.scenes.indexOf(this.name) === -1 && system.scenes !== "all") {
	      continue;
	    }
	    var script = this.globals.require(system.name);
	    if (script === undefined) {
	      console.error("failed to load script", system.name);
	    }
	    script(ecs, data);
	  }
	};
	Scene.prototype.simulate = function(elapsed) {
	  if (this.state === "stopped") {
	    return;
	  }
	  if (this.state === "starting") {
	    this._initialize();
	    this.state = "started";
	  }
	
	  if (this.firstTime) {
	    this.firstTime = false;
	    // run simulation the first time, because not enough time will have elapsed
	    this.simulation.run(this.entities, 0);
	  }
	
	  elapsed *= this.speed;
	
	  this.accumTime += elapsed;
	  while (this.accumTime >= this.simulationStepTime) {
	    this.accumTime -= this.simulationStepTime;
	    this.simulation.run(this.entities, this.simulationStepTime);
	  }
	};
	Scene.prototype.render = function(elapsed) {
	  if (this.state !== "started") {
	    return;
	  }
	  this.renderer.run(this.entities, elapsed);
	};
	
	module.exports = Scene;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The components used by {@link Systems} provided by Splat ECS.
	 * @namespace Components
	 */
	
	module.exports = {
	  acceleration: __webpack_require__(25),
	  animation: __webpack_require__(26),
	  collisions: __webpack_require__(27),
	  constrainPosition: __webpack_require__(28),
	  easing: __webpack_require__(29),
	  follow: __webpack_require__(30),
	  friction: __webpack_require__(31),
	  grid: __webpack_require__(32),
	  image: __webpack_require__(33),
	  lifeSpan: __webpack_require__(34),
	  match: __webpack_require__(35),
	  matchAspectRatio: __webpack_require__(36),
	  matchCenter: __webpack_require__(37),
	  movement2d: __webpack_require__(38),
	  playerController2d: __webpack_require__(39),
	  position: __webpack_require__(40),
	  rotation: __webpack_require__(41),
	  shake: __webpack_require__(42),
	  size: __webpack_require__(43),
	  timers: __webpack_require__(44),
	  velocity: __webpack_require__(45)
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      x: 0,
	      y: 0
	    };
	  },
	  reset: function(acceleration) {
	    acceleration.x = 0;
	    acceleration.y = 0;
	  }
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function animation() {
	    return {
	      time: 0,
	      frame: 0,
	      loop: true,
	      speed: 1
	    };
	  },
	  reset: function(animation) {
	    delete animation.name;
	    animation.time = 0;
	    animation.frame = 0;
	    animation.loop = true;
	    animation.speed = 1;
	  }
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return [];
	  },
	  reset: function(collisions) {
	    collisions.length = 0;
	  }
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	/**
	 * An entity to keep this entity inside of another
	 * @typedef {Object} constrainPosition
	 * @memberof Components
	 * @property {float} id - The id of a target entity to keep this entity inside of
	 */
	module.exports = {
	  factory: function() {
	    return {};
	  },
	  reset: function(constrainPosition) {
	    delete constrainPosition.id;
	  }
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {};
	  },
	  reset: function(easing) {
	    var names = Object.keys(easing);
	    for (var i = 0; i < names.length; i++) {
	      delete easing[name[i]];
	    }
	  }
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      distance: 0
	    };
	  },
	  reset: function(follow) {
	    delete follow.id;
	    follow.distance = 0;
	  }
	};


/***/ },
/* 31 */
/***/ function(module, exports) {

	/**
	 * The speed modifier of an entity in the game world. Each frame the speed is multiplied by the friction.
	 * @typedef {Object} friction
	 * @memberof Components
	 * @property {float} x - The amount to modify the velocity of this entity along the x-axis.
	 * @property {float} y - The amount to modify the velocity of this entity along the y-axis.
	 */
	module.exports = {
	  factory: function() {
	    return {
	      x: 1,
	      y: 1
	    };
	  },
	  reset: function(friction) {
	    friction.x = 1;
	    friction.y = 1;
	  }
	};


/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      x: 0,
	      y: 0,
	      z: 0
	    };
	  },
	  reset: function(grid) {
	    grid.x = 0;
	    grid.y = 0;
	    grid.z = 0;
	  }
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {};
	  },
	  reset: function(image) {
	    delete image.name;
	    delete image.alpha;
	    delete image.sourceX;
	    delete image.sourceY;
	    delete image.sourceWidth;
	    delete image.sourceHeight;
	    delete image.destinationX;
	    delete image.destinationY;
	    delete image.destinationWidth;
	    delete image.destinationHeight;
	  }
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      current: 0,
	      max: 1000
	    };
	  },
	  reset: function(lifeSpan) {
	    lifeSpan.current = 0;
	    lifeSpan.max = 1000;
	  }
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      matchX: 0,
	      matchY: 0,
	      matchZ: 0
	    };
	  },
	  reset: function(match) {
	    delete match.id;
	    match.matchX = 0;
	    match.matchY = 0;
	    match.matchZ = 0;
	  }
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {};
	  },
	  reset: function(matchAspectRatio) {
	    delete matchAspectRatio.id;
	  }
	};


/***/ },
/* 37 */
/***/ function(module, exports) {

	/** Align the center of this entity with the center of another entity.
	 * @typedef {object} matchCenter
	 * @memberof Components
	 * @property {int} id - The id of the entity to align to on both the x and y axes.
	 * @property {int} x - The id of the entity to align to on the x axis.
	 * @property {int} y - The id of the entity to align to on the y axis.
	 */
	
	module.exports = {
	  factory: function() {
	    return {};
	  },
	  reset: function(matchCenter) {
	    delete matchCenter.id;
	    delete matchCenter.x;
	    delete matchCenter.y;
	  }
	};


/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      up: false,
	      down: false,
	      left: false,
	      right: false,
	      upAccel: -0.1,
	      downAccel: 0.1,
	      leftAccel: -0.1,
	      rightAccel: 0.1,
	      upMax: -1.0,
	      downMax: 1.0,
	      leftMax: -1.0,
	      rightMax: 1.0
	    };
	  },
	  reset: function(movement2d) {
	    movement2d.up = false;
	    movement2d.down = false;
	    movement2d.left = false;
	    movement2d.right = false;
	    movement2d.upAccel = -0.1;
	    movement2d.downAccel = 0.1;
	    movement2d.leftAccel = -0.1;
	    movement2d.rightAccel = 0.1;
	    movement2d.upMax = -1.0;
	    movement2d.downMax = 1.0;
	    movement2d.leftMax = -1.0;
	    movement2d.rightMax = 1.0;
	  }
	};


/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      up: "up",
	      down: "down",
	      left: "left",
	      right: "right"
	    };
	  },
	  reset: function(playerController2d) {
	    playerController2d.up = "up";
	    playerController2d.down = "down";
	    playerController2d.left = "left";
	    playerController2d.right = "right";
	  }
	};


/***/ },
/* 40 */
/***/ function(module, exports) {

	/**
	 * The coordinates of an entity in the game world.
	 * @typedef {Object} position
	 * @memberof Components
	 * @property {float} x - The position of this entity along the x-axis.
	 * @property {float} y - The position of this entity along the y-axis.
	 * @property {float} z - The position of this entity along the z-axis.
	 * Since Splat is 2D this is mainly for creating layers when drawing sprites similar to z-index in CSS.
	 */
	
	module.exports = {
	  factory: function() {
	    return {
	      x: 0,
	      y: 0,
	      z: 0
	    };
	  },
	  reset: function(position) {
	    position.x = 0;
	    position.y = 0;
	    position.z = 0;
	  }
	};


/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      angle: 0
	    };
	  },
	  reset: function(rotation) {
	    rotation.angle = 0;
	    delete rotation.x;
	    delete rotation.y;
	  }
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = {
	  factory: function() {
	    return {
	      duration: 0
	      // magnitude: 1,
	      // magnitudeX: 1,
	      // magnitudeY: 1
	    };
	  },
	  reset: function(shake) {
	    shake.duration = 0;
	    delete shake.magnitude;
	    delete shake.magnitudeX;
	    delete shake.magnitudeY;
	  }
	};


/***/ },
/* 43 */
/***/ function(module, exports) {

	/**
	 * The size of an entity in the game world.
	 * @typedef {Object} size
	 * @memberof Components
	 * @property {float} width - The width of this entity rightward from {@link Components.position} along the x-axis.
	 * @property {float} height - The height of this entity downward from {@link Components.position} along the y-axis.
	 */
	
	module.exports = {
	  factory: function() {
	    return {
	      width: 0,
	      height: 0
	    };
	  },
	  reset: function(size) {
	    size.width = 0;
	    size.height = 0;
	  }
	};


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * A named group of timers. Each key is the name of a timer, and the value is a {@link Components.timer}.
	 * @typedef {Object} timers
	 * @memberof Components
	 */
	/**
	 * Measure time or run code after a duration.
	 * @typedef {Object} timer
	 * @memberof Components
	 * @property {bool} loop - <code>true</code> if the timer should repeat after it reaches <code>max</code>.
	 * @property {float} max - The maximum amount of time to accumulate. If <code>time</code> reaches <code>max</code>, then <code>time</code> will be set to <code>0</code> and <code>running</code> will be set to <code>false</code>.
	 * @property {bool} running - Determines if the timer is accumulating time.
	 * @property {string} script - The <code>require</code> path to a script to run when the timer is reset. The path is relative to your game's <code>src</code> folder. For example <code>./scripts/next-scene</code> might execute the code in <code>/src/scripts/next-scene.js</code>.
	 * @property {float} time - The amount of time, in milliseconds, the timer has accumulated.
	 */
	
	module.exports = {
	  factory: function() {
	    return {};
	  },
	  reset: function(timers) {
	    var names = Object.keys(timers);
	    for (var i = 0; i < names.length; i++) {
	      delete timers[name[i]];
	    }
	  }
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * The speed of an entity in the game world in pixels-per-millisecond.
	 * @typedef {Object} velocity
	 * @memberof Components
	 * @property {float} x - The velocity of this entity along the x-axis.
	 * @property {float} y - The velocity of this entity along the y-axis.
	 */
	
	module.exports = {
	  factory: function() {
	    return {
	      x: 0,
	      y: 0
	    };
	  },
	  reset: function(velocity) {
	    velocity.x = 0;
	    velocity.y = 0;
	  }
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  EntityComponentSystem: __webpack_require__(47),
	  EntityPool: __webpack_require__(49)
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var present = __webpack_require__(48);
	
	function EntityComponentSystem() {
	  this.systems = [];
	  this.systemNames = [];
	  this.systemTimes = [];
	  this.runCount = 0;
	}
	EntityComponentSystem.prototype.add = function(code) {
	  this.systems.push(code);
	  this.systemNames.push(code.name);
	  this.systemTimes.push(0);
	};
	EntityComponentSystem.prototype.addEach = function(code, search) {
	  this.systems.push(function(entities, elapsed) {
	    var keys = entities.find(search);
	    for (var i = 0; i < keys.length; i++) {
	      code(keys[i], elapsed);
	    }
	  });
	  this.systemNames.push(code.name);
	  this.systemTimes.push(0);
	};
	EntityComponentSystem.prototype.run = function(entities, elapsed) {
	  for (var i = 0; i < this.systems.length; i++) {
	    var start = present();
	    this.systems[i](entities, elapsed);
	    var end = present();
	    this.systemTimes[i] += end - start;
	  }
	  this.runCount++;
	};
	EntityComponentSystem.prototype.runs = function() {
	  return this.runCount;
	};
	EntityComponentSystem.prototype.timings = function() {
	  return this.systemNames.map(function(name, i) {
	    return {
	      name: name,
	      time: this.systemTimes[i]
	    };
	  }.bind(this));
	};
	EntityComponentSystem.prototype.resetTimings = function() {
	  this.systemTimes = this.systemTimes.map(function() {
	    return 0;
	  });
	};
	
	module.exports = EntityComponentSystem;


/***/ },
/* 48 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {var performance = global.performance || {};
	
	var present = (function () {
	  var names = ['now', 'webkitNow', 'msNow', 'mozNow', 'oNow'];
	  while (names.length) {
	    var name = names.shift();
	    if (name in performance) {
	      return performance[name].bind(performance);
	    }
	  }
	
	  var dateNow = Date.now || function () { return new Date().getTime(); };
	  var navigationStart = (performance.timing || {}).navigationStart || dateNow();
	  return function () {
	    return dateNow() - navigationStart;
	  };
	}());
	
	present.performanceNow = performance.now;
	present.noConflict = function () {
	  performance.now = present.performanceNow;
	};
	present.conflict = function () {
	  performance.now = present;
	};
	present.conflict();
	
	module.exports = present;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var ObjectPool = __webpack_require__(50);
	
	function EntityPool() {
	  this.entities = {};
	  this.nextId = 0;
	  this.entityPool = new ObjectPool(function() {
	    return { id: this.nextId++ };
	  }.bind(this));
	  this.componentPools = {};
	  this.resetFunctions = {};
	  this.searchToComponents = {};
	  this.componentToSearches = {};
	  this.searchResults = {};
	  this.callbacks = {};
	}
	EntityPool.prototype.create = function() {
	  var entity = this.entityPool.alloc();
	  this.entities[entity.id] = entity;
	  return entity.id;
	};
	EntityPool.prototype.destroy = function(id) {
	  var entity = this.entities[id];
	  Object.keys(entity).forEach(function(component) {
	    if (component === "id") {
	      return;
	    }
	    this.removeComponent(id, component);
	  }.bind(this));
	  delete this.entities[id];
	  this.entityPool.free(entity);
	};
	EntityPool.prototype.registerComponent = function(component, factory, reset, size) {
	  this.componentPools[component] = new ObjectPool(factory, size);
	  this.resetFunctions[component] = reset;
	};
	// private
	EntityPool.prototype.resetComponent = function(id, component) {
	  var reset = this.resetFunctions[component];
	  if (typeof reset === "function") {
	    reset(this.entities[id][component]);
	  }
	};
	EntityPool.prototype.getComponent = function(id, component) {
	  return this.entities[id][component];
	};
	EntityPool.prototype.removeComponent = function(id, component) {
	  var oldValue = this.entities[id][component];
	  if (oldValue === undefined) {
	    return;
	  }
	
	  if (!isPrimitive(oldValue)) {
	    this.resetComponent(id, component);
	    this.componentPools[component].free(oldValue);
	  }
	  delete this.entities[id][component];
	
	  for (var i = 0; i < this.componentToSearches[component].length; i++) {
	    var search = this.componentToSearches[component][i];
	    removeFromArray(this.searchResults[search], id);
	  }
	  this.fireCallback("remove", id, component, oldValue);
	};
	EntityPool.prototype.addComponent = function(id, component) {
	  if (!this.componentPools[component]) {
	    throw new Error(
	      "You can't call EntityPool.prototype.addComponent(" + id + ", \"" + component + "\") " +
	      "for a component name that hasn't been registered with " +
	      "EntityPool.prototype.registerComponent(component, factory[, reset][, size])."
	    );
	  }
	
	  var predefinedValue = this.entities[id][component];
	  if (predefinedValue && !isPrimitive(predefinedValue)) {
	    this.resetComponent(id, component);
	    return predefinedValue;
	  }
	
	  var value = this.componentPools[component].alloc();
	  this.setComponentValue(id, component, value);
	
	  return value;
	};
	EntityPool.prototype.setComponent = function(id, component, value) {
	  if (!isPrimitive(value)) {
	    throw new TypeError(
	      "You can't call EntityPool.prototype.setComponent(" + id + ", \"" + component + "\", " + JSON.stringify(value) + ") with " +
	      "a value that isn't of a primitive type (i.e. null, undefined, boolean, " +
	      "number, string, or symbol). For objects or arrays, use " +
	      "EntityPool.prototype.addComponent(id, component) and modify " +
	      "the result it returns."
	    );
	  }
	
	  if (!isPrimitive(this.entities[id][component])) {
	    throw new Error(
	      "You can't set a non-primitive type component \"" + component + "\" to a primitive value. " +
	      "If you must do this, remove the existing component first with " +
	      "EntityPool.prototype.removeComponent(id, component)."
	    );
	  }
	
	  if (typeof value === "undefined") {
	    this.removeComponent(id, component);
	  } else {
	    this.setComponentValue(id, component, value);
	  }
	};
	// private
	EntityPool.prototype.setComponentValue = function(id, component, value) {
	  var existingValue = this.entities[id][component];
	  if (typeof existingValue !== "undefined" && existingValue === value) {
	    return;
	  }
	
	  this.entities[id][component] = value;
	  if (typeof existingValue === "undefined") {
	    if (this.searchToComponents[component] === undefined) {
	      this.mapSearch(component, [component]);
	    }
	    for (var i = 0; i < this.componentToSearches[component].length; i++) {
	      var search = this.componentToSearches[component][i];
	      if (objectHasProperties(this.searchToComponents[search], this.entities[id])) {
	        this.searchResults[search].push(id);
	      }
	    }
	    this.fireCallback("add", id, component, value);
	  }
	};
	// private
	EntityPool.prototype.addCallback = function(type, component, callback) {
	  this.callbacks[type] = this.callbacks[type] || {};
	  this.callbacks[type][component] = this.callbacks[type][component] || [];
	  this.callbacks[type][component].push(callback);
	};
	// private
	EntityPool.prototype.fireCallback = function(type, id, component) {
	  if (this.callbackQueue) {
	    this.callbackQueue.push(Array.prototype.slice.call(arguments, 0));
	    return;
	  }
	  var cbs = this.callbacks[type] || {};
	  var ccbs = cbs[component] || [];
	  var args = Array.prototype.slice.call(arguments, 3);
	  for (var i = 0; i < ccbs.length; i++) {
	    ccbs[i].apply(this, [id, component].concat(args));
	  }
	};
	// private
	EntityPool.prototype.fireQueuedCallbacks = function() {
	  var queue = this.callbackQueue || [];
	  delete this.callbackQueue;
	  for (var i = 0; i < queue.length; i++) {
	    this.fireCallback.apply(this, queue[i]);
	  }
	};
	
	EntityPool.prototype.onAddComponent = function(component, callback) {
	  this.addCallback("add", component, callback);
	};
	EntityPool.prototype.onRemoveComponent = function(component, callback) {
	  this.addCallback("remove", component, callback);
	};
	EntityPool.prototype.find = function(search) {
	  return this.searchResults[search] || [];
	};
	// private
	EntityPool.prototype.mapSearch = function(search, components) {
	  if (this.searchToComponents[search] !== undefined) {
	    throw "the search \"" + search + "\" was already registered";
	  }
	
	  this.searchToComponents[search] = components.slice(0);
	
	  for (var i = 0; i < components.length; i++) {
	    var c = components[i];
	    if (this.componentToSearches[c] === undefined) {
	      this.componentToSearches[c] = [search];
	    } else {
	      this.componentToSearches[c].push(search);
	    }
	  }
	
	  this.searchResults[search] = [];
	};
	EntityPool.prototype.registerSearch = function(search, components) {
	  this.mapSearch(search, components);
	  this.searchResults[search] = objectValues(this.entities)
	    .filter(objectHasProperties.bind(undefined, components))
	    .map(entityId);
	};
	
	EntityPool.prototype.load = function(entities) {
	  this.callbackQueue = [];
	  entities.forEach(function(entity) {
	    var id = entity.id;
	    var allocatedEntity = this.entityPool.alloc();
	    allocatedEntity.id = id;
	    this.entities[id] = allocatedEntity;
	    if (this.nextId <= id) {
	      this.nextId = id + 1;
	    }
	    Object.keys(entity).forEach(function(component) {
	      if (component === "id") {
	        return;
	      }
	      var valueToLoad = entity[component];
	      if (isPrimitive(valueToLoad)) {
	        this.setComponent(id, component, valueToLoad);
	        return;
	      }
	      var newComponentObject = this.addComponent(id, component);
	      Object.keys(valueToLoad).forEach(function(key) {
	        newComponentObject[key] = valueToLoad[key];
	      });
	    }.bind(this));
	  }.bind(this));
	  this.fireQueuedCallbacks();
	};
	
	EntityPool.prototype.save = function() {
	  return objectValues(this.entities);
	};
	
	function removeFromArray(array, item) {
	  var i = array.indexOf(item);
	  if (i !== -1) {
	    array.splice(i, 1);
	  }
	  return array;
	}
	
	function entityId(entity) {
	  return entity.id;
	}
	function objectHasProperties(properties, obj) {
	  return properties.every(Object.prototype.hasOwnProperty.bind(obj));
	}
	
	function objectValues(obj) {
	  return Object.keys(obj).map(function(key) {
	    return obj[key];
	  });
	}
	
	/* returns true if the value is a primitive
	 * type a.k.a. null, undefined, boolean,
	 * number, string, or symbol.
	 */
	function isPrimitive(value) {
	  return typeof value !== "object" || value === null;
	}
	
	module.exports = EntityPool;


/***/ },
/* 50 */
/***/ function(module, exports) {

	function ObjectPool(factory, size) {
	  if (typeof factory !== "function") {
	    throw new TypeError("ObjectPool expects a factory function, got ", factory);
	  }
	  if (size && size < 1 || size === 0) {
	    throw new RangeError("ObjectPool expects an initial size greater than zero");
	  }
	  this.factory = factory;
	  this.size = size || 1;
	  this.dead = [];
	
	  for (var i = 0; i < size; i++) {
	    this.dead.push(factory());
	  }
	}
	ObjectPool.prototype.alloc = function() {
	  var factory = this.factory;
	  var obj;
	  if (this.dead.length > 0) {
	    obj = this.dead.pop();
	  } else {
	    obj = factory();
	    /* we assume the number "alive" (not stored here)
	     * must be equal to this.size, so by creating
	     * that many more objects, (including obj above),
	     * we double the size of the pool.
	     */
	    for (var i = 0; i < this.size - 1; i++) {
	      this.dead.push(factory());
	    }
	    this.size *= 2;
	  }
	  return obj;
	};
	ObjectPool.prototype.free = function(obj) {
	  this.dead.push(obj);
	};
	
	module.exports = ObjectPool;


/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = function registerAll(entities, componentSpecs) {
	  var names = Object.keys(componentSpecs);
	  for (var i = 0; i < names.length; i++) {
	    var name = names[i];
	    var componentSpec = componentSpecs[name];
	    entities.registerComponent(name, componentSpec.factory, componentSpec.reset, componentSpec.poolSize);
	  }
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var AssetLoader = __webpack_require__(9);
	var loadSound = __webpack_require__(53);
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	/**
	 * Plays audio, tracks looping sounds, and manages volume.
	 * This implementation uses the Web Audio API.
	 * @constructor
	 * @param {Object} manifest A hash where the key is the name of a sound, and the value is the URL of a sound file.
	 */
	function SoundManager(manifest) {
	  /**
	   * A flag signifying if sounds have been muted through {@link SoundManager#mute}.
	   * @member {boolean}
	   * @private
	   */
	  this.muted = false;
	  /**
	   * A key-value object that stores named looping sounds.
	   * @member {object}
	   * @private
	   */
	  this.looping = {};
	
	  /**
	   * The Web Audio API AudioContext
	   * @member {external:AudioContext}
	   * @private
	   */
	  this.context = new window.AudioContext();
	
	  this.gainNode = this.context.createGain();
	  this.gainNode.connect(this.context.destination);
	  this.volume = this.gainNode.gain.value;
	  this.installSafariWorkaround();
	  this.assets = new AssetLoader(manifest, loadSound.bind(undefined, this.context));
	}
	SoundManager.prototype.installSafariWorkaround = function() {
	  // safari on iOS mutes sounds until they're played in response to user input
	  // play a dummy sound on first touch
	  var firstTouchHandler = function() {
	    window.removeEventListener("click", firstTouchHandler);
	    window.removeEventListener("keydown", firstTouchHandler);
	    window.removeEventListener("touchstart", firstTouchHandler);
	
	    var source = this.context.createOscillator();
	    source.connect(this.gainNode);
	    source.start(0);
	    source.stop(0);
	
	    if (this.firstPlay) {
	      this.play(this.firstPlay, this.firstPlayLoop);
	    } else {
	      this.firstPlay = "workaround";
	    }
	  }.bind(this);
	  window.addEventListener("click", firstTouchHandler);
	  window.addEventListener("keydown", firstTouchHandler);
	  window.addEventListener("touchstart", firstTouchHandler);
	};
	/**
	 * Play a sound.
	 * @param {string} name The name of the sound to play.
	 * @param {Object} [loop=undefined] A hash containing loopStart and loopEnd options. To stop a looped sound use {@link SoundManager#stop}.
	 */
	SoundManager.prototype.play = function(name, loop) {
	  if (loop && this.looping[name]) {
	    return;
	  }
	  if (!this.firstPlay) {
	    // let the iOS user input workaround handle it
	    this.firstPlay = name;
	    this.firstPlayLoop = loop;
	    return;
	  }
	  var snd = this.assets.get(name);
	  if (snd === undefined) {
	    console.error("Unknown sound: " + name);
	  }
	  var source = this.context.createBufferSource();
	  source.buffer = snd;
	  source.connect(this.gainNode);
	  if (loop) {
	    source.loop = true;
	    source.loopStart = loop.loopStart || 0;
	    source.loopEnd = loop.loopEnd || 0;
	    this.looping[name] = source;
	  }
	  source.start(0);
	};
	/**
	 * Stop playing a sound. This currently only stops playing a sound that was looped earlier, and doesn't stop a sound mid-play. Patches welcome.
	 * @param {string} name The name of the sound to stop looping.
	 */
	SoundManager.prototype.stop = function(name) {
	  if (!this.looping[name]) {
	    return;
	  }
	  this.looping[name].stop(0);
	  delete this.looping[name];
	};
	/**
	 * Silence all sounds. Sounds keep playing, but at zero volume. Call {@link SoundManager#unmute} to restore the previous volume level.
	 */
	SoundManager.prototype.mute = function() {
	  this.gainNode.gain.value = 0;
	  this.muted = true;
	};
	/**
	 * Restore volume to whatever value it was before {@link SoundManager#mute} was called.
	 */
	SoundManager.prototype.unmute = function() {
	  this.gainNode.gain.value = this.volume;
	  this.muted = false;
	};
	/**
	 * Set the volume of all sounds.
	 * @param {number} gain The desired volume level. A number between 0.0 and 1.0, with 0.0 being silent, and 1.0 being maximum volume.
	 */
	SoundManager.prototype.setVolume = function(gain) {
	  this.volume = gain;
	  this.gainNode.gain.value = gain;
	  this.muted = false;
	};
	/**
	 * Test if the volume is currently muted.
	 * @return {boolean} True if the volume is currently muted.
	 */
	SoundManager.prototype.isMuted = function() {
	  return this.muted;
	};
	
	
	function FakeSoundManager() {}
	FakeSoundManager.prototype.play = function() {};
	FakeSoundManager.prototype.stop = function() {};
	FakeSoundManager.prototype.mute = function() {};
	FakeSoundManager.prototype.unmute = function() {};
	FakeSoundManager.prototype.setVolume = function() {};
	FakeSoundManager.prototype.isMuted = function() {
	  return true;
	};
	
	if (window.AudioContext) {
	  module.exports = SoundManager;
	} else {
	  console.warn("This browser doesn't support the Web Audio API.");
	  module.exports = FakeSoundManager;
	}


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var loadAsset = __webpack_require__(13);
	
	module.exports = function(audioContext, url, callback) {
	  return loadAsset(url, "arraybuffer", function(err, asset) {
	    if (err) {
	      callback(err);
	      return;
	    }
	    // FIXME: this may not work with a Blob(), might have to convert to array buffer http://stackoverflow.com/a/15981017
	    audioContext.decodeAudioData(asset.data, function(buffer) {
	      asset.data = buffer;
	      callback(undefined, asset);
	    }, callback);
	  });
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var clone = __webpack_require__(21);
	
	module.exports = function splitFilmStripAnimations(animations) {
	  Object.keys(animations).forEach(function(key) {
	    var firstFrame = animations[key][0];
	    if (firstFrame.filmstripFrames) {
	      splitFilmStripAnimation(animations, key);
	    }
	  });
	};
	
	function splitFilmStripAnimation(animations, key) {
	  var firstFrame = animations[key][0];
	  if (firstFrame.properties.image.sourceWidth % firstFrame.filmstripFrames != 0) {
	    console.warn("The \"" + key + "\" animation is " + firstFrame.properties.image.sourceWidth + " pixels wide and that is is not evenly divisible by " + firstFrame.filmstripFrames + " frames.");
	  }
	  for (var i = 0; i < firstFrame.filmstripFrames; i++) {
	    var frameWidth = firstFrame.properties.image.sourceWidth / firstFrame.filmstripFrames;
	    var newFrame = clone(firstFrame);
	    newFrame.properties.image.sourceX = frameWidth * i;
	    newFrame.properties.image.sourceWidth = frameWidth;
	    animations[key].push(newFrame);
	  }
	  animations[key].splice(0,1);
	}


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var platform = __webpack_require__(4);
	
	if (platform.isEjecta()) {
	  var iap = new window.Ejecta.IAPManager();
	
	  module.exports = {
	    "get": function(sku, callback) {
	      iap.getProducts([sku], function(err, products) {
	        if (err) {
	          callback(err);
	          return;
	        }
	        callback(undefined, products[0]);
	      });
	    },
	    "buy": function(product, quantity, callback) {
	      product.purchase(quantity, callback);
	    },
	    "restore": function(callback) {
	      iap.restoreTransactions(function(err, transactions) {
	        if (err) {
	          callback(err);
	          return;
	        }
	        callback(undefined, transactions.map(function(transaction) {
	          return transaction.productId;
	        }));
	      });
	    }
	  };
	} else if (platform.isChromeApp()) {
	  // FIXME: needs google's buy.js included
	  // https://developer.chrome.com/webstore/payments-iap
	  module.exports = {
	    "get": function(sku, callback) {
	      window.google.payments.inapp.getSkuDetails({
	        "parameters": {
	          "env": "prod"
	        },
	        "sku": sku,
	        "success": function(response) {
	          callback(undefined, response.response.details.inAppProducts[0]);
	        },
	        "failure": function(response) {
	          callback(response);
	        }
	      });
	    },
	    "buy": function(product, quantity, callback) {
	      window.google.payments.inapp.buy({
	        "parameters": {
	          "env": "prod"
	        },
	        "sku": product.sku,
	        "success": function(response) {
	          callback(undefined, response);
	        },
	        "failure": function(response) {
	          callback(response);
	        }
	      });
	    },
	    "restore": function(callback) {
	      window.google.payments.inapp.getPurchases({
	        "success": function(response) {
	          callback(undefined, response.response.details.map(function(detail) {
	            return detail.sku;
	          }));
	        },
	        "failure": function(response) {
	          callback(response);
	        }
	      });
	    }
	  };
	} else {
	  module.exports = {
	    "get": function(sku, callback) {
	      callback(undefined, undefined);
	    },
	    "buy": function(product, quantity, callback) {
	      callback(undefined);
	    },
	    "restore": function(callback) {
	      callback(undefined, []);
	    }
	  };
	}


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @namespace Splat.leaderboards
	 */
	
	var platform = __webpack_require__(4);
	
	if (platform.isEjecta()) {
	  var gameCenter = new window.Ejecta.GameCenter();
	  gameCenter.softAuthenticate();
	
	  var authFirst = function(action) {
	    if (gameCenter.authed) {
	      action();
	    } else {
	      gameCenter.authenticate(function(err) {
	        if (err) {
	          return;
	        }
	        action();
	      });
	    }
	  };
	
	  module.exports = {
	    /**
	     * Report that an achievement was achieved.
	     * @alias Splat.leaderboards.reportAchievement
	     * @param {string} id The name of the achievement.
	     * @param {int} percent The percentage of the achievement that is completed in the range of 0-100.
	     */
	    "reportAchievement": function(id, percent) {
	      authFirst(function() {
	        gameCenter.reportAchievement(id, percent);
	      });
	    },
	    /**
	     * Report that a score was achieved on a leaderboard.
	     * @alias Splat.leaderboards.reportScore
	     * @param {string} leaderboard The name of the leaderboard the score is on.
	     * @param {int} score The score that was achieved.
	     */
	    "reportScore": function(leaderboard, score) {
	      authFirst(function() {
	        gameCenter.reportScore(leaderboard, score);
	      });
	    },
	    /**
	     * Show the achievements screen.
	     * @alias Splat.leaderboards.showAchievements
	     */
	    "showAchievements": function() {
	      authFirst(function() {
	        gameCenter.showAchievements();
	      });
	    },
	    /**
	     * Show a leaderboard screen.
	     * @alias Splat.leaderboards.showLeaderboard
	     * @param {string} name The name of the leaderboard to show.
	     */
	    "showLeaderboard": function(name) {
	      authFirst(function() {
	        gameCenter.showLeaderboard(name);
	      });
	    }
	  };
	} else {
	  module.exports = {
	    "reportAchievement": function() {},
	    "reportScore": function() {},
	    "showAchievements": function() {},
	    "showLeaderboard": function() {}
	  };
	}
	


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Oscillate between -1 and 1 given a value and a period. This is basically a simplification on using Math.sin().
	 * @alias Splat.math.oscillate
	 * @param {number} current The current value of the number you want to oscillate.
	 * @param {number} period The period, or how often the number oscillates. The return value will oscillate between -1 and 1, depending on how close current is to a multiple of period.
	 * @returns {number} A number between -1 and 1.
	 * @example
	Splat.math.oscillate(0, 100); // returns 0
	Splat.math.oscillate(100, 100); // returns 0-ish
	Splat.math.oscillate(50, 100); // returns 1
	Splat.math.oscillate(150, 100); // returns -1
	Splat.math.oscillate(200, 100); // returns 0-ish
	 */
	function oscillate(current, period) {
	  return Math.sin(current / period * Math.PI);
	}
	
	/**
	 * @namespace Splat.math
	 */
	module.exports = {
	  oscillate: oscillate,
	  /**
	   * A seedable pseudo-random number generator. Currently a Mersenne Twister PRNG.
	   * @constructor
	   * @alias Splat.math.Random
	   * @param {number} [seed] The seed for the PRNG.
	   * @see [mersenne-twister package at github]{@link https://github.com/boo1ean/mersenne-twister}
	   * @example
	var rand = new Splat.math.Random(123);
	var val = rand.random();
	   */
	  Random: __webpack_require__(58)
	};


/***/ },
/* 58 */
/***/ function(module, exports) {

	/*
	  https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
	  so it's better encapsulated. Now you can have multiple random number generators
	  and they won't stomp all over eachother's state.
	
	  If you want to use this as a substitute for Math.random(), use the random()
	  method like so:
	
	  var m = new MersenneTwister();
	  var randomNumber = m.random();
	
	  You can also call the other genrand_{foo}() methods on the instance.
	
	  If you want to use a specific seed in order to get a repeatable random
	  sequence, pass an integer into the constructor:
	
	  var m = new MersenneTwister(123);
	
	  and that will always produce the same random sequence.
	
	  Sean McCullough (banksean@gmail.com)
	*/
	
	/*
	   A C-program for MT19937, with initialization improved 2002/1/26.
	   Coded by Takuji Nishimura and Makoto Matsumoto.
	
	   Before using, initialize the state by using init_seed(seed)
	   or init_by_array(init_key, key_length).
	
	   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
	   All rights reserved.
	
	   Redistribution and use in source and binary forms, with or without
	   modification, are permitted provided that the following conditions
	   are met:
	
	     1. Redistributions of source code must retain the above copyright
	        notice, this list of conditions and the following disclaimer.
	
	     2. Redistributions in binary form must reproduce the above copyright
	        notice, this list of conditions and the following disclaimer in the
	        documentation and/or other materials provided with the distribution.
	
	     3. The names of its contributors may not be used to endorse or promote
	        products derived from this software without specific prior written
	        permission.
	
	   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	
	
	   Any feedback is very welcome.
	   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
	   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
	*/
	
	var MersenneTwister = function(seed) {
		if (seed == undefined) {
			seed = new Date().getTime();
		}
	
		/* Period parameters */
		this.N = 624;
		this.M = 397;
		this.MATRIX_A = 0x9908b0df;   /* constant vector a */
		this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
		this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
	
		this.mt = new Array(this.N); /* the array for the state vector */
		this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */
	
		if (seed.constructor == Array) {
			this.init_by_array(seed, seed.length);
		}
		else {
			this.init_seed(seed);
		}
	}
	
	/* initializes mt[N] with a seed */
	/* origin name init_genrand */
	MersenneTwister.prototype.init_seed = function(s) {
		this.mt[0] = s >>> 0;
		for (this.mti=1; this.mti<this.N; this.mti++) {
			var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
			this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
			+ this.mti;
			/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
			/* In the previous versions, MSBs of the seed affect   */
			/* only MSBs of the array mt[].                        */
			/* 2002/01/09 modified by Makoto Matsumoto             */
			this.mt[this.mti] >>>= 0;
			/* for >32 bit machines */
		}
	}
	
	/* initialize by an array with array-length */
	/* init_key is the array for initializing keys */
	/* key_length is its length */
	/* slight change for C++, 2004/2/26 */
	MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
		var i, j, k;
		this.init_seed(19650218);
		i=1; j=0;
		k = (this.N>key_length ? this.N : key_length);
		for (; k; k--) {
			var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
			+ init_key[j] + j; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++; j++;
			if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
			if (j>=key_length) j=0;
		}
		for (k=this.N-1; k; k--) {
			var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
			- i; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++;
			if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		}
	
		this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
	}
	
	/* generates a random number on [0,0xffffffff]-interval */
	/* origin name genrand_int32 */
	MersenneTwister.prototype.random_int = function() {
		var y;
		var mag01 = new Array(0x0, this.MATRIX_A);
		/* mag01[x] = x * MATRIX_A  for x=0,1 */
	
		if (this.mti >= this.N) { /* generate N words at one time */
			var kk;
	
			if (this.mti == this.N+1)  /* if init_seed() has not been called, */
				this.init_seed(5489);  /* a default initial seed is used */
	
			for (kk=0;kk<this.N-this.M;kk++) {
				y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
				this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for (;kk<this.N-1;kk++) {
				y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
				this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
			this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];
	
			this.mti = 0;
		}
	
		y = this.mt[this.mti++];
	
		/* Tempering */
		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);
	
		return y >>> 0;
	}
	
	/* generates a random number on [0,0x7fffffff]-interval */
	/* origin name genrand_int31 */
	MersenneTwister.prototype.random_int31 = function() {
		return (this.random_int()>>>1);
	}
	
	/* generates a random number on [0,1]-real-interval */
	/* origin name genrand_real1 */
	MersenneTwister.prototype.random_incl = function() {
		return this.random_int()*(1.0/4294967295.0);
		/* divided by 2^32-1 */
	}
	
	/* generates a random number on [0,1)-real-interval */
	MersenneTwister.prototype.random = function() {
		return this.random_int()*(1.0/4294967296.0);
		/* divided by 2^32 */
	}
	
	/* generates a random number on (0,1)-real-interval */
	/* origin name genrand_real3 */
	MersenneTwister.prototype.random_excl = function() {
		return (this.random_int() + 0.5)*(1.0/4294967296.0);
		/* divided by 2^32 */
	}
	
	/* generates a random number on [0,1) with 53-bit resolution*/
	/* origin name genrand_res53 */
	MersenneTwister.prototype.random_long = function() {
		var a=this.random_int()>>>5, b=this.random_int()>>>6;
		return(a*67108864.0+b)*(1.0/9007199254740992.0);
	}
	
	/* These real versions are due to Isaku Wada, 2002/01/09 added */
	
	module.exports = MersenneTwister;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var platform = __webpack_require__(4);
	
	/**
	 * Open a url in a new window.
	 * @alias Splat.openUrl
	 * @param {string} url The url to open in a new window.
	 */
	module.exports = function(url) {
	  window.open(url);
	};
	
	if (platform.isEjecta()) {
	  module.exports = function(url) {
	    window.ejecta.openURL(url);
	  };
	}


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var buffer = __webpack_require__(3);
	
	function getContextForImage(image) {
	  var ctx;
	  buffer.makeBuffer(image.width, image.height, function(context) {
	    context.drawImage(image, 0, 0, image.width, image.height);
	    ctx = context;
	  });
	  return ctx;
	}
	
	/**
	 * A stretchable image that has borders.
	 * Similar to the [Android NinePatch]{@link https://developer.android.com/guide/topics/graphics/2d-graphics.html#nine-patch}, but it only has the lines on the bottom and right edges to denote the stretchable area.
	 * A NinePatch is a normal picture, but has an extra 1-pixel wide column on the right edge and bottom edge. The extra column contains a black line that denotes the tileable center portion of the image. The lines are used to divide the image into nine tiles that can be automatically repeated to stretch the picture to any size without distortion.
	 * @constructor
	 * @alias Splat.NinePatch
	 * @param {external:image} image The source image to make stretchable.
	 */
	function NinePatch(image) {
	  this.img = image;
	  var imgw = image.width - 1;
	  var imgh = image.height - 1;
	
	  var context = getContextForImage(image);
	  var firstDiv = imgw;
	  var secondDiv = imgw;
	  var pixel;
	  var alpha;
	  for (var x = 0; x < imgw; x++) {
	    pixel = context.getImageData(x, imgh, 1, 1).data;
	    alpha = pixel[3];
	    if (firstDiv === imgw && alpha > 0) {
	      firstDiv = x;
	    }
	    if (firstDiv < imgw && alpha === 0) {
	      secondDiv = x;
	      break;
	    }
	  }
	  this.w1 = firstDiv;
	  this.w2 = secondDiv - firstDiv;
	  this.w3 = imgw - secondDiv;
	
	  firstDiv = secondDiv = imgh;
	  for (var y = 0; y < imgh; y++) {
	    pixel = context.getImageData(imgw, y, 1, 1).data;
	    alpha = pixel[3];
	    if (firstDiv === imgh && alpha > 0) {
	      firstDiv = y;
	    }
	    if (firstDiv < imgh && alpha === 0) {
	      secondDiv = y;
	      break;
	    }
	  }
	  this.h1 = firstDiv;
	  this.h2 = secondDiv - firstDiv;
	  this.h3 = imgh - secondDiv;
	}
	/**
	 * Draw the image stretched to a given rectangle.
	 * @param {external:CanvasRenderingContext2D} context The drawing context.
	 * @param {number} x The left side of the rectangle.
	 * @param {number} y The top of the rectangle.
	 * @param {number} width The width of the rectangle.
	 * @param {number} height The height of the rectangle.
	 */
	NinePatch.prototype.draw = function(context, x, y, width, height) {
	  x = Math.floor(x);
	  y = Math.floor(y);
	  width = Math.floor(width);
	  height = Math.floor(height);
	  var cx, cy, w, h;
	
	  for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
	    for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
	      w = Math.min(this.w2, x + width - this.w3 - cx);
	      h = Math.min(this.h2, y + height - this.h3 - cy);
	      context.drawImage(this.img, this.w1, this.h1, w, h, cx, cy, w, h);
	    }
	  }
	  for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
	    h = Math.min(this.h2, y + height - this.h3 - cy);
	    if (this.w1 > 0) {
	      context.drawImage(this.img, 0,                 this.h1, this.w1, h, x,                   cy, this.w1, h);
	    }
	    if (this.w3 > 0) {
	      context.drawImage(this.img, this.w1 + this.w2, this.h1, this.w3, h, x + width - this.w3, cy, this.w3, h);
	    }
	  }
	  for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
	    w = Math.min(this.w2, x + width - this.w3 - cx);
	    if (this.h1 > 0) {
	      context.drawImage(this.img, this.w1, 0,                 w, this.h1, cx, y,                    w, this.h1);
	    }
	    if (this.h3 > 0) {
	      context.drawImage(this.img, this.w1, this.w1 + this.w2, w, this.h3, cx, y + height - this.h3, w, this.h3);
	    }
	  }
	  if (this.w1 > 0 && this.h1 > 0) {
	    context.drawImage(this.img, 0, 0, this.w1, this.h1, x, y, this.w1, this.h1);
	  }
	  if (this.w3 > 0 && this.h1 > 0) {
	    context.drawImage(this.img, this.w1 + this.w2, 0, this.w3, this.h1, x + width - this.w3, y, this.w3, this.h1);
	  }
	  if (this.w1 > 0 && this.h3 > 0) {
	    context.drawImage(this.img, 0, this.h1 + this.h2, this.w1, this.h3, x, y + height - this.h3, this.w1, this.h3);
	  }
	  if (this.w3 > 0 && this.h3 > 0) {
	    context.drawImage(this.img, this.w1 + this.w2, this.h1 + this.h2, this.w3, this.h3, x + width - this.w3, y + height - this.h3, this.w3, this.h3);
	  }
	};
	
	module.exports = NinePatch;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/** @module splat-ecs/lib/particles */
	
	var random = __webpack_require__(62);
	
	module.exports = {
	  /**
	  * Create between {@link module:splat-ecs/lib/particles.Config#qtyMin qtyMin} and {@link module:splat-ecs/lib/particles.Config#qtyMax qtyMax} particles, and randomize their properties according to <code>config</code>.
	  * @param {object} game The <code>game</code> object that you get in systems and scripts.
	  * @param {module:splat-ecs/lib/particles.Config} config The settings to use to create the particles.
	  */
	  "create": function(game, config) {
	    var particleCount = Math.floor(random.inRange(config.qtyMin, config.qtyMax));
	    for (var i = 0; i < particleCount; i++) {
	      var particle = game.prefabs.instantiate(game.entities, config.prefab);
	      // check if origin is an entity
	      var origin = config.origin;
	      if (typeof config.origin === "number") {
	        origin = choosePointInEntity(game, origin);
	      }
	
	      var randomSize = random.inRange(config.sizeMin, config.sizeMax);
	      scaleEntityRect(game, particle, randomSize);
	
	      centerEntityOnPoint(game, particle, origin);
	
	      var velocity = random.inRange(config.velocityMin, config.velocityMax);
	
	      var angle = pickAngle(config, i, particleCount);
	      var velocityComponent = game.entities.addComponent(particle, "velocity");
	      var direction = pointOnCircle(angle, velocity);
	      velocityComponent.x = direction.x;
	      velocityComponent.y = direction.y;
	
	      if (config.accelerationX || config.accelerationY) {
	        var accel = game.entities.addComponent(particle, "acceleration");
	        accel.x = config.accelerationX;
	        accel.y = config.accelerationY;
	      }
	      var lifeSpan = game.entities.addComponent(particle, "lifeSpan");
	      lifeSpan.max = random.inRange(config.lifeSpanMin, config.lifeSpanMax);
	    }
	  },
	
	  /**
	   * The settings for a type of particle.
	   * @constructor
	   * @param {string} prefab The name of a prefab to instantiate for the particle, as defined in <code>prefabs.json</code>.
	   */
	  "Config": function(prefab) {
	    /**
	     * The name of a prefab to instantiate for the particle, as defined in <code>prefabs.json</code>.
	     * @member {string}
	     */
	    this.prefab = prefab;
	    /**
	     * The origin point in which to create particles.
	     *
	     * If the origin is a number it represents an entity and a random point inside the entity will be used.
	     * If origin is a point like <code>{"x": 50, "y": 50}</code> particles will spawn at that position.
	     * @member {object | number}
	     */
	    this.origin = { "x": 0, "y": 0 };
	    /**
	     * How to distribute particles along the {@link module:splat-ecs/lib/particles.Config#arcWidth arcWidth}.
	     *
	     * Possible values:
	     * <dl>
	     * <dt><code>"even"</code></dt>
	     * <dd>Distribute the particles evenly along the arc.</dd>
	     * <dt><code>"random"</code></dt>
	     * <dd>Scatter the particles on random points of the arc.</dd>
	     * </dl>
	     * @member {string}
	     */
	    this.spreadType = "random";
	    /**
	     * The direction (an angle in radians) that the particles should move.
	     * @member {number}
	     */
	    this.angle = 0;
	    /**
	     * The width of an arc (represented by an angle in radians) to spread the particles. The arc is centered around {@link module:splat-ecs/lib/particles.Config#angle angle}.
	     * @member {number}
	     */
	    this.arcWidth = Math.PI / 2;
	    /**
	     * The minimum number of particles to create.
	     * @member {number}
	     */
	    this.qtyMin = 1;
	    /**
	     * The maximum number of particles to create.
	     * @member {number}
	     */
	    this.qtyMax = 1;
	    /**
	     * The minimum percentage to scale each particle.
	     * <ul>
	     * <li>A scale of 0.5 means the particle will spawn at 50% (half) of the original size.</li>
	     * <li>A scale of 1 means the particle will spawn at the original size.</li>
	     * <li>A scale of 2 means the particle will spawn at 200% (double) the original size.</li>
	     * </ul>
	     * @member {number}
	     */
	    this.sizeMin = 1;
	    /**
	     * The maximum percentage to scale each particle.
	     * <ul>
	     * <li>A scale of 0.5 means the particle will spawn at 50% (half) of the original size.</li>
	     * <li>A scale of 1 means the particle will spawn at the original size.</li>
	     * <li>A scale of 2 means the particle will spawn at 200% (double) the original size.</li>
	     * </ul>
	     * @member {number}
	     */
	    this.sizeMax = 1;
	    /**
	     * The minimum velocity to apply to each particle.
	     * @member {number}
	     */
	    this.velocityMin = 0.5;
	    /**
	     * The maximum velocity to apply to each particle.
	     * @member {number}
	     */
	    this.velocityMax = 0.5;
	    /**
	     * The acceleration on the x-axis to apply to each particle.
	     * @member {number}
	     */
	    this.accelerationX = 0;
	    /**
	     * The acceleration on the y-axis to apply to each particle.
	     * @member {number}
	     */
	    this.accelerationY = 0;
	    /**
	     * The minimum life span to apply to each particle.
	     * @member {number}
	     */
	    this.lifeSpanMin = 0;
	    /**
	     * The maximum life span to apply to each particle.
	     * @member {number}
	     */
	    this.lifeSpanMax = 500;
	  }
	};
	
	function pickAngle(config, particleNumber, particleCount) {
	  var startAngle = config.angle - (config.arcWidth / 2);
	  if (config.spreadType === "even") {
	    return (particleNumber * (config.arcWidth / (particleCount - 1))) + startAngle;
	  } else {
	    var endAngle = startAngle + config.arcWidth;
	    return random.inRange(startAngle, endAngle);
	  }
	}
	
	function scaleEntityRect(game, entity, scaleFactor) {
	  var size = game.entities.getComponent(entity, "size");
	  size.width = size.width * scaleFactor;
	  size.height = size.height * scaleFactor;
	}
	
	function pointOnCircle(angle, radius) {
	  return {
	    "x": (radius * Math.cos(angle)),
	    "y": (radius * Math.sin(angle))
	  };
	}
	
	/**
	 * Center an entity on a given point.
	 * @private
	 * @param {object} game Required for game.entities.get().
	 * @param {integer} entity The id of entity to center.
	 * @param {object} point A point object <code>{"x": 50, "y": 50}</code> on which to center the entity.
	 */
	function centerEntityOnPoint(game, entity, point) {
	  var size = game.entities.getComponent(entity, "size");
	  var position = game.entities.addComponent(entity, "position");
	  position.x = point.x - (size.width / 2);
	  position.y = point.y - (size.height / 2);
	}
	
	/**
	 * Choose a random point inside the bounding rectangle of an entity.
	 * @private
	 * @param {object} game Required for game.entities.get().
	 * @param {integer} entity The id of entity to pick a point within.
	 * @returns {object} an point object <code>{"x": 50, "y": 50}</code>.
	 */
	function choosePointInEntity(game, entity) {
	  var position = game.entities.getComponent(entity, "position");
	  var size = game.entities.getComponent(entity, "size");
	  if (size === undefined) {
	    return {
	      "x": position.x,
	      "y": position.y
	    };
	  }
	  return {
	    "x": random.inRange(position.x, (position.x + size.width)),
	    "y": random.inRange(position.y, (position.y + size.height))
	  };
	}


/***/ },
/* 62 */
/***/ function(module, exports) {

	/** @module splat-ecs/lib/random */
	
	module.exports = {
	  /**
	   * Get a pseudo-random number between the minimum (inclusive) and maximum (exclusive) parameters.
	   * @function inRange
	   * @param {number} min Inclusive minimum value for the random number
	   * @param {number} max Exclusive maximum value for the random number
	   * @returns {number} A number between <code>min</code> and <code>max</code>
	   * @see [Bracket Notation: Inclusion and Exclusion]{@link https://en.wikipedia.org/wiki/Bracket_%28mathematics%29#Intervals}
	   * @example
	var random = require("splat-ecs/lib/random");
	random.inRange(0, 1) // Returns 0.345822917402371
	random.inRange(10, 100) // Returns 42.4823819274931274
	   */
	  "inRange": function(min, max) {
	    return min + Math.random() * (max - min);
	  },
	
	  /**
	   * Get a random element in an array
	   * @function from
	   * @param {array} array Array of elements to choose from
	   * @returns {Object} A random element from the given array
	   * @example
	var random = require("splat-ecs/lib/random");
	var fruit = ["Apple", "Banana", "Orange", "Peach"];
	random.from(fruit); // Could return "Orange"
	random.from(fruit); // Could return "Apple"
	random.from(fruit); // Could return "Peach"
	random.from(fruit); // Could return "Banana"
	   */
	  "from": function(array) {
	    return array[Math.floor(Math.random() * array.length)];
	  }
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @namespace Splat.saveData
	 */
	
	var platform = __webpack_require__(4);
	
	function cookieGet(name) {
	  var value = "; " + document.cookie;
	  var parts = value.split("; " + name + "=");
	  if (parts.length === 2) {
	    return parts.pop().split(";").shift();
	  } else {
	    throw "cookie " + name + " was not found";
	  }
	}
	
	function cookieSet(name, value) {
	  var expire = new Date();
	  expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 365);
	  var cookie = name + "=" + value + "; expires=" + expire.toUTCString() + ";";
	  document.cookie = cookie;
	}
	
	function getMultiple(getSingleFunc, keys, callback) {
	  if (typeof keys === "string") {
	    keys = [keys];
	  }
	
	  try {
	    var data = keys.map(function(key) {
	      return [key, getSingleFunc(key)];
	    }).reduce(function(accum, pair) {
	      accum[pair[0]] = pair[1];
	      return accum;
	    }, {});
	
	    callback(undefined, data);
	  } catch (e) {
	    callback(e);
	  }
	}
	
	function setMultiple(setSingleFunc, data, callback) {
	  try {
	    for (var key in data) {
	      if (data.hasOwnProperty(key)) {
	        setSingleFunc(key, data[key]);
	      }
	    }
	    callback();
	  } catch (e) {
	    callback(e);
	  }
	}
	
	var cookieSaveData = {
	  "get": getMultiple.bind(undefined, cookieGet),
	  "set": setMultiple.bind(undefined, cookieSet)
	};
	
	function localStorageGet(name) {
	  return window.localStorage.getItem(name);
	}
	
	function localStorageSet(name, value) {
	  window.localStorage.setItem(name, value.toString());
	}
	
	var localStorageSaveData = {
	  "get": getMultiple.bind(undefined, localStorageGet),
	  "set": setMultiple.bind(undefined, localStorageSet)
	};
	
	/**
	 * A function that is called when save data has finished being retrieved.
	 * @callback saveDataGetFinished
	 * @param {error} err If defined, err is the error that occurred when retrieving the data.
	 * @param {object} data The key-value pairs of data that were previously saved.
	 */
	/**
	 * Retrieve data previously stored with {@link Splat.saveData.set}.
	 * @alias Splat.saveData.get
	 * @param {string | Array} keys A single key or array of key names of data items to retrieve.
	 * @param {saveDataGetFinished} callback A callback that is called with the data when it has been retrieved.
	 */
	function chromeStorageGet(keys, callback) {
	  window.chrome.storage.sync.get(keys, function(data) {
	    if (window.chrome.runtime.lastError) {
	      callback(window.chrome.runtime.lastError);
	    } else {
	      callback(undefined, data);
	    }
	  });
	}
	
	/**
	 * A function that is called when save data has finished being stored.
	 * @callback saveDataSetFinished
	 * @param {error} err If defined, err is the error that occurred when saving the data.
	 */
	/**
	 * Store data for later.
	 * @alias Splat.saveData.set
	 * @param {object} data An object containing key-value pairs of data to save.
	 * @param {saveDataSetFinished} callback A callback that is called when the data has finished saving.
	 */
	function chromeStorageSet(data, callback) {
	  window.chrome.storage.sync.set(data, function() {
	    callback(window.chrome.runtime.lastError);
	  });
	}
	
	var chromeStorageSaveData = {
	  "get": chromeStorageGet,
	  "set": chromeStorageSet
	};
	
	if (platform.isChromeApp()) {
	  module.exports = chromeStorageSaveData;
	} else if (window.localStorage) {
	  module.exports = localStorageSaveData;
	} else {
	  module.exports = cookieSaveData;
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./index.js": 66,
		"./renderer/apply-shake.js": 67,
		"./renderer/background-color.js": 68,
		"./renderer/clear-screen.js": 69,
		"./renderer/draw-frame-rate.js": 70,
		"./renderer/draw-image.js": 71,
		"./renderer/draw-rectangles.js": 72,
		"./renderer/revert-shake.js": 73,
		"./renderer/viewport-move-to-camera.js": 74,
		"./renderer/viewport-reset.js": 75,
		"./simulation/advance-animations.js": 76,
		"./simulation/advance-timers.js": 77,
		"./simulation/apply-acceleration.js": 78,
		"./simulation/apply-easing.js": 79,
		"./simulation/apply-friction.js": 81,
		"./simulation/apply-movement-2d.js": 82,
		"./simulation/apply-velocity.js": 83,
		"./simulation/box-collider.js": 84,
		"./simulation/constrain-position.js": 99,
		"./simulation/control-player.js": 100,
		"./simulation/decay-life-span.js": 101,
		"./simulation/follow-mouse.js": 102,
		"./simulation/follow-parent.js": 103,
		"./simulation/match-aspect-ratio.js": 105,
		"./simulation/match-canvas-size.js": 106,
		"./simulation/match-center.js": 107,
		"./simulation/match-parent.js": 108,
		"./simulation/set-virtual-buttons.js": 109
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 65;


/***/ },
/* 66 */
/***/ function(module, exports) {

	/**
	 * <p>A "system" is a function that runs on all entities with specific {@link Components}.</p>
	 * <p>The systems listed here are built-in to splat and should not be called directly in your game.</p>
	 * <p>Instead these systems are included in [systems.json]{@link https://github.com/SplatJS/splat-ecs-starter-project/blob/master/src/data/systems.json} in your project.</p>
	 * <p>When you write your own systems they will also be included in your project's <code>systems.json</code> file.
	 * @namespace Systems
	 */
	


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var random = __webpack_require__(62);
	
	/**
	 * System that looks for an entity with the {@link Components.shake} and {@link Components.position} components.
	 * Every frame the apply shake system will move the entity's position by a pseudo-random number of pixels between half the magnitude (positive and negative).
	 * @memberof Systems
	 * @alias applyShake
	 * @requires Systems.revertShake
	 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
	 * @see [random]{@link splat-ecs/lib/random}
	 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
	 * @see [revertShake]{@link Systems.revertShake}
	 */
	module.exports = function(ecs, game) {
	  game.entities.registerSearch("applyShakeSearch", ["shake", "position"]);
	  ecs.addEach(function applyShake(entity, elapsed) {
	    var shake = game.entities.getComponent(entity, "shake");
	    if (shake.duration !== undefined) {
	      shake.duration -= elapsed;
	      if (shake.duration <= 0) {
	        game.entities.removeComponent(entity, "shake");
	        return;
	      }
	    }
	    var position = game.entities.getComponent(entity, "position");
	    shake.lastPositionX = position.x;
	    shake.lastPositionY = position.y;
	
	    var mx = shake.magnitudeX;
	    if (mx === undefined) {
	      mx = shake.magnitude || 0;
	    }
	    mx /= 2;
	    position.x += random.inRange(-mx, mx);
	
	    var my = shake.magnitudeY;
	    if (my === undefined) {
	      my = shake.magnitude || 0;
	    }
	    my /= 2;
	    position.y += random.inRange(-my, my);
	  }, "applyShakeSearch");
	};


/***/ },
/* 68 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	  game.entities.registerSearch("backgroundColorSearch", ["backgroundColor", "size", "position"]);
	  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
	    var color = game.entities.getComponent(entity, "backgroundColor");
	    var position = game.entities.getComponent(entity, "position");
	    var size = game.entities.getComponent(entity, "size");
	    game.context.fillStyle = color;
	    game.context.fillRect(position.x, position.y, size.width, size.height);
	  }, "backgroundColorSearch");
	};


/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  ecs.add(function clearScreen() {
	    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
	  });
	};


/***/ },
/* 70 */
/***/ function(module, exports) {

	function roundRect(context, x, y, width, height, radius, stroke) {
	  if (typeof stroke == "undefined") {
	    stroke = true;
	  }
	  if (typeof radius === "undefined") {
	    radius = 5;
	  }
	  context.beginPath();
	  context.moveTo(x + radius, y);
	  context.lineTo(x + width - radius, y);
	  context.quadraticCurveTo(x + width, y, x + width, y + radius);
	  context.lineTo(x + width, y + height - radius);
	  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	  context.lineTo(x + radius, y + height);
	  context.quadraticCurveTo(x, y + height, x, y + height - radius);
	  context.lineTo(x, y + radius);
	  context.quadraticCurveTo(x, y, x + radius, y);
	  context.closePath();
	  if (stroke) {
	    context.stroke();
	  }
	  context.fill();
	}
	
	module.exports = function(ecs, game) {
	  ecs.add(function drawFrameRate(entities, elapsed) {
	    var fps = Math.floor(1000 / elapsed);
	
	    var msg = fps + " FPS";
	    game.context.font = "24px monospace";
	    var w = game.context.measureText(msg).width;
	
	    game.context.fillStyle = "rgba(0,0,0,0.8)";
	    game.context.strokeStyle = "rgba(0,0,0,0.9)";
	    roundRect(game.context, game.canvas.width - 130, -5, 120, 45, 5);
	
	    if (fps < 30) {
	      game.context.fillStyle = "#FE4848"; //red
	    } else if (fps < 50) {
	      game.context.fillStyle = "#FDFA3C"; //yellow
	    } else {
	      game.context.fillStyle = "#38F82A"; //green
	    }
	
	    if (fps < 10) {
	      fps = " " + fps;
	    }
	
	    game.context.fillText(msg, game.canvas.width - w - 26, 25);
	  });
	};


/***/ },
/* 71 */
/***/ function(module, exports) {

	var defaultSize = { "width": 0, "height": 0 };
	
	function drawEntity(game, entity, context) {
	  var imageComponent = game.entities.getComponent(entity, "image");
	
	  var image = imageComponent.buffer;
	  if (!image) {
	    image = game.images.get(imageComponent.name);
	  }
	  if (!image) {
	    console.error("No such image", imageComponent.name, "for entity", entity, game.entities.getComponent(entity, "name"));
	    return;
	  }
	
	  // FIXME: disable these checks/warnings in production version
	
	  var sx = imageComponent.sourceX || 0;
	  var sy = imageComponent.sourceY || 0;
	
	  var dx = imageComponent.destinationX || 0;
	  var dy = imageComponent.destinationY || 0;
	
	  var size = game.entities.getComponent(entity, "size") || defaultSize;
	
	  var sw = imageComponent.sourceWidth || image.width;
	  if (sw === 0) {
	    console.warn("sourceWidth is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
	  }
	  var sh = imageComponent.sourceHeight || image.height;
	  if (sh === 0) {
	    console.warn("sourceHeight is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
	  }
	
	  var dw = imageComponent.destinationWidth || size.width || image.width;
	  if (dw === 0) {
	    console.warn("destinationWidth is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
	  }
	  var dh = imageComponent.destinationHeight || size.height || image.height;
	  if (dh === 0) {
	    console.warn("destinationHeight is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
	  }
	
	
	  try {
	    var position = game.entities.getComponent(entity, "position");
	
	    var dx2 = dx + position.x;
	    var dy2 = dy + position.y;
	
	    var rotation = game.entities.getComponent(entity, "rotation");
	    if (rotation !== undefined) {
	      context.save();
	      var rx = rotation.x || size.width / 2 || 0;
	      var ry = rotation.y || size.height / 2 || 0;
	      var x = position.x + rx;
	      var y = position.y + ry;
	      context.translate(x, y);
	      context.rotate(rotation.angle);
	
	      dx2 = dx - rx;
	      dy2 = dy - ry;
	    }
	
	    var alpha = 1;
	    if (imageComponent.alpha !== undefined) {
	      alpha = imageComponent.alpha;
	    }
	    context.globalAlpha = alpha;
	    context.drawImage(image, sx, sy, sw, sh, dx2, dy2, dw, dh);
	
	    if (rotation !== undefined) {
	      context.restore();
	    }
	  } catch (e) {
	    console.error("Error drawing image", imageComponent.name, e);
	  }
	}
	
	module.exports = function(ecs, game) {
	  game.entities.registerSearch("drawImage", ["image", "position"]);
	  ecs.add(function drawImage(entities) {
	    var ids = entities.find("drawImage");
	    ids.sort(function(a, b) {
	      var pa = entities.getComponent(a, "position");
	      var pb = entities.getComponent(b, "position");
	      var za = pa.z || 0;
	      var zb = pb.z || 0;
	      var ya = pa.y || 0;
	      var yb = pb.y || 0;
	      return za - zb || ya - yb || a - b;
	    });
	
	    for (var i = 0; i < ids.length; i++) {
	      drawEntity(game, ids[i], game.context);
	    }
	  });
	};


/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("drawRectangles", ["position", "size"]);
	  ecs.addEach(function drawRectangles(entity) {
	    var strokeStyle = game.entities.getComponent(entity, "strokeStyle");
	    if (strokeStyle) {
	      game.context.strokeStyle = strokeStyle;
	    }
	    var position = game.entities.getComponent(entity, "position");
	    var size = game.entities.getComponent(entity, "size");
	    game.context.strokeRect(Math.floor(position.x), Math.floor(position.y), size.width, size.height);
	  }, "drawRectangles");
	};


/***/ },
/* 73 */
/***/ function(module, exports) {

	/**
	 * System that looks for an entity with the {@link Components.shake} and {@link Components.position} components.
	 * After each iteration of the applyShake system, the revertShake system will move the entity back to where it started
	 * @memberof Systems
	 * @alias revertShake
	 * @requires Systems.applyShake
	 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
	 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
	 * @see [applyShake]{@link Systems.applyShake}
	 */
	module.exports = function(ecs, game) {
	  game.entities.registerSearch("revertShakeSearch",["shake", "position"]);
	  ecs.addEach(function revertShake(entity) {
	    var shake = game.entities.getComponent(entity, "shake");
	    var position = game.entities.getComponent(entity, "position");
	    position.x = shake.lastPositionX;
	    position.y = shake.lastPositionY;
	  }, "revertShakeSearch");
	};


/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("viewport", ["camera", "position", "size"]);
	  ecs.addEach(function viewportMoveToCamera(entity) {
	    var position = game.entities.getComponent(entity, "position");
	    var size = game.entities.getComponent(entity, "size");
	
	    game.context.save();
	    game.context.scale(game.canvas.width / size.width, game.canvas.height / size.height);
	    game.context.translate(-Math.floor(position.x), -Math.floor(position.y));
	  }, "viewport");
	};


/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  ecs.add(function viewportReset() {
	    game.context.restore();
	  });
	};


/***/ },
/* 76 */
/***/ function(module, exports) {

	function setOwnPropertiesDeep(src, dest) {
	  var props = Object.keys(src);
	  for (var i = 0; i < props.length; i++) {
	    var prop = props[i];
	    var val = src[prop];
	    if (typeof val === "object") {
	      if (!dest[prop]) {
	        dest[prop] = {};
	      }
	      setOwnPropertiesDeep(val, dest[prop]);
	    } else {
	      dest[prop] = val;
	    }
	  }
	}
	
	function applyAnimation(entity, a, animation, entities) {
	  a.lastName = a.name; // track the old name so we can see if it changes
	  Object.keys(animation[a.frame].properties).forEach(function(property) {
	    var dest = entities.getComponent(entity, property);
	    if (dest === undefined) {
	      dest = entities.addComponent(entity, property);
	    }
	    setOwnPropertiesDeep(animation[a.frame].properties[property], dest);
	  });
	}
	
	module.exports = function(ecs, game) {
	  game.entities.onAddComponent("animation", function(entity, component, a) {
	    var animation = game.animations[a.name];
	    if (animation === undefined) {
	      return;
	    }
	    applyAnimation(entity, a, animation, game.entities);
	  });
	  ecs.addEach(function advanceAnimations(entity, elapsed) {
	    var a = game.entities.getComponent(entity, "animation");
	    var animation = game.animations[a.name];
	    if (animation === undefined) {
	      return;
	    }
	    if (a.name != a.lastName) {
	      a.frame = 0;
	      a.time = 0;
	    }
	    a.time += elapsed * a.speed;
	    var lastFrame = a.frame;
	    while (a.time > animation[a.frame].time) {
	      a.time -= animation[a.frame].time;
	      a.frame++;
	      if (a.frame >= animation.length) {
	        if (a.loop) {
	          a.frame = 0;
	        } else {
	          a.frame--;
	        }
	      }
	    }
	    if (lastFrame != a.frame || a.name != a.lastName) {
	      applyAnimation(entity, a, animation, game.entities);
	    }
	  }, "animation");
	};


/***/ },
/* 77 */
/***/ function(module, exports) {

	/**
	 * System that looks for an entity with the {@link Components.timers} components.
	 * Every frame the advanceTimers system will loop through an entity's timers component and increment the "time" property by the elapsed time since the last frame. If the timer is set to loop it will restart the time when it hits max.
	 * @memberof Systems
	 * @alias advanceTimers
	 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
	 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
	 */
	module.exports = function(ecs, game) {
	  ecs.addEach(function advanceTimers(entity, elapsed) {
	    var timers = game.entities.getComponent(entity, "timers");
	    var names = Object.keys(timers);
	
	    names.forEach(function(name) {
	      var timer = timers[name];
	      if (!timer.running) {
	        return;
	      }
	
	      timer.time += elapsed;
	
	      while (timer.time > timer.max) {
	        if (timer.loop) {
	          timer.time -= timer.max;
	        } else {
	          timer.running = false;
	          timer.time = 0;
	        }
	        if (timer.script !== undefined) {
	          var script = game.require(timer.script);
	          script(entity, game);
	        }
	      }
	    });
	  }, "timers");
	};


/***/ },
/* 78 */
/***/ function(module, exports) {

	/**
	 * System that looks for an entity with the {@link Components.acceleration} and {@link Components.velocity} components.
	 * Every frame the apply acceleration system will modify the entity's velocity by the acceleration per elapsed millisecond.
	 * @memberof Systems
	 * @alias applyAcceleration
	 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
	 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
	 */
	module.exports = function(ecs, game) {
	  game.entities.registerSearch("applyAcceleration", ["acceleration", "velocity"]);
	  ecs.addEach(function applyAcceleration(entity, elapsed) {
	    var velocity = game.entities.getComponent(entity, "velocity");
	    var acceleration = game.entities.getComponent(entity, "acceleration");
	    velocity.x += acceleration.x * elapsed;
	    velocity.y += acceleration.y * elapsed;
	  }, "applyAcceleration");
	};


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var easingJS = __webpack_require__(80);
	
	module.exports = function(ecs, game) {
	  ecs.addEach(function applyEasing(entity, elapsed) {
	    var easing = game.entities.getComponent(entity, "easing");
	
	    var properties = Object.keys(easing);
	    for (var i = 0; i < properties.length; i++) {
	      var current = easing[properties[i]];
	      current.time += elapsed;
	      easeProperty(game, entity, properties[i], current);
	      if (current.time > current.max) {
	        delete easing[properties[i]];
	      }
	    }
	  }, "easing");
	};
	
	function easeProperty(game, entity, property, easing) {
	  var parts = property.split(".");
	  var componentName = parts[0];
	  var component = game.entities.getComponent(entity, componentName);
	  var partNames = parts.slice(1, parts.length, parts - 1);
	  for (var i = 0; i < partNames.length - 1; i++) {
	    component = component[partNames[i]];
	  }
	  var last = parts[parts.length - 1];
	  component[last] = easingJS[easing.type](easing.time, easing.start, easing.end - easing.start, easing.max);
	}


/***/ },
/* 80 */
/***/ function(module, exports) {

	"use strict";
	
	var Easing = {
	  linear: function linear(t, b, c, d) {
	    return c * t / d + b;
	  },
	  easeInQuad: function easeInQuad(t, b, c, d) {
	    return c * (t /= d) * t + b;
	  },
	  easeOutQuad: function easeOutQuad(t, b, c, d) {
	    return -c * (t /= d) * (t - 2) + b;
	  },
	  easeInOutQuad: function easeInOutQuad(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	      return c / 2 * t * t + b;
	    } else {
	      return -c / 2 * (--t * (t - 2) - 1) + b;
	    }
	  },
	  easeInCubic: function easeInCubic(t, b, c, d) {
	    return c * (t /= d) * t * t + b;
	  },
	  easeOutCubic: function easeOutCubic(t, b, c, d) {
	    return c * ((t = t / d - 1) * t * t + 1) + b;
	  },
	  easeInOutCubic: function easeInOutCubic(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	      return c / 2 * t * t * t + b;
	    } else {
	      return c / 2 * ((t -= 2) * t * t + 2) + b;
	    }
	  },
	  easeInQuart: function easeInQuart(t, b, c, d) {
	    return c * (t /= d) * t * t * t + b;
	  },
	  easeOutQuart: function easeOutQuart(t, b, c, d) {
	    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	  },
	  easeInOutQuart: function easeInOutQuart(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	      return c / 2 * t * t * t * t + b;
	    } else {
	      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	    }
	  },
	  easeInQuint: function easeInQuint(t, b, c, d) {
	    return c * (t /= d) * t * t * t * t + b;
	  },
	  easeOutQuint: function easeOutQuint(t, b, c, d) {
	    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	  },
	  easeInOutQuint: function easeInOutQuint(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	      return c / 2 * t * t * t * t * t + b;
	    } else {
	      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	    }
	  },
	  easeInSine: function easeInSine(t, b, c, d) {
	    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	  },
	  easeOutSine: function easeOutSine(t, b, c, d) {
	    return c * Math.sin(t / d * (Math.PI / 2)) + b;
	  },
	  easeInOutSine: function easeInOutSine(t, b, c, d) {
	    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	  },
	  easeInExpo: function easeInExpo(t, b, c, d) {
	    var _ref;
	    return (_ref = t === 0) !== null ? _ref : {
	      b: c * Math.pow(2, 10 * (t / d - 1)) + b
	    };
	  },
	  easeOutExpo: function easeOutExpo(t, b, c, d) {
	    var _ref;
	    return (_ref = t === d) !== null ? _ref : b + {
	      c: c * (-Math.pow(2, -10 * t / d) + 1) + b
	    };
	  },
	  easeInOutExpo: function easeInOutExpo(t, b, c, d) {
	    if (t === 0) {
	      b;
	    }
	    if (t === d) {
	      b + c;
	    }
	    if ((t /= d / 2) < 1) {
	      return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	    } else {
	      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	    }
	  },
	  easeInCirc: function easeInCirc(t, b, c, d) {
	    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	  },
	  easeOutCirc: function easeOutCirc(t, b, c, d) {
	    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	  },
	  easeInOutCirc: function easeInOutCirc(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	    } else {
	      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	    }
	  },
	  easeInElastic: function easeInElastic(t, b, c, d) {
	    var a, p, s;
	    s = 1.70158;
	    p = 0;
	    a = c;
	    if (t === 0) {
	      b;
	    } else if ((t /= d) === 1) {
	      b + c;
	    }
	    if (!p) {
	      p = d * 0.3;
	    }
	    if (a < Math.abs(c)) {
	      a = c;
	      s = p / 4;
	    } else {
	      s = p / (2 * Math.PI) * Math.asin(c / a);
	    }
	    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	  },
	  easeOutElastic: function easeOutElastic(t, b, c, d) {
	    var a, p, s;
	    s = 1.70158;
	    p = 0;
	    a = c;
	    if (t === 0) {
	      b;
	    } else if ((t /= d) === 1) {
	      b + c;
	    }
	    if (!p) {
	      p = d * 0.3;
	    }
	    if (a < Math.abs(c)) {
	      a = c;
	      s = p / 4;
	    } else {
	      s = p / (2 * Math.PI) * Math.asin(c / a);
	    }
	    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	  },
	  easeInOutElastic: function easeInOutElastic(t, b, c, d) {
	    var a, p, s;
	    s = 1.70158;
	    p = 0;
	    a = c;
	    if (t === 0) {
	      b;
	    } else if ((t /= d / 2) === 2) {
	      b + c;
	    }
	    if (!p) {
	      p = d * (0.3 * 1.5);
	    }
	    if (a < Math.abs(c)) {
	      a = c;
	      s = p / 4;
	    } else {
	      s = p / (2 * Math.PI) * Math.asin(c / a);
	    }
	    if (t < 1) {
	      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	    } else {
	      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	    }
	  },
	  easeInBack: function easeInBack(t, b, c, d, s) {
	    if (s === void 0) {
	      s = 1.70158;
	    }
	    return c * (t /= d) * t * ((s + 1) * t - s) + b;
	  },
	  easeOutBack: function easeOutBack(t, b, c, d, s) {
	    if (s === void 0) {
	      s = 1.70158;
	    }
	    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	  },
	  easeInOutBack: function easeInOutBack(t, b, c, d, s) {
	    if (s === void 0) {
	      s = 1.70158;
	    }
	    if ((t /= d / 2) < 1) {
	      return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
	    } else {
	      return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	    }
	  },
	  easeInBounce: function easeInBounce(t, b, c, d) {
	    var v;
	    v = Easing.easeOutBounce(d - t, 0, c, d);
	    return c - v + b;
	  },
	  easeOutBounce: function easeOutBounce(t, b, c, d) {
	    if ((t /= d) < 1 / 2.75) {
	      return c * (7.5625 * t * t) + b;
	    } else if (t < 2 / 2.75) {
	      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
	    } else if (t < 2.5 / 2.75) {
	      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
	    } else {
	      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
	    }
	  },
	  easeInOutBounce: function easeInOutBounce(t, b, c, d) {
	    var v;
	    if (t < d / 2) {
	      v = Easing.easeInBounce(t * 2, 0, c, d);
	      return v * 0.5 + b;
	    } else {
	      v = Easing.easeOutBounce(t * 2 - d, 0, c, d);
	      return v * 0.5 + c * 0.5 + b;
	    }
	  }
	};
	
	module.exports = Easing;

/***/ },
/* 81 */
/***/ function(module, exports) {

	/**
	 * System that looks for an entity with the {@link Components.friction} and {@link Components.velocity} components.
	 * Every frame the apply friction system will modify the entity's velocity by the friction.
	 * @memberof Systems
	 * @alias applyFriction
	 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
	 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
	 */
	module.exports = function(ecs, game) {
	  game.entities.registerSearch("applyFriction", ["velocity", "friction"]);
	  ecs.addEach(function applyFriction(entity) {
	    var velocity = game.entities.getComponent(entity, "velocity");
	    var friction = game.entities.getComponent(entity, "friction");
	    velocity.x *= friction.x;
	    velocity.y *= friction.y;
	  }, "applyFriction");
	};


/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("applyMovement2d", ["velocity", "movement2d"]);
	  ecs.addEach(function applyMovement2d(entity) {
	    var velocity = game.entities.getComponent(entity, "velocity");
	    var movement2d = game.entities.getComponent(entity, "movement2d");
	    if (movement2d.up && velocity.y > movement2d.upMax) {
	      velocity.y += movement2d.upAccel;
	    }
	    if (movement2d.down && velocity.y < movement2d.downMax) {
	      velocity.y += movement2d.downAccel;
	    }
	    if (movement2d.left && velocity.x > movement2d.leftMax) {
	      velocity.x += movement2d.leftAccel;
	    }
	    if (movement2d.right && velocity.x < movement2d.rightMax) {
	      velocity.x += movement2d.rightAccel;
	    }
	  }, "applyMovement2d");
	};


/***/ },
/* 83 */
/***/ function(module, exports) {

	/**
	 * System that looks for an entity with the {@link Components.position} and {@link Components.velocity} components.
	 * Every frame the apply velocity system will move the entity's position by the velocity per elapsed millisecond.
	 * @memberof Systems
	 * @alias applyVelocity
	 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
	 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
	 */
	module.exports = function(ecs, game) {
	  game.entities.registerSearch("applyVelocity", ["position", "velocity"]);
	  ecs.addEach(function applyVelocity(entity, elapsed) {
	    var position = game.entities.getComponent(entity, "position");
	    var velocity = game.entities.getComponent(entity, "velocity");
	    position.x += velocity.x * elapsed;
	    position.y += velocity.y * elapsed;
	  }, "applyVelocity");
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var boxIntersect = __webpack_require__(85);
	
	module.exports = function(ecs, game) {
	
	  game.entities.registerSearch("boxCollider", ["position", "size", "collisions"]);
	
	  game.entities.onRemoveComponent("collisions", function(entity, component, collisions) {
	    for (var i = 0; i < collisions.length; i++) {
	      var otherCollisions = game.entities.getComponent(collisions[i], "collisions");
	      var idx = otherCollisions.indexOf(entity);
	      if (idx !== -1) {
	        otherCollisions.splice(idx,1);
	      }
	    }
	  });
	
	  var boxPool = [];
	  var boxPoolLength = 0;
	  function growBoxPool(size) {
	    boxPoolLength = size;
	    while (boxPool.length < size) {
	      for (var i = 0; i < 50; i++) {
	        boxPool.push([0, 0, 0, 0]);
	      }
	    }
	  }
	
	  ecs.add(function boxCollider() {
	    var ids = game.entities.find("boxCollider");
	
	    growBoxPool(ids.length);
	    ids.forEach(function(entity, i) {
	      game.entities.getComponent(entity, "collisions").length = 0;
	      var position = game.entities.getComponent(entity, "position");
	      var size = game.entities.getComponent(entity, "size");
	      boxPool[i][0] = position.x;
	      boxPool[i][1] = position.y;
	      boxPool[i][2] = position.x + size.width;
	      boxPool[i][3] = position.y + size.height;
	    });
	    boxIntersect(boxPool, function(a, b) {
	      if (a >= boxPoolLength || b >= boxPoolLength) {
	        return;
	      }
	      var idA = ids[a];
	      var idB = ids[b];
	      game.entities.getComponent(idA, "collisions").push(idB);
	      game.entities.getComponent(idB, "collisions").push(idA);
	    });
	  });
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	module.exports = boxIntersectWrapper
	
	var pool = __webpack_require__(86)
	var sweep = __webpack_require__(93)
	var boxIntersectIter = __webpack_require__(95)
	
	function boxEmpty(d, box) {
	  for(var j=0; j<d; ++j) {
	    if(!(box[j] <= box[j+d])) {
	      return true
	    }
	  }
	  return false
	}
	
	//Unpack boxes into a flat typed array, remove empty boxes
	function convertBoxes(boxes, d, data, ids) {
	  var ptr = 0
	  var count = 0
	  for(var i=0, n=boxes.length; i<n; ++i) {
	    var b = boxes[i]
	    if(boxEmpty(d, b)) {
	      continue
	    }
	    for(var j=0; j<2*d; ++j) {
	      data[ptr++] = b[j]
	    }
	    ids[count++] = i
	  }
	  return count
	}
	
	//Perform type conversions, check bounds
	function boxIntersect(red, blue, visit, full) {
	  var n = red.length
	  var m = blue.length
	
	  //If either array is empty, then we can skip this whole thing
	  if(n <= 0 || m <= 0) {
	    return
	  }
	
	  //Compute dimension, if it is 0 then we skip
	  var d = (red[0].length)>>>1
	  if(d <= 0) {
	    return
	  }
	
	  var retval
	
	  //Convert red boxes
	  var redList  = pool.mallocDouble(2*d*n)
	  var redIds   = pool.mallocInt32(n)
	  n = convertBoxes(red, d, redList, redIds)
	
	  if(n > 0) {
	    if(d === 1 && full) {
	      //Special case: 1d complete
	      sweep.init(n)
	      retval = sweep.sweepComplete(
	        d, visit, 
	        0, n, redList, redIds,
	        0, n, redList, redIds)
	    } else {
	
	      //Convert blue boxes
	      var blueList = pool.mallocDouble(2*d*m)
	      var blueIds  = pool.mallocInt32(m)
	      m = convertBoxes(blue, d, blueList, blueIds)
	
	      if(m > 0) {
	        sweep.init(n+m)
	
	        if(d === 1) {
	          //Special case: 1d bipartite
	          retval = sweep.sweepBipartite(
	            d, visit, 
	            0, n, redList,  redIds,
	            0, m, blueList, blueIds)
	        } else {
	          //General case:  d>1
	          retval = boxIntersectIter(
	            d, visit,    full,
	            n, redList,  redIds,
	            m, blueList, blueIds)
	        }
	
	        pool.free(blueList)
	        pool.free(blueIds)
	      }
	    }
	
	    pool.free(redList)
	    pool.free(redIds)
	  }
	
	  return retval
	}
	
	
	var RESULT
	
	function appendItem(i,j) {
	  RESULT.push([i,j])
	}
	
	function intersectFullArray(x) {
	  RESULT = []
	  boxIntersect(x, x, appendItem, true)
	  return RESULT
	}
	
	function intersectBipartiteArray(x, y) {
	  RESULT = []
	  boxIntersect(x, y, appendItem, false)
	  return RESULT
	}
	
	//User-friendly wrapper, handle full input and no-visitor cases
	function boxIntersectWrapper(arg0, arg1, arg2) {
	  var result
	  switch(arguments.length) {
	    case 1:
	      return intersectFullArray(arg0)
	    case 2:
	      if(typeof arg1 === 'function') {
	        return boxIntersect(arg0, arg0, arg1, true)
	      } else {
	        return intersectBipartiteArray(arg0, arg1)
	      }
	    case 3:
	      return boxIntersect(arg0, arg1, arg2, false)
	    default:
	      throw new Error('box-intersect: Invalid arguments')
	  }
	}

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict'
	
	var bits = __webpack_require__(91)
	var dup = __webpack_require__(92)
	
	//Legacy pool support
	if(!global.__TYPEDARRAY_POOL) {
	  global.__TYPEDARRAY_POOL = {
	      UINT8   : dup([32, 0])
	    , UINT16  : dup([32, 0])
	    , UINT32  : dup([32, 0])
	    , INT8    : dup([32, 0])
	    , INT16   : dup([32, 0])
	    , INT32   : dup([32, 0])
	    , FLOAT   : dup([32, 0])
	    , DOUBLE  : dup([32, 0])
	    , DATA    : dup([32, 0])
	    , UINT8C  : dup([32, 0])
	    , BUFFER  : dup([32, 0])
	  }
	}
	
	var hasUint8C = (typeof Uint8ClampedArray) !== 'undefined'
	var POOL = global.__TYPEDARRAY_POOL
	
	//Upgrade pool
	if(!POOL.UINT8C) {
	  POOL.UINT8C = dup([32, 0])
	}
	if(!POOL.BUFFER) {
	  POOL.BUFFER = dup([32, 0])
	}
	
	//New technique: Only allocate from ArrayBufferView and Buffer
	var DATA    = POOL.DATA
	  , BUFFER  = POOL.BUFFER
	
	exports.free = function free(array) {
	  if(Buffer.isBuffer(array)) {
	    BUFFER[bits.log2(array.length)].push(array)
	  } else {
	    if(Object.prototype.toString.call(array) !== '[object ArrayBuffer]') {
	      array = array.buffer
	    }
	    if(!array) {
	      return
	    }
	    var n = array.length || array.byteLength
	    var log_n = bits.log2(n)|0
	    DATA[log_n].push(array)
	  }
	}
	
	function freeArrayBuffer(buffer) {
	  if(!buffer) {
	    return
	  }
	  var n = buffer.length || buffer.byteLength
	  var log_n = bits.log2(n)
	  DATA[log_n].push(buffer)
	}
	
	function freeTypedArray(array) {
	  freeArrayBuffer(array.buffer)
	}
	
	exports.freeUint8 =
	exports.freeUint16 =
	exports.freeUint32 =
	exports.freeInt8 =
	exports.freeInt16 =
	exports.freeInt32 =
	exports.freeFloat32 = 
	exports.freeFloat =
	exports.freeFloat64 = 
	exports.freeDouble = 
	exports.freeUint8Clamped = 
	exports.freeDataView = freeTypedArray
	
	exports.freeArrayBuffer = freeArrayBuffer
	
	exports.freeBuffer = function freeBuffer(array) {
	  BUFFER[bits.log2(array.length)].push(array)
	}
	
	exports.malloc = function malloc(n, dtype) {
	  if(dtype === undefined || dtype === 'arraybuffer') {
	    return mallocArrayBuffer(n)
	  } else {
	    switch(dtype) {
	      case 'uint8':
	        return mallocUint8(n)
	      case 'uint16':
	        return mallocUint16(n)
	      case 'uint32':
	        return mallocUint32(n)
	      case 'int8':
	        return mallocInt8(n)
	      case 'int16':
	        return mallocInt16(n)
	      case 'int32':
	        return mallocInt32(n)
	      case 'float':
	      case 'float32':
	        return mallocFloat(n)
	      case 'double':
	      case 'float64':
	        return mallocDouble(n)
	      case 'uint8_clamped':
	        return mallocUint8Clamped(n)
	      case 'buffer':
	        return mallocBuffer(n)
	      case 'data':
	      case 'dataview':
	        return mallocDataView(n)
	
	      default:
	        return null
	    }
	  }
	  return null
	}
	
	function mallocArrayBuffer(n) {
	  var n = bits.nextPow2(n)
	  var log_n = bits.log2(n)
	  var d = DATA[log_n]
	  if(d.length > 0) {
	    return d.pop()
	  }
	  return new ArrayBuffer(n)
	}
	exports.mallocArrayBuffer = mallocArrayBuffer
	
	function mallocUint8(n) {
	  return new Uint8Array(mallocArrayBuffer(n), 0, n)
	}
	exports.mallocUint8 = mallocUint8
	
	function mallocUint16(n) {
	  return new Uint16Array(mallocArrayBuffer(2*n), 0, n)
	}
	exports.mallocUint16 = mallocUint16
	
	function mallocUint32(n) {
	  return new Uint32Array(mallocArrayBuffer(4*n), 0, n)
	}
	exports.mallocUint32 = mallocUint32
	
	function mallocInt8(n) {
	  return new Int8Array(mallocArrayBuffer(n), 0, n)
	}
	exports.mallocInt8 = mallocInt8
	
	function mallocInt16(n) {
	  return new Int16Array(mallocArrayBuffer(2*n), 0, n)
	}
	exports.mallocInt16 = mallocInt16
	
	function mallocInt32(n) {
	  return new Int32Array(mallocArrayBuffer(4*n), 0, n)
	}
	exports.mallocInt32 = mallocInt32
	
	function mallocFloat(n) {
	  return new Float32Array(mallocArrayBuffer(4*n), 0, n)
	}
	exports.mallocFloat32 = exports.mallocFloat = mallocFloat
	
	function mallocDouble(n) {
	  return new Float64Array(mallocArrayBuffer(8*n), 0, n)
	}
	exports.mallocFloat64 = exports.mallocDouble = mallocDouble
	
	function mallocUint8Clamped(n) {
	  if(hasUint8C) {
	    return new Uint8ClampedArray(mallocArrayBuffer(n), 0, n)
	  } else {
	    return mallocUint8(n)
	  }
	}
	exports.mallocUint8Clamped = mallocUint8Clamped
	
	function mallocDataView(n) {
	  return new DataView(mallocArrayBuffer(n), 0, n)
	}
	exports.mallocDataView = mallocDataView
	
	function mallocBuffer(n) {
	  n = bits.nextPow2(n)
	  var log_n = bits.log2(n)
	  var cache = BUFFER[log_n]
	  if(cache.length > 0) {
	    return cache.pop()
	  }
	  return new Buffer(n)
	}
	exports.mallocBuffer = mallocBuffer
	
	exports.clearCache = function clearCache() {
	  for(var i=0; i<32; ++i) {
	    POOL.UINT8[i].length = 0
	    POOL.UINT16[i].length = 0
	    POOL.UINT32[i].length = 0
	    POOL.INT8[i].length = 0
	    POOL.INT16[i].length = 0
	    POOL.INT32[i].length = 0
	    POOL.FLOAT[i].length = 0
	    POOL.DOUBLE[i].length = 0
	    POOL.UINT8C[i].length = 0
	    DATA[i].length = 0
	    BUFFER[i].length = 0
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(87).Buffer))

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(88)
	var ieee754 = __webpack_require__(89)
	var isArray = __webpack_require__(90)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(87).Buffer, (function() { return this; }())))

/***/ },
/* 88 */
/***/ function(module, exports) {

	'use strict'
	
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	function init () {
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i]
	    revLookup[code.charCodeAt(i)] = i
	  }
	
	  revLookup['-'.charCodeAt(0)] = 62
	  revLookup['_'.charCodeAt(0)] = 63
	}
	
	init()
	
	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	
	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ },
/* 89 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 90 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 91 */
/***/ function(module, exports) {

	/**
	 * Bit twiddling hacks for JavaScript.
	 *
	 * Author: Mikola Lysenko
	 *
	 * Ported from Stanford bit twiddling hack library:
	 *    http://graphics.stanford.edu/~seander/bithacks.html
	 */
	
	"use strict"; "use restrict";
	
	//Number of bits in an integer
	var INT_BITS = 32;
	
	//Constants
	exports.INT_BITS  = INT_BITS;
	exports.INT_MAX   =  0x7fffffff;
	exports.INT_MIN   = -1<<(INT_BITS-1);
	
	//Returns -1, 0, +1 depending on sign of x
	exports.sign = function(v) {
	  return (v > 0) - (v < 0);
	}
	
	//Computes absolute value of integer
	exports.abs = function(v) {
	  var mask = v >> (INT_BITS-1);
	  return (v ^ mask) - mask;
	}
	
	//Computes minimum of integers x and y
	exports.min = function(x, y) {
	  return y ^ ((x ^ y) & -(x < y));
	}
	
	//Computes maximum of integers x and y
	exports.max = function(x, y) {
	  return x ^ ((x ^ y) & -(x < y));
	}
	
	//Checks if a number is a power of two
	exports.isPow2 = function(v) {
	  return !(v & (v-1)) && (!!v);
	}
	
	//Computes log base 2 of v
	exports.log2 = function(v) {
	  var r, shift;
	  r =     (v > 0xFFFF) << 4; v >>>= r;
	  shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
	  shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
	  shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
	  return r | (v >> 1);
	}
	
	//Computes log base 10 of v
	exports.log10 = function(v) {
	  return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
	          (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
	          (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
	}
	
	//Counts number of bits
	exports.popCount = function(v) {
	  v = v - ((v >>> 1) & 0x55555555);
	  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
	  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
	}
	
	//Counts number of trailing zeros
	function countTrailingZeros(v) {
	  var c = 32;
	  v &= -v;
	  if (v) c--;
	  if (v & 0x0000FFFF) c -= 16;
	  if (v & 0x00FF00FF) c -= 8;
	  if (v & 0x0F0F0F0F) c -= 4;
	  if (v & 0x33333333) c -= 2;
	  if (v & 0x55555555) c -= 1;
	  return c;
	}
	exports.countTrailingZeros = countTrailingZeros;
	
	//Rounds to next power of 2
	exports.nextPow2 = function(v) {
	  v += v === 0;
	  --v;
	  v |= v >>> 1;
	  v |= v >>> 2;
	  v |= v >>> 4;
	  v |= v >>> 8;
	  v |= v >>> 16;
	  return v + 1;
	}
	
	//Rounds down to previous power of 2
	exports.prevPow2 = function(v) {
	  v |= v >>> 1;
	  v |= v >>> 2;
	  v |= v >>> 4;
	  v |= v >>> 8;
	  v |= v >>> 16;
	  return v - (v>>>1);
	}
	
	//Computes parity of word
	exports.parity = function(v) {
	  v ^= v >>> 16;
	  v ^= v >>> 8;
	  v ^= v >>> 4;
	  v &= 0xf;
	  return (0x6996 >>> v) & 1;
	}
	
	var REVERSE_TABLE = new Array(256);
	
	(function(tab) {
	  for(var i=0; i<256; ++i) {
	    var v = i, r = i, s = 7;
	    for (v >>>= 1; v; v >>>= 1) {
	      r <<= 1;
	      r |= v & 1;
	      --s;
	    }
	    tab[i] = (r << s) & 0xff;
	  }
	})(REVERSE_TABLE);
	
	//Reverse bits in a 32 bit word
	exports.reverse = function(v) {
	  return  (REVERSE_TABLE[ v         & 0xff] << 24) |
	          (REVERSE_TABLE[(v >>> 8)  & 0xff] << 16) |
	          (REVERSE_TABLE[(v >>> 16) & 0xff] << 8)  |
	           REVERSE_TABLE[(v >>> 24) & 0xff];
	}
	
	//Interleave bits of 2 coordinates with 16 bits.  Useful for fast quadtree codes
	exports.interleave2 = function(x, y) {
	  x &= 0xFFFF;
	  x = (x | (x << 8)) & 0x00FF00FF;
	  x = (x | (x << 4)) & 0x0F0F0F0F;
	  x = (x | (x << 2)) & 0x33333333;
	  x = (x | (x << 1)) & 0x55555555;
	
	  y &= 0xFFFF;
	  y = (y | (y << 8)) & 0x00FF00FF;
	  y = (y | (y << 4)) & 0x0F0F0F0F;
	  y = (y | (y << 2)) & 0x33333333;
	  y = (y | (y << 1)) & 0x55555555;
	
	  return x | (y << 1);
	}
	
	//Extracts the nth interleaved component
	exports.deinterleave2 = function(v, n) {
	  v = (v >>> n) & 0x55555555;
	  v = (v | (v >>> 1))  & 0x33333333;
	  v = (v | (v >>> 2))  & 0x0F0F0F0F;
	  v = (v | (v >>> 4))  & 0x00FF00FF;
	  v = (v | (v >>> 16)) & 0x000FFFF;
	  return (v << 16) >> 16;
	}
	
	
	//Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
	exports.interleave3 = function(x, y, z) {
	  x &= 0x3FF;
	  x  = (x | (x<<16)) & 4278190335;
	  x  = (x | (x<<8))  & 251719695;
	  x  = (x | (x<<4))  & 3272356035;
	  x  = (x | (x<<2))  & 1227133513;
	
	  y &= 0x3FF;
	  y  = (y | (y<<16)) & 4278190335;
	  y  = (y | (y<<8))  & 251719695;
	  y  = (y | (y<<4))  & 3272356035;
	  y  = (y | (y<<2))  & 1227133513;
	  x |= (y << 1);
	  
	  z &= 0x3FF;
	  z  = (z | (z<<16)) & 4278190335;
	  z  = (z | (z<<8))  & 251719695;
	  z  = (z | (z<<4))  & 3272356035;
	  z  = (z | (z<<2))  & 1227133513;
	  
	  return x | (z << 2);
	}
	
	//Extracts nth interleaved component of a 3-tuple
	exports.deinterleave3 = function(v, n) {
	  v = (v >>> n)       & 1227133513;
	  v = (v | (v>>>2))   & 3272356035;
	  v = (v | (v>>>4))   & 251719695;
	  v = (v | (v>>>8))   & 4278190335;
	  v = (v | (v>>>16))  & 0x3FF;
	  return (v<<22)>>22;
	}
	
	//Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
	exports.nextCombination = function(v) {
	  var t = v | (v - 1);
	  return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
	}
	


/***/ },
/* 92 */
/***/ function(module, exports) {

	"use strict"
	
	function dupe_array(count, value, i) {
	  var c = count[i]|0
	  if(c <= 0) {
	    return []
	  }
	  var result = new Array(c), j
	  if(i === count.length-1) {
	    for(j=0; j<c; ++j) {
	      result[j] = value
	    }
	  } else {
	    for(j=0; j<c; ++j) {
	      result[j] = dupe_array(count, value, i+1)
	    }
	  }
	  return result
	}
	
	function dupe_number(count, value) {
	  var result, i
	  result = new Array(count)
	  for(i=0; i<count; ++i) {
	    result[i] = value
	  }
	  return result
	}
	
	function dupe(count, value) {
	  if(typeof value === "undefined") {
	    value = 0
	  }
	  switch(typeof count) {
	    case "number":
	      if(count > 0) {
	        return dupe_number(count|0, value)
	      }
	    break
	    case "object":
	      if(typeof (count.length) === "number") {
	        return dupe_array(count, value, 0)
	      }
	    break
	  }
	  return []
	}
	
	module.exports = dupe

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	module.exports = {
	  init:           sqInit,
	  sweepBipartite: sweepBipartite,
	  sweepComplete:  sweepComplete,
	  scanBipartite:  scanBipartite,
	  scanComplete:   scanComplete
	}
	
	var pool  = __webpack_require__(86)
	var bits  = __webpack_require__(91)
	var isort = __webpack_require__(94)
	
	//Flag for blue
	var BLUE_FLAG = (1<<28)
	
	//1D sweep event queue stuff (use pool to save space)
	var INIT_CAPACITY      = 1024
	var RED_SWEEP_QUEUE    = pool.mallocInt32(INIT_CAPACITY)
	var RED_SWEEP_INDEX    = pool.mallocInt32(INIT_CAPACITY)
	var BLUE_SWEEP_QUEUE   = pool.mallocInt32(INIT_CAPACITY)
	var BLUE_SWEEP_INDEX   = pool.mallocInt32(INIT_CAPACITY)
	var COMMON_SWEEP_QUEUE = pool.mallocInt32(INIT_CAPACITY)
	var COMMON_SWEEP_INDEX = pool.mallocInt32(INIT_CAPACITY)
	var SWEEP_EVENTS       = pool.mallocDouble(INIT_CAPACITY * 8)
	
	//Reserves memory for the 1D sweep data structures
	function sqInit(count) {
	  var rcount = bits.nextPow2(count)
	  if(RED_SWEEP_QUEUE.length < rcount) {
	    pool.free(RED_SWEEP_QUEUE)
	    RED_SWEEP_QUEUE = pool.mallocInt32(rcount)
	  }
	  if(RED_SWEEP_INDEX.length < rcount) {
	    pool.free(RED_SWEEP_INDEX)
	    RED_SWEEP_INDEX = pool.mallocInt32(rcount)
	  }
	  if(BLUE_SWEEP_QUEUE.length < rcount) {
	    pool.free(BLUE_SWEEP_QUEUE)
	    BLUE_SWEEP_QUEUE = pool.mallocInt32(rcount)
	  }
	  if(BLUE_SWEEP_INDEX.length < rcount) {
	    pool.free(BLUE_SWEEP_INDEX)
	    BLUE_SWEEP_INDEX = pool.mallocInt32(rcount)
	  }
	  if(COMMON_SWEEP_QUEUE.length < rcount) {
	    pool.free(COMMON_SWEEP_QUEUE)
	    COMMON_SWEEP_QUEUE = pool.mallocInt32(rcount)
	  }
	  if(COMMON_SWEEP_INDEX.length < rcount) {
	    pool.free(COMMON_SWEEP_INDEX)
	    COMMON_SWEEP_INDEX = pool.mallocInt32(rcount)
	  }
	  var eventLength = 8 * rcount
	  if(SWEEP_EVENTS.length < eventLength) {
	    pool.free(SWEEP_EVENTS)
	    SWEEP_EVENTS = pool.mallocDouble(eventLength)
	  }
	}
	
	//Remove an item from the active queue in O(1)
	function sqPop(queue, index, count, item) {
	  var idx = index[item]
	  var top = queue[count-1]
	  queue[idx] = top
	  index[top] = idx
	}
	
	//Insert an item into the active queue in O(1)
	function sqPush(queue, index, count, item) {
	  queue[count] = item
	  index[item]  = count
	}
	
	//Recursion base case: use 1D sweep algorithm
	function sweepBipartite(
	    d, visit,
	    redStart,  redEnd, red, redIndex,
	    blueStart, blueEnd, blue, blueIndex) {
	
	  //store events as pairs [coordinate, idx]
	  //
	  //  red create:  -(idx+1)
	  //  red destroy: idx
	  //  blue create: -(idx+BLUE_FLAG)
	  //  blue destroy: idx+BLUE_FLAG
	  //
	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = d-1
	  var iend     = elemSize-1
	
	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = redIndex[i]
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -(idx+1)
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }
	
	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = blueIndex[i]+BLUE_FLAG
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }
	
	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive  = 0
	  var blueActive = 0
	  for(var i=0; i<n; ++i) {
	    var e = SWEEP_EVENTS[2*i+1]|0
	    if(e >= BLUE_FLAG) {
	      //blue destroy event
	      e = (e-BLUE_FLAG)|0
	      sqPop(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive--, e)
	    } else if(e >= 0) {
	      //red destroy event
	      sqPop(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive--, e)
	    } else if(e <= -BLUE_FLAG) {
	      //blue create event
	      e = (-e-BLUE_FLAG)|0
	      for(var j=0; j<redActive; ++j) {
	        var retval = visit(RED_SWEEP_QUEUE[j], e)
	        if(retval !== void 0) {
	          return retval
	        }
	      }
	      sqPush(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive++, e)
	    } else {
	      //red create event
	      e = (-e-1)|0
	      for(var j=0; j<blueActive; ++j) {
	        var retval = visit(e, BLUE_SWEEP_QUEUE[j])
	        if(retval !== void 0) {
	          return retval
	        }
	      }
	      sqPush(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive++, e)
	    }
	  }
	}
	
	//Complete sweep
	function sweepComplete(d, visit, 
	  redStart, redEnd, red, redIndex,
	  blueStart, blueEnd, blue, blueIndex) {
	
	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = d-1
	  var iend     = elemSize-1
	
	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = (redIndex[i]+1)<<1
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }
	
	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = (blueIndex[i]+1)<<1
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = (-idx)|1
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx|1
	  }
	
	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive    = 0
	  var blueActive   = 0
	  var commonActive = 0
	  for(var i=0; i<n; ++i) {
	    var e     = SWEEP_EVENTS[2*i+1]|0
	    var color = e&1
	    if(i < n-1 && (e>>1) === (SWEEP_EVENTS[2*i+3]>>1)) {
	      color = 2
	      i += 1
	    }
	    
	    if(e < 0) {
	      //Create event
	      var id = -(e>>1) - 1
	
	      //Intersect with common
	      for(var j=0; j<commonActive; ++j) {
	        var retval = visit(COMMON_SWEEP_QUEUE[j], id)
	        if(retval !== void 0) {
	          return retval
	        }
	      }
	
	      if(color !== 0) {
	        //Intersect with red
	        for(var j=0; j<redActive; ++j) {
	          var retval = visit(RED_SWEEP_QUEUE[j], id)
	          if(retval !== void 0) {
	            return retval
	          }
	        }
	      }
	
	      if(color !== 1) {
	        //Intersect with blue
	        for(var j=0; j<blueActive; ++j) {
	          var retval = visit(BLUE_SWEEP_QUEUE[j], id)
	          if(retval !== void 0) {
	            return retval
	          }
	        }
	      }
	
	      if(color === 0) {
	        //Red
	        sqPush(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive++, id)
	      } else if(color === 1) {
	        //Blue
	        sqPush(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive++, id)
	      } else if(color === 2) {
	        //Both
	        sqPush(COMMON_SWEEP_QUEUE, COMMON_SWEEP_INDEX, commonActive++, id)
	      }
	    } else {
	      //Destroy event
	      var id = (e>>1) - 1
	      if(color === 0) {
	        //Red
	        sqPop(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive--, id)
	      } else if(color === 1) {
	        //Blue
	        sqPop(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive--, id)
	      } else if(color === 2) {
	        //Both
	        sqPop(COMMON_SWEEP_QUEUE, COMMON_SWEEP_INDEX, commonActive--, id)
	      }
	    }
	  }
	}
	
	//Sweep and prune/scanline algorithm:
	//  Scan along axis, detect intersections
	//  Brute force all boxes along axis
	function scanBipartite(
	  d, axis, visit, flip,
	  redStart,  redEnd, red, redIndex,
	  blueStart, blueEnd, blue, blueIndex) {
	  
	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = axis
	  var iend     = axis+d
	
	  var redShift  = 1
	  var blueShift = 1
	  if(flip) {
	    blueShift = BLUE_FLAG
	  } else {
	    redShift  = BLUE_FLAG
	  }
	
	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = i + redShift
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }
	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = i + blueShift
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	  }
	
	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive    = 0
	  for(var i=0; i<n; ++i) {
	    var e = SWEEP_EVENTS[2*i+1]|0
	    if(e < 0) {
	      var idx   = -e
	      var isRed = false
	      if(idx >= BLUE_FLAG) {
	        isRed = !flip
	        idx -= BLUE_FLAG 
	      } else {
	        isRed = !!flip
	        idx -= 1
	      }
	      if(isRed) {
	        sqPush(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive++, idx)
	      } else {
	        var blueId  = blueIndex[idx]
	        var bluePtr = elemSize * idx
	        
	        var b0 = blue[bluePtr+axis+1]
	        var b1 = blue[bluePtr+axis+1+d]
	
	red_loop:
	        for(var j=0; j<redActive; ++j) {
	          var oidx   = RED_SWEEP_QUEUE[j]
	          var redPtr = elemSize * oidx
	
	          if(b1 < red[redPtr+axis+1] || 
	             red[redPtr+axis+1+d] < b0) {
	            continue
	          }
	
	          for(var k=axis+2; k<d; ++k) {
	            if(blue[bluePtr + k + d] < red[redPtr + k] || 
	               red[redPtr + k + d] < blue[bluePtr + k]) {
	              continue red_loop
	            }
	          }
	
	          var redId  = redIndex[oidx]
	          var retval
	          if(flip) {
	            retval = visit(blueId, redId)
	          } else {
	            retval = visit(redId, blueId)
	          }
	          if(retval !== void 0) {
	            return retval 
	          }
	        }
	      }
	    } else {
	      sqPop(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive--, e - redShift)
	    }
	  }
	}
	
	function scanComplete(
	  d, axis, visit,
	  redStart,  redEnd, red, redIndex,
	  blueStart, blueEnd, blue, blueIndex) {
	
	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = axis
	  var iend     = axis+d
	
	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = i + BLUE_FLAG
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }
	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = i + 1
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	  }
	
	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive    = 0
	  for(var i=0; i<n; ++i) {
	    var e = SWEEP_EVENTS[2*i+1]|0
	    if(e < 0) {
	      var idx   = -e
	      if(idx >= BLUE_FLAG) {
	        RED_SWEEP_QUEUE[redActive++] = idx - BLUE_FLAG
	      } else {
	        idx -= 1
	        var blueId  = blueIndex[idx]
	        var bluePtr = elemSize * idx
	
	        var b0 = blue[bluePtr+axis+1]
	        var b1 = blue[bluePtr+axis+1+d]
	
	red_loop:
	        for(var j=0; j<redActive; ++j) {
	          var oidx   = RED_SWEEP_QUEUE[j]
	          var redId  = redIndex[oidx]
	
	          if(redId === blueId) {
	            break
	          }
	
	          var redPtr = elemSize * oidx
	          if(b1 < red[redPtr+axis+1] || 
	            red[redPtr+axis+1+d] < b0) {
	            continue
	          }
	          for(var k=axis+2; k<d; ++k) {
	            if(blue[bluePtr + k + d] < red[redPtr + k] || 
	               red[redPtr + k + d]   < blue[bluePtr + k]) {
	              continue red_loop
	            }
	          }
	
	          var retval = visit(redId, blueId)
	          if(retval !== void 0) {
	            return retval 
	          }
	        }
	      }
	    } else {
	      var idx = e - BLUE_FLAG
	      for(var j=redActive-1; j>=0; --j) {
	        if(RED_SWEEP_QUEUE[j] === idx) {
	          for(var k=j+1; k<redActive; ++k) {
	            RED_SWEEP_QUEUE[k-1] = RED_SWEEP_QUEUE[k]
	          }
	          break
	        }
	      }
	      --redActive
	    }
	  }
	}

/***/ },
/* 94 */
/***/ function(module, exports) {

	'use strict';
	
	//This code is extracted from ndarray-sort
	//It is inlined here as a temporary workaround
	
	module.exports = wrapper;
	
	var INSERT_SORT_CUTOFF = 32
	
	function wrapper(data, n0) {
	  if (n0 <= 4*INSERT_SORT_CUTOFF) {
	    insertionSort(0, n0 - 1, data);
	  } else {
	    quickSort(0, n0 - 1, data);
	  }
	}
	
	function insertionSort(left, right, data) {
	  var ptr = 2*(left+1)
	  for(var i=left+1; i<=right; ++i) {
	    var a = data[ptr++]
	    var b = data[ptr++]
	    var j = i
	    var jptr = ptr-2
	    while(j-- > left) {
	      var x = data[jptr-2]
	      var y = data[jptr-1]
	      if(x < a) {
	        break
	      } else if(x === a && y < b) {
	        break
	      }
	      data[jptr]   = x
	      data[jptr+1] = y
	      jptr -= 2
	    }
	    data[jptr]   = a
	    data[jptr+1] = b
	  }
	}
	
	function swap(i, j, data) {
	  i *= 2
	  j *= 2
	  var x = data[i]
	  var y = data[i+1]
	  data[i] = data[j]
	  data[i+1] = data[j+1]
	  data[j] = x
	  data[j+1] = y
	}
	
	function move(i, j, data) {
	  i *= 2
	  j *= 2
	  data[i] = data[j]
	  data[i+1] = data[j+1]
	}
	
	function rotate(i, j, k, data) {
	  i *= 2
	  j *= 2
	  k *= 2
	  var x = data[i]
	  var y = data[i+1]
	  data[i] = data[j]
	  data[i+1] = data[j+1]
	  data[j] = data[k]
	  data[j+1] = data[k+1]
	  data[k] = x
	  data[k+1] = y
	}
	
	function shufflePivot(i, j, px, py, data) {
	  i *= 2
	  j *= 2
	  data[i] = data[j]
	  data[j] = px
	  data[i+1] = data[j+1]
	  data[j+1] = py
	}
	
	function compare(i, j, data) {
	  i *= 2
	  j *= 2
	  var x = data[i],
	      y = data[j]
	  if(x < y) {
	    return false
	  } else if(x === y) {
	    return data[i+1] > data[j+1]
	  }
	  return true
	}
	
	function comparePivot(i, y, b, data) {
	  i *= 2
	  var x = data[i]
	  if(x < y) {
	    return true
	  } else if(x === y) {
	    return data[i+1] < b
	  }
	  return false
	}
	
	function quickSort(left, right, data) {
	  var sixth = (right - left + 1) / 6 | 0, 
	      index1 = left + sixth, 
	      index5 = right - sixth, 
	      index3 = left + right >> 1, 
	      index2 = index3 - sixth, 
	      index4 = index3 + sixth, 
	      el1 = index1, 
	      el2 = index2, 
	      el3 = index3, 
	      el4 = index4, 
	      el5 = index5, 
	      less = left + 1, 
	      great = right - 1, 
	      tmp = 0
	  if(compare(el1, el2, data)) {
	    tmp = el1
	    el1 = el2
	    el2 = tmp
	  }
	  if(compare(el4, el5, data)) {
	    tmp = el4
	    el4 = el5
	    el5 = tmp
	  }
	  if(compare(el1, el3, data)) {
	    tmp = el1
	    el1 = el3
	    el3 = tmp
	  }
	  if(compare(el2, el3, data)) {
	    tmp = el2
	    el2 = el3
	    el3 = tmp
	  }
	  if(compare(el1, el4, data)) {
	    tmp = el1
	    el1 = el4
	    el4 = tmp
	  }
	  if(compare(el3, el4, data)) {
	    tmp = el3
	    el3 = el4
	    el4 = tmp
	  }
	  if(compare(el2, el5, data)) {
	    tmp = el2
	    el2 = el5
	    el5 = tmp
	  }
	  if(compare(el2, el3, data)) {
	    tmp = el2
	    el2 = el3
	    el3 = tmp
	  }
	  if(compare(el4, el5, data)) {
	    tmp = el4
	    el4 = el5
	    el5 = tmp
	  }
	
	  var pivot1X = data[2*el2]
	  var pivot1Y = data[2*el2+1]
	  var pivot2X = data[2*el4]
	  var pivot2Y = data[2*el4+1]
	
	  var ptr0 = 2 * el1;
	  var ptr2 = 2 * el3;
	  var ptr4 = 2 * el5;
	  var ptr5 = 2 * index1;
	  var ptr6 = 2 * index3;
	  var ptr7 = 2 * index5;
	  for (var i1 = 0; i1 < 2; ++i1) {
	    var x = data[ptr0+i1];
	    var y = data[ptr2+i1];
	    var z = data[ptr4+i1];
	    data[ptr5+i1] = x;
	    data[ptr6+i1] = y;
	    data[ptr7+i1] = z;
	  }
	
	  move(index2, left, data)
	  move(index4, right, data)
	  for (var k = less; k <= great; ++k) {
	    if (comparePivot(k, pivot1X, pivot1Y, data)) {
	      if (k !== less) {
	        swap(k, less, data)
	      }
	      ++less;
	    } else {
	      if (!comparePivot(k, pivot2X, pivot2Y, data)) {
	        while (true) {
	          if (!comparePivot(great, pivot2X, pivot2Y, data)) {
	            if (--great < k) {
	              break;
	            }
	            continue;
	          } else {
	            if (comparePivot(great, pivot1X, pivot1Y, data)) {
	              rotate(k, less, great, data)
	              ++less;
	              --great;
	            } else {
	              swap(k, great, data)
	              --great;
	            }
	            break;
	          }
	        }
	      }
	    }
	  }
	  shufflePivot(left, less-1, pivot1X, pivot1Y, data)
	  shufflePivot(right, great+1, pivot2X, pivot2Y, data)
	  if (less - 2 - left <= INSERT_SORT_CUTOFF) {
	    insertionSort(left, less - 2, data);
	  } else {
	    quickSort(left, less - 2, data);
	  }
	  if (right - (great + 2) <= INSERT_SORT_CUTOFF) {
	    insertionSort(great + 2, right, data);
	  } else {
	    quickSort(great + 2, right, data);
	  }
	  if (great - less <= INSERT_SORT_CUTOFF) {
	    insertionSort(less, great, data);
	  } else {
	    quickSort(less, great, data);
	  }
	}

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	module.exports = boxIntersectIter
	
	var pool = __webpack_require__(86)
	var bits = __webpack_require__(91)
	var bruteForce = __webpack_require__(96)
	var bruteForcePartial = bruteForce.partial
	var bruteForceFull = bruteForce.full
	var sweep = __webpack_require__(93)
	var findMedian = __webpack_require__(97)
	var genPartition = __webpack_require__(98)
	
	//Twiddle parameters
	var BRUTE_FORCE_CUTOFF    = 128       //Cut off for brute force search
	var SCAN_CUTOFF           = (1<<22)   //Cut off for two way scan
	var SCAN_COMPLETE_CUTOFF  = (1<<22)  
	
	//Partition functions
	var partitionInteriorContainsInterval = genPartition(
	  '!(lo>=p0)&&!(p1>=hi)', 
	  ['p0', 'p1'])
	
	var partitionStartEqual = genPartition(
	  'lo===p0',
	  ['p0'])
	
	var partitionStartLessThan = genPartition(
	  'lo<p0',
	  ['p0'])
	
	var partitionEndLessThanEqual = genPartition(
	  'hi<=p0',
	  ['p0'])
	
	var partitionContainsPoint = genPartition(
	  'lo<=p0&&p0<=hi',
	  ['p0'])
	
	var partitionContainsPointProper = genPartition(
	  'lo<p0&&p0<=hi',
	  ['p0'])
	
	//Frame size for iterative loop
	var IFRAME_SIZE = 6
	var DFRAME_SIZE = 2
	
	//Data for box statck
	var INIT_CAPACITY = 1024
	var BOX_ISTACK  = pool.mallocInt32(INIT_CAPACITY)
	var BOX_DSTACK  = pool.mallocDouble(INIT_CAPACITY)
	
	//Initialize iterative loop queue
	function iterInit(d, count) {
	  var levels = (8 * bits.log2(count+1) * (d+1))|0
	  var maxInts = bits.nextPow2(IFRAME_SIZE*levels)
	  if(BOX_ISTACK.length < maxInts) {
	    pool.free(BOX_ISTACK)
	    BOX_ISTACK = pool.mallocInt32(maxInts)
	  }
	  var maxDoubles = bits.nextPow2(DFRAME_SIZE*levels)
	  if(BOX_DSTACK < maxDoubles) {
	    pool.free(BOX_DSTACK)
	    BOX_DSTACK = pool.mallocDouble(maxDoubles)
	  }
	}
	
	//Append item to queue
	function iterPush(ptr,
	  axis, 
	  redStart, redEnd, 
	  blueStart, blueEnd, 
	  state, 
	  lo, hi) {
	
	  var iptr = IFRAME_SIZE * ptr
	  BOX_ISTACK[iptr]   = axis
	  BOX_ISTACK[iptr+1] = redStart
	  BOX_ISTACK[iptr+2] = redEnd
	  BOX_ISTACK[iptr+3] = blueStart
	  BOX_ISTACK[iptr+4] = blueEnd
	  BOX_ISTACK[iptr+5] = state
	
	  var dptr = DFRAME_SIZE * ptr
	  BOX_DSTACK[dptr]   = lo
	  BOX_DSTACK[dptr+1] = hi
	}
	
	//Special case:  Intersect single point with list of intervals
	function onePointPartial(
	  d, axis, visit, flip,
	  redStart, redEnd, red, redIndex,
	  blueOffset, blue, blueId) {
	
	  var elemSize = 2 * d
	  var bluePtr  = blueOffset * elemSize
	  var blueX    = blue[bluePtr + axis]
	
	red_loop:
	  for(var i=redStart, redPtr=redStart*elemSize; i<redEnd; ++i, redPtr+=elemSize) {
	    var r0 = red[redPtr+axis]
	    var r1 = red[redPtr+axis+d]
	    if(blueX < r0 || r1 < blueX) {
	      continue
	    }
	    if(flip && blueX === r0) {
	      continue
	    }
	    var redId = redIndex[i]
	    for(var j=axis+1; j<d; ++j) {
	      var r0 = red[redPtr+j]
	      var r1 = red[redPtr+j+d]
	      var b0 = blue[bluePtr+j]
	      var b1 = blue[bluePtr+j+d]
	      if(r1 < b0 || b1 < r0) {
	        continue red_loop
	      }
	    }
	    var retval
	    if(flip) {
	      retval = visit(blueId, redId)
	    } else {
	      retval = visit(redId, blueId)
	    }
	    if(retval !== void 0) {
	      return retval
	    }
	  }
	}
	
	//Special case:  Intersect one point with list of intervals
	function onePointFull(
	  d, axis, visit,
	  redStart, redEnd, red, redIndex,
	  blueOffset, blue, blueId) {
	
	  var elemSize = 2 * d
	  var bluePtr  = blueOffset * elemSize
	  var blueX    = blue[bluePtr + axis]
	
	red_loop:
	  for(var i=redStart, redPtr=redStart*elemSize; i<redEnd; ++i, redPtr+=elemSize) {
	    var redId = redIndex[i]
	    if(redId === blueId) {
	      continue
	    }
	    var r0 = red[redPtr+axis]
	    var r1 = red[redPtr+axis+d]
	    if(blueX < r0 || r1 < blueX) {
	      continue
	    }
	    for(var j=axis+1; j<d; ++j) {
	      var r0 = red[redPtr+j]
	      var r1 = red[redPtr+j+d]
	      var b0 = blue[bluePtr+j]
	      var b1 = blue[bluePtr+j+d]
	      if(r1 < b0 || b1 < r0) {
	        continue red_loop
	      }
	    }
	    var retval = visit(redId, blueId)
	    if(retval !== void 0) {
	      return retval
	    }
	  }
	}
	
	//The main box intersection routine
	function boxIntersectIter(
	  d, visit, initFull,
	  xSize, xBoxes, xIndex,
	  ySize, yBoxes, yIndex) {
	
	  //Reserve memory for stack
	  iterInit(d, xSize + ySize)
	
	  var top  = 0
	  var elemSize = 2 * d
	  var retval
	
	  iterPush(top++,
	      0,
	      0, xSize,
	      0, ySize,
	      initFull ? 16 : 0, 
	      -Infinity, Infinity)
	  if(!initFull) {
	    iterPush(top++,
	      0,
	      0, ySize,
	      0, xSize,
	      1, 
	      -Infinity, Infinity)
	  }
	
	  while(top > 0) {
	    top  -= 1
	
	    var iptr = top * IFRAME_SIZE
	    var axis      = BOX_ISTACK[iptr]
	    var redStart  = BOX_ISTACK[iptr+1]
	    var redEnd    = BOX_ISTACK[iptr+2]
	    var blueStart = BOX_ISTACK[iptr+3]
	    var blueEnd   = BOX_ISTACK[iptr+4]
	    var state     = BOX_ISTACK[iptr+5]
	
	    var dptr = top * DFRAME_SIZE
	    var lo        = BOX_DSTACK[dptr]
	    var hi        = BOX_DSTACK[dptr+1]
	
	    //Unpack state info
	    var flip      = (state & 1)
	    var full      = !!(state & 16)
	
	    //Unpack indices
	    var red       = xBoxes
	    var redIndex  = xIndex
	    var blue      = yBoxes
	    var blueIndex = yIndex
	    if(flip) {
	      red         = yBoxes
	      redIndex    = yIndex
	      blue        = xBoxes
	      blueIndex   = xIndex
	    }
	
	    if(state & 2) {
	      redEnd = partitionStartLessThan(
	        d, axis,
	        redStart, redEnd, red, redIndex,
	        hi)
	      if(redStart >= redEnd) {
	        continue
	      }
	    }
	    if(state & 4) {
	      redStart = partitionEndLessThanEqual(
	        d, axis,
	        redStart, redEnd, red, redIndex,
	        lo)
	      if(redStart >= redEnd) {
	        continue
	      }
	    }
	    
	    var redCount  = redEnd  - redStart
	    var blueCount = blueEnd - blueStart
	
	    if(full) {
	      if(d * redCount * (redCount + blueCount) < SCAN_COMPLETE_CUTOFF) {
	        retval = sweep.scanComplete(
	          d, axis, visit, 
	          redStart, redEnd, red, redIndex,
	          blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	        continue
	      }
	    } else {
	      if(d * Math.min(redCount, blueCount) < BRUTE_FORCE_CUTOFF) {
	        //If input small, then use brute force
	        retval = bruteForcePartial(
	            d, axis, visit, flip,
	            redStart,  redEnd,  red,  redIndex,
	            blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	        continue
	      } else if(d * redCount * blueCount < SCAN_CUTOFF) {
	        //If input medium sized, then use sweep and prune
	        retval = sweep.scanBipartite(
	          d, axis, visit, flip, 
	          redStart, redEnd, red, redIndex,
	          blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	        continue
	      }
	    }
	    
	    //First, find all red intervals whose interior contains (lo,hi)
	    var red0 = partitionInteriorContainsInterval(
	      d, axis, 
	      redStart, redEnd, red, redIndex,
	      lo, hi)
	
	    //Lower dimensional case
	    if(redStart < red0) {
	
	      if(d * (red0 - redStart) < BRUTE_FORCE_CUTOFF) {
	        //Special case for small inputs: use brute force
	        retval = bruteForceFull(
	          d, axis+1, visit,
	          redStart, red0, red, redIndex,
	          blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	      } else if(axis === d-2) {
	        if(flip) {
	          retval = sweep.sweepBipartite(
	            d, visit,
	            blueStart, blueEnd, blue, blueIndex,
	            redStart, red0, red, redIndex)
	        } else {
	          retval = sweep.sweepBipartite(
	            d, visit,
	            redStart, red0, red, redIndex,
	            blueStart, blueEnd, blue, blueIndex)
	        }
	        if(retval !== void 0) {
	          return retval
	        }
	      } else {
	        iterPush(top++,
	          axis+1,
	          redStart, red0,
	          blueStart, blueEnd,
	          flip,
	          -Infinity, Infinity)
	        iterPush(top++,
	          axis+1,
	          blueStart, blueEnd,
	          redStart, red0,
	          flip^1,
	          -Infinity, Infinity)
	      }
	    }
	
	    //Divide and conquer phase
	    if(red0 < redEnd) {
	
	      //Cut blue into 3 parts:
	      //
	      //  Points < mid point
	      //  Points = mid point
	      //  Points > mid point
	      //
	      var blue0 = findMedian(
	        d, axis, 
	        blueStart, blueEnd, blue, blueIndex)
	      var mid = blue[elemSize * blue0 + axis]
	      var blue1 = partitionStartEqual(
	        d, axis,
	        blue0, blueEnd, blue, blueIndex,
	        mid)
	
	      //Right case
	      if(blue1 < blueEnd) {
	        iterPush(top++,
	          axis,
	          red0, redEnd,
	          blue1, blueEnd,
	          (flip|4) + (full ? 16 : 0),
	          mid, hi)
	      }
	
	      //Left case
	      if(blueStart < blue0) {
	        iterPush(top++,
	          axis,
	          red0, redEnd,
	          blueStart, blue0,
	          (flip|2) + (full ? 16 : 0),
	          lo, mid)
	      }
	
	      //Center case (the hard part)
	      if(blue0 + 1 === blue1) {
	        //Optimization: Range with exactly 1 point, use a brute force scan
	        if(full) {
	          retval = onePointFull(
	            d, axis, visit,
	            red0, redEnd, red, redIndex,
	            blue0, blue, blueIndex[blue0])
	        } else {
	          retval = onePointPartial(
	            d, axis, visit, flip,
	            red0, redEnd, red, redIndex,
	            blue0, blue, blueIndex[blue0])
	        }
	        if(retval !== void 0) {
	          return retval
	        }
	      } else if(blue0 < blue1) {
	        var red1
	        if(full) {
	          //If full intersection, need to handle special case
	          red1 = partitionContainsPoint(
	            d, axis,
	            red0, redEnd, red, redIndex,
	            mid)
	          if(red0 < red1) {
	            var redX = partitionStartEqual(
	              d, axis,
	              red0, red1, red, redIndex,
	              mid)
	            if(axis === d-2) {
	              //Degenerate sweep intersection:
	              //  [red0, redX] with [blue0, blue1]
	              if(red0 < redX) {
	                retval = sweep.sweepComplete(
	                  d, visit,
	                  red0, redX, red, redIndex,
	                  blue0, blue1, blue, blueIndex)
	                if(retval !== void 0) {
	                  return retval
	                }
	              }
	
	              //Normal sweep intersection:
	              //  [redX, red1] with [blue0, blue1]
	              if(redX < red1) {
	                retval = sweep.sweepBipartite(
	                  d, visit,
	                  redX, red1, red, redIndex,
	                  blue0, blue1, blue, blueIndex)
	                if(retval !== void 0) {
	                  return retval
	                }
	              }
	            } else {
	              if(red0 < redX) {
	                iterPush(top++,
	                  axis+1,
	                  red0, redX,
	                  blue0, blue1,
	                  16,
	                  -Infinity, Infinity)
	              }
	              if(redX < red1) {
	                iterPush(top++,
	                  axis+1,
	                  redX, red1,
	                  blue0, blue1,
	                  0,
	                  -Infinity, Infinity)
	                iterPush(top++,
	                  axis+1,
	                  blue0, blue1,
	                  redX, red1,
	                  1,
	                  -Infinity, Infinity)
	              }
	            }
	          }
	        } else {
	          if(flip) {
	            red1 = partitionContainsPointProper(
	              d, axis,
	              red0, redEnd, red, redIndex,
	              mid)
	          } else {
	            red1 = partitionContainsPoint(
	              d, axis,
	              red0, redEnd, red, redIndex,
	              mid)
	          }
	          if(red0 < red1) {
	            if(axis === d-2) {
	              if(flip) {
	                retval = sweep.sweepBipartite(
	                  d, visit,
	                  blue0, blue1, blue, blueIndex,
	                  red0, red1, red, redIndex)
	              } else {
	                retval = sweep.sweepBipartite(
	                  d, visit,
	                  red0, red1, red, redIndex,
	                  blue0, blue1, blue, blueIndex)
	              }
	            } else {
	              iterPush(top++,
	                axis+1,
	                red0, red1,
	                blue0, blue1,
	                flip,
	                -Infinity, Infinity)
	              iterPush(top++,
	                axis+1,
	                blue0, blue1,
	                red0, red1,
	                flip^1,
	                -Infinity, Infinity)
	            }
	          }
	        }
	      }
	    }
	  }
	}

/***/ },
/* 96 */
/***/ function(module, exports) {

	'use strict'
	
	var DIMENSION   = 'd'
	var AXIS        = 'ax'
	var VISIT       = 'vv'
	var FLIP        = 'fp'
	
	var ELEM_SIZE   = 'es'
	
	var RED_START   = 'rs'
	var RED_END     = 're'
	var RED_BOXES   = 'rb'
	var RED_INDEX   = 'ri'
	var RED_PTR     = 'rp'
	
	var BLUE_START  = 'bs'
	var BLUE_END    = 'be'
	var BLUE_BOXES  = 'bb'
	var BLUE_INDEX  = 'bi'
	var BLUE_PTR    = 'bp'
	
	var RETVAL      = 'rv'
	
	var INNER_LABEL = 'Q'
	
	var ARGS = [
	  DIMENSION,
	  AXIS,
	  VISIT,
	  RED_START,
	  RED_END,
	  RED_BOXES,
	  RED_INDEX,
	  BLUE_START,
	  BLUE_END,
	  BLUE_BOXES,
	  BLUE_INDEX
	]
	
	function generateBruteForce(redMajor, flip, full) {
	  var funcName = 'bruteForce' + 
	    (redMajor ? 'Red' : 'Blue') + 
	    (flip ? 'Flip' : '') +
	    (full ? 'Full' : '')
	
	  var code = ['function ', funcName, '(', ARGS.join(), '){',
	    'var ', ELEM_SIZE, '=2*', DIMENSION, ';']
	
	  var redLoop = 
	    'for(var i=' + RED_START + ',' + RED_PTR + '=' + ELEM_SIZE + '*' + RED_START + ';' +
	        'i<' + RED_END +';' +
	        '++i,' + RED_PTR + '+=' + ELEM_SIZE + '){' +
	        'var x0=' + RED_BOXES + '[' + AXIS + '+' + RED_PTR + '],' +
	            'x1=' + RED_BOXES + '[' + AXIS + '+' + RED_PTR + '+' + DIMENSION + '],' +
	            'xi=' + RED_INDEX + '[i];'
	
	  var blueLoop = 
	    'for(var j=' + BLUE_START + ',' + BLUE_PTR + '=' + ELEM_SIZE + '*' + BLUE_START + ';' +
	        'j<' + BLUE_END + ';' +
	        '++j,' + BLUE_PTR + '+=' + ELEM_SIZE + '){' +
	        'var y0=' + BLUE_BOXES + '[' + AXIS + '+' + BLUE_PTR + '],' +
	            (full ? 'y1=' + BLUE_BOXES + '[' + AXIS + '+' + BLUE_PTR + '+' + DIMENSION + '],' : '') +
	            'yi=' + BLUE_INDEX + '[j];'
	
	  if(redMajor) {
	    code.push(redLoop, INNER_LABEL, ':', blueLoop)
	  } else {
	    code.push(blueLoop, INNER_LABEL, ':', redLoop)
	  }
	
	  if(full) {
	    code.push('if(y1<x0||x1<y0)continue;')
	  } else if(flip) {
	    code.push('if(y0<=x0||x1<y0)continue;')
	  } else {
	    code.push('if(y0<x0||x1<y0)continue;')
	  }
	
	  code.push('for(var k='+AXIS+'+1;k<'+DIMENSION+';++k){'+
	    'var r0='+RED_BOXES+'[k+'+RED_PTR+'],'+
	        'r1='+RED_BOXES+'[k+'+DIMENSION+'+'+RED_PTR+'],'+
	        'b0='+BLUE_BOXES+'[k+'+BLUE_PTR+'],'+
	        'b1='+BLUE_BOXES+'[k+'+DIMENSION+'+'+BLUE_PTR+'];'+
	      'if(r1<b0||b1<r0)continue ' + INNER_LABEL + ';}' +
	      'var ' + RETVAL + '=' + VISIT + '(')
	
	  if(flip) {
	    code.push('yi,xi')
	  } else {
	    code.push('xi,yi')
	  }
	
	  code.push(');if(' + RETVAL + '!==void 0)return ' + RETVAL + ';}}}')
	
	  return {
	    name: funcName, 
	    code: code.join('')
	  }
	}
	
	function bruteForcePlanner(full) {
	  var funcName = 'bruteForce' + (full ? 'Full' : 'Partial')
	  var prefix = []
	  var fargs = ARGS.slice()
	  if(!full) {
	    fargs.splice(3, 0, FLIP)
	  }
	
	  var code = ['function ' + funcName + '(' + fargs.join() + '){']
	
	  function invoke(redMajor, flip) {
	    var res = generateBruteForce(redMajor, flip, full)
	    prefix.push(res.code)
	    code.push('return ' + res.name + '(' + ARGS.join() + ');')
	  }
	
	  code.push('if(' + RED_END + '-' + RED_START + '>' +
	                    BLUE_END + '-' + BLUE_START + '){')
	
	  if(full) {
	    invoke(true, false)
	    code.push('}else{')
	    invoke(false, false)
	  } else {
	    code.push('if(' + FLIP + '){')
	    invoke(true, true)
	    code.push('}else{')
	    invoke(true, false)
	    code.push('}}else{if(' + FLIP + '){')
	    invoke(false, true)
	    code.push('}else{')
	    invoke(false, false)
	    code.push('}')
	  }
	  code.push('}}return ' + funcName)
	
	  var codeStr = prefix.join('') + code.join('')
	  var proc = new Function(codeStr)
	  return proc()
	}
	
	
	exports.partial = bruteForcePlanner(false)
	exports.full    = bruteForcePlanner(true)

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	module.exports = findMedian
	
	var genPartition = __webpack_require__(98)
	
	var partitionStartLessThan = genPartition('lo<p0', ['p0'])
	
	var PARTITION_THRESHOLD = 8   //Cut off for using insertion sort in findMedian
	
	//Base case for median finding:  Use insertion sort
	function insertionSort(d, axis, start, end, boxes, ids) {
	  var elemSize = 2 * d
	  var boxPtr = elemSize * (start+1) + axis
	  for(var i=start+1; i<end; ++i, boxPtr+=elemSize) {
	    var x = boxes[boxPtr]
	    for(var j=i, ptr=elemSize*(i-1); 
	        j>start && boxes[ptr+axis] > x; 
	        --j, ptr-=elemSize) {
	      //Swap
	      var aPtr = ptr
	      var bPtr = ptr+elemSize
	      for(var k=0; k<elemSize; ++k, ++aPtr, ++bPtr) {
	        var y = boxes[aPtr]
	        boxes[aPtr] = boxes[bPtr]
	        boxes[bPtr] = y
	      }
	      var tmp = ids[j]
	      ids[j] = ids[j-1]
	      ids[j-1] = tmp
	    }
	  }
	}
	
	//Find median using quick select algorithm
	//  takes O(n) time with high probability
	function findMedian(d, axis, start, end, boxes, ids) {
	  if(end <= start+1) {
	    return start
	  }
	
	  var lo       = start
	  var hi       = end
	  var mid      = ((end + start) >>> 1)
	  var elemSize = 2*d
	  var pivot    = mid
	  var value    = boxes[elemSize*mid+axis]
	  
	  while(lo < hi) {
	    if(hi - lo < PARTITION_THRESHOLD) {
	      insertionSort(d, axis, lo, hi, boxes, ids)
	      value = boxes[elemSize*mid+axis]
	      break
	    }
	    
	    //Select pivot using median-of-3
	    var count  = hi - lo
	    var pivot0 = (Math.random()*count+lo)|0
	    var value0 = boxes[elemSize*pivot0 + axis]
	    var pivot1 = (Math.random()*count+lo)|0
	    var value1 = boxes[elemSize*pivot1 + axis]
	    var pivot2 = (Math.random()*count+lo)|0
	    var value2 = boxes[elemSize*pivot2 + axis]
	    if(value0 <= value1) {
	      if(value2 >= value1) {
	        pivot = pivot1
	        value = value1
	      } else if(value0 >= value2) {
	        pivot = pivot0
	        value = value0
	      } else {
	        pivot = pivot2
	        value = value2
	      }
	    } else {
	      if(value1 >= value2) {
	        pivot = pivot1
	        value = value1
	      } else if(value2 >= value0) {
	        pivot = pivot0
	        value = value0
	      } else {
	        pivot = pivot2
	        value = value2
	      }
	    }
	
	    //Swap pivot to end of array
	    var aPtr = elemSize * (hi-1)
	    var bPtr = elemSize * pivot
	    for(var i=0; i<elemSize; ++i, ++aPtr, ++bPtr) {
	      var x = boxes[aPtr]
	      boxes[aPtr] = boxes[bPtr]
	      boxes[bPtr] = x
	    }
	    var y = ids[hi-1]
	    ids[hi-1] = ids[pivot]
	    ids[pivot] = y
	
	    //Partition using pivot
	    pivot = partitionStartLessThan(
	      d, axis, 
	      lo, hi-1, boxes, ids,
	      value)
	
	    //Swap pivot back
	    var aPtr = elemSize * (hi-1)
	    var bPtr = elemSize * pivot
	    for(var i=0; i<elemSize; ++i, ++aPtr, ++bPtr) {
	      var x = boxes[aPtr]
	      boxes[aPtr] = boxes[bPtr]
	      boxes[bPtr] = x
	    }
	    var y = ids[hi-1]
	    ids[hi-1] = ids[pivot]
	    ids[pivot] = y
	
	    //Swap pivot to last pivot
	    if(mid < pivot) {
	      hi = pivot-1
	      while(lo < hi && 
	        boxes[elemSize*(hi-1)+axis] === value) {
	        hi -= 1
	      }
	      hi += 1
	    } else if(pivot < mid) {
	      lo = pivot + 1
	      while(lo < hi &&
	        boxes[elemSize*lo+axis] === value) {
	        lo += 1
	      }
	    } else {
	      break
	    }
	  }
	
	  //Make sure pivot is at start
	  return partitionStartLessThan(
	    d, axis, 
	    start, mid, boxes, ids,
	    boxes[elemSize*mid+axis])
	}

/***/ },
/* 98 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = genPartition
	
	var code = 'for(var j=2*a,k=j*c,l=k,m=c,n=b,o=a+b,p=c;d>p;++p,k+=j){var _;if($)if(m===p)m+=1,l+=j;else{for(var s=0;j>s;++s){var t=e[k+s];e[k+s]=e[l],e[l++]=t}var u=f[p];f[p]=f[m],f[m++]=u}}return m'
	
	function genPartition(predicate, args) {
	  var fargs ='abcdef'.split('').concat(args)
	  var reads = []
	  if(predicate.indexOf('lo') >= 0) {
	    reads.push('lo=e[k+n]')
	  }
	  if(predicate.indexOf('hi') >= 0) {
	    reads.push('hi=e[k+o]')
	  }
	  fargs.push(
	    code.replace('_', reads.join())
	        .replace('$', predicate))
	  return Function.apply(void 0, fargs)
	}

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("constrainPositionSearch", ["position", "size", "constrainPosition"]);
	  ecs.addEach(function constrainTocontrainPosition(entity) {
	    var position = game.entities.getComponent(entity, "position");
	    var size = game.entities.getComponent(entity, "size");
	
	    var constrainPosition = game.entities.getComponent(entity, "constrainPosition");
	    var other = constrainPosition.id;
	    var otherPosition = game.entities.getComponent(other, "position");
	    var otherSize = game.entities.getComponent(other, "size");
	
	    if (position.x < otherPosition.x) {
	      position.x = otherPosition.x;
	    }
	    if (position.x + size.width > otherPosition.x + otherSize.width) {
	      position.x = otherPosition.x + otherSize.width - size.width;
	    }
	    if (position.y < otherPosition.y) {
	      position.y = otherPosition.y;
	    }
	    if (position.y + size.height > otherPosition.y + otherSize.height) {
	      position.y = otherPosition.y + otherSize.height - size.height;
	    }
	  }, "constrainPositionSearch");
	};


/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("controlPlayer", ["movement2d", "playerController2d"]);
	  ecs.addEach(function controlPlayer(entity) {
	    var movement2d = game.entities.getComponent(entity, "movement2d");
	    var playerController2d = game.entities.getComponent(entity, "playerController2d");
	    movement2d.up = game.inputs.button(playerController2d.up);
	    movement2d.down = game.inputs.button(playerController2d.down);
	    movement2d.left = game.inputs.button(playerController2d.left);
	    movement2d.right = game.inputs.button(playerController2d.right);
	  }, "controlPlayer");
	};


/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  ecs.addEach(function decayLifeSpan(entity, elapsed) {
	    var lifeSpan = game.entities.getComponent(entity, "lifeSpan");
	    lifeSpan.current += elapsed;
	    if (lifeSpan.current >= lifeSpan.max) {
	      game.entities.destroy(entity);
	    }
	  }, "lifeSpan");
	};


/***/ },
/* 102 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
	    var position = game.entities.getComponent(entity, "position");
	    var camera = game.entities.find("camera")[0];
	    var cameraPosition = game.entities.getComponent(camera, "position");
	    position.x = cameraPosition.x + game.inputs.mouse.x;
	    position.y = cameraPosition.y + game.inputs.mouse.y;
	  }, "followMouse");
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var distanceSquared = __webpack_require__(104).distanceSquared;
	
	module.exports = function(ecs, game) {
	  game.entities.registerSearch("followParent", ["position", "size", "follow"]);
	  ecs.addEach(function followParent(entity) {
	    var position = game.entities.getComponent(entity, "position");
	    var follow = game.entities.getComponent(entity, "follow");
	    var size = game.entities.getComponent(entity, "size");
	
	    var x1 = position.x + (size.width / 2);
	    var y1 = position.y + (size.height / 2);
	
	    var parent = follow.id;
	    if (game.entities.getComponent(parent, "id") === undefined) {
	      return;
	    }
	    var parentPosition = game.entities.getComponent(parent, "position");
	    var parentSize = game.entities.getComponent(parent, "size");
	
	    var x2 = parentPosition.x + (parentSize.width / 2);
	    var y2 = parentPosition.y + (parentSize.height / 2);
	
	    var angle = Math.atan2(y2 - y1, x2 - x1);
	    var rotation = game.entities.getComponent(entity, "rotation");
	    if (rotation !== undefined) {
	      rotation.angle = angle - (Math.PI / 2);
	    }
	
	    var distSquared = distanceSquared(x1, y1, x2, y2);
	    if (distSquared < follow.distance * follow.distance) {
	      return;
	    }
	
	    var toMove = Math.sqrt(distSquared) - follow.distance;
	
	    position.x += toMove * Math.cos(angle);
	    position.y += toMove * Math.sin(angle);
	  }, "followParent");
	};


/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports.distanceSquared = function distanceSquared(x1, y1, x2, y2) {
	  return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
	};


/***/ },
/* 105 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("matchAspectRatioSearch", ["matchAspectRatio", "size"]);
	  ecs.addEach(function matchCanvasSize(entity) {
	    var size = game.entities.getComponent(entity, "size");
	
	    var match = game.entities.getComponent(entity, "matchAspectRatio").id;
	    var matchSize = game.entities.getComponent(match, "size");
	    if (matchSize === undefined) {
	      return;
	    }
	
	    var matchAspectRatio = matchSize.width / matchSize.height;
	
	    var currentAspectRatio = size.width / size.height;
	    if (currentAspectRatio > matchAspectRatio) {
	      size.height = Math.floor(size.width / matchAspectRatio);
	    } else if (currentAspectRatio < matchAspectRatio) {
	      size.width = Math.floor(size.height * matchAspectRatio);
	    }
	  }, "matchAspectRatioSearch");
	};


/***/ },
/* 106 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  ecs.addEach(function matchCanvasSize(entity) {
	    var size = game.entities.addComponent(entity, "size");
	    size.width = game.canvas.width;
	    size.height = game.canvas.height;
	  }, "matchCanvasSize");
	};


/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("matchCenterXSearch", ["matchCenter", "size", "position"]);
	  ecs.addEach(function matchCenterX(entity) {
	    var position = game.entities.getComponent(entity, "position");
	    var size = game.entities.getComponent(entity, "size");
	
	    var matchCenter = game.entities.getComponent(entity, "matchCenter");
	
	    var idX = matchCenter.x;
	    if (idX === undefined) {
	      idX = matchCenter.id;
	    }
	    if (idX !== undefined) {
	      verifyTarget(game, idX, adjustX, position, size);
	    }
	
	    var idY = matchCenter.y;
	    if (idY === undefined) {
	      idY = matchCenter.id;
	    }
	    if (idY !== undefined) {
	      verifyTarget(game, idY, adjustY, position, size);
	    }
	  }, "matchCenterXSearch");
	};
	
	function verifyTarget(game, target, fn, position, size) {
	  var matchPosition = game.entities.getComponent(target, "position");
	  if (matchPosition === undefined) {
	    return;
	  }
	  var matchSize = game.entities.getComponent(target, "size");
	  if (matchSize === undefined) {
	    return;
	  }
	
	  fn(position, size, matchPosition, matchSize);
	}
	
	function adjustX(position, size, matchPosition, matchSize) {
	  position.x = matchPosition.x + (matchSize.width / 2) - (size.width / 2);
	}
	
	function adjustY(position, size, matchPosition, matchSize) {
	  position.y = matchPosition.y + (matchSize.height / 2) - (size.height / 2);
	}


/***/ },
/* 108 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("matchParent", ["position", "match"]);
	  ecs.addEach(function matchParent(entity) {
	    var match = game.entities.getComponent(entity, "match");
	
	    var parentPosition = game.entities.getComponent(match.id, "position");
	    if (parentPosition === undefined) {
	      return;
	    }
	
	    var position = game.entities.addComponent(entity, "position");
	    position.x = parentPosition.x + match.offsetX;
	    position.y = parentPosition.y + match.offsetY;
	    position.z = parentPosition.z + match.offsetZ;
	  }, "matchParent");
	};


/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = function(ecs, game) {
	  game.entities.registerSearch("setVirtualButtons", ["virtualButton", "position", "size"]);
	  ecs.addEach(function setVirtualButtons(entity) {
	    var virtualButton = game.entities.getComponent(entity, "virtualButton");
	    var position = game.entities.getComponent(entity, "position");
	    var size = game.entities.getComponent(entity, "size");
	
	    var camera = game.entities.find("camera")[0];
	    var cameraPosition = { x: 0, y: 0 };
	    if (camera !== undefined) {
	      cameraPosition = game.entities.getComponent(camera, "position");
	    }
	
	    for (var i = 0; i < game.inputs.mouse.touches.length; i++) {
	      var t = game.inputs.mouse.touches[i];
	      var tx = t.x + cameraPosition.x;
	      var ty = t.y + cameraPosition.y;
	      if (tx >= position.x && tx < position.x + size.width && ty >= position.y && ty < position.y + size.height) {
	        game.inputs.setButton(virtualButton, entity, true);
	        return true;
	      }
	    }
	    game.inputs.setButton(virtualButton, entity, false);
	  }, "setVirtualButtons");
	};


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./renderer/render-loading-bar.js": 111,
		"./renderer/tile-background.js": 112
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 110;


/***/ },
/* 111 */
/***/ function(module, exports) {

	
	function percentLoaded(game) {
	  if (game.images.totalBytes() + game.sounds.assets.totalBytes() === 0) {
	    return 1;
	  }
	  return (game.images.bytesLoaded() + game.sounds.assets.bytesLoaded()) / (game.images.totalBytes() + game.sounds.assets.totalBytes());
	}
	
	module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	  ecs.add(function renderLoadingBar(entity, elapsed) { // eslint-disable-line no-unused-vars
	    game.context.fillStyle = "#000000";
	    game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	
	    var quarterWidth = Math.floor(game.canvas.width / 4);
	    var halfWidth = Math.floor(game.canvas.width / 2);
	    var halfHeight = Math.floor(game.canvas.height / 2);
	
	    game.context.fillStyle = "#ffffff";
	    game.context.fillRect(quarterWidth, halfHeight - 15, halfWidth, 30);
	
	    game.context.fillStyle = "#000000";
	    game.context.fillRect(quarterWidth + 3, halfHeight - 12, halfWidth - 6, 24);
	
	    var loaded = percentLoaded(game);
	
	    game.context.fillStyle = "#ffffff";
	    var barWidth = (halfWidth - 6) * loaded;
	    game.context.fillRect(quarterWidth + 3, halfHeight - 12, barWidth, 24);
	
	    if (loaded === 1) {
	      game.switchScene("title");
	    }
	  });
	};


/***/ },
/* 112 */
/***/ function(module, exports) {

	"use strict";
	
	var time = 0;
	var rowHeight = 60;
	var waveHeight = 20;
	var wavePeriod = 4000;
	var rowsBeforeRepeat = 8;
	var rowsOffset = Math.PI * 2 / rowsBeforeRepeat;
	
	module.exports = function(ecs, game) {
	  ecs.add(function tileBackground(entities, elapsed) {
	    var camera = 1;
	    var cameraPosition = game.entities.getComponent(camera, "position");
	    var cameraSize = game.entities.getComponent(camera, "size");
	
	    game.context.fillStyle = "#1c325f";
	    game.context.fillRect(Math.floor(cameraPosition.x), Math.floor(cameraPosition.y), cameraSize.width, cameraSize.height);
	
	    time += elapsed;
	
	    var f1 = game.images.get("waves.png");
	
	    var startX = Math.floor(cameraPosition.x / f1.width) * f1.width;
	    var startRow = Math.floor(cameraPosition.y / rowHeight);
	    var startY = (startRow - 1) * rowHeight;
	
	    for (var y = startY; y <= cameraPosition.y + cameraSize.height; y += rowHeight) {
	      var even = Math.floor(y / rowHeight) % 2;
	      var offset = y / rowHeight % rowsBeforeRepeat * rowsOffset;
	      var waveY = y + Math.sin(time / wavePeriod * Math.PI * 2 + offset) * waveHeight;
	
	      for (var x = startX; x <= cameraPosition.x + cameraSize.width + f1.width; x += f1.width) {
	        var waveX = x + Math.sin(time / wavePeriod * 2 * Math.PI * 2 + offset) * waveHeight / 2;
	        game.context.drawImage(f1, even ? waveX : waveX - 100, waveY, f1.width, f1.height);
	      }
	    }
	  });
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./title-enter.js": 114,
		"./title-exit.js": 115
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 113;


/***/ },
/* 114 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function(game) { // eslint-disable-line no-unused-vars
	  game.sounds.play("ambient-sea-track.mp3", {
	    "loopStart": 0,
	    "loopEnd": 0
	  });
	};


/***/ },
/* 115 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function(game) { // eslint-disable-line no-unused-vars
	};


/***/ },
/* 116 */
/***/ function(module, exports) {

	function webpackContext(req) {
		throw new Error("Cannot find module '" + req + "'.");
	}
	webpackContext.keys = function() { return []; };
	webpackContext.resolve = webpackContext;
	module.exports = webpackContext;
	webpackContext.id = 116;


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./waves.png": 118
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 117;


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/waves.png";

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./ambient-sea-track.mp3": 120
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 119;


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "sounds/ambient-sea-track.mp3";

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./animations.json": 122,
		"./components.json": 123,
		"./entities.json": 124,
		"./inputs.json": 125,
		"./levels.json": 126,
		"./prefabs.json": 127,
		"./scenes.json": 128,
		"./systems.json": 129
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 121;


/***/ },
/* 122 */
/***/ function(module, exports) {

	module.exports = {
		"box-anim-f11": [
			{
				"time": 70,
				"filmstripFrames": 11,
				"properties": {
					"image": {
						"name": "box-anim-f11.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 1166,
						"sourceHeight": 102,
						"destinationX": 0,
						"destinationY": -14,
						"destinationWidth": 106,
						"destinationHeight": 102
					}
				}
			}
		],
		"box-anim-2-f11": [
			{
				"time": 70,
				"filmstripFrames": 11,
				"properties": {
					"image": {
						"name": "box-anim-2-f11.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 1067,
						"sourceHeight": 141,
						"destinationX": 0,
						"destinationY": -53,
						"destinationWidth": 97,
						"destinationHeight": 141
					}
				}
			}
		],
		"cup": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "cup.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 61,
						"sourceHeight": 52
					}
				}
			}
		],
		"driftwood": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "driftwood.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 573,
						"sourceHeight": 188
					}
				}
			}
		],
		"box2": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "box2.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 173,
						"sourceHeight": 135
					}
				}
			}
		],
		"milk": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "milk.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 51,
						"sourceHeight": 90
					}
				}
			}
		],
		"paper-wad": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "paper-wad.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 76,
						"sourceHeight": 55
					}
				}
			}
		],
		"tire": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "tire.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 145,
						"sourceHeight": 144
					}
				}
			}
		],
		"waves": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "waves.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 1138,
						"sourceHeight": 147
					}
				}
			}
		],
		"Fries": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "Fries.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 89,
						"sourceHeight": 94
					}
				}
			}
		],
		"barrel": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "barrel.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 273,
						"sourceHeight": 158
					}
				}
			}
		],
		"boot": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "boot.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 101,
						"sourceHeight": 125
					}
				}
			}
		],
		"bottle": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "bottle.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 57,
						"sourceHeight": 149
					}
				}
			}
		],
		"box3": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "box3.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 75,
						"sourceHeight": 53
					}
				}
			}
		],
		"cheese": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "cheese.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 40,
						"sourceHeight": 39
					}
				}
			}
		],
		"chickenLeg": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "chickenLeg.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 69,
						"sourceHeight": 55
					}
				}
			}
		],
		"egg-carton": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "egg-carton.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 155,
						"sourceHeight": 58
					}
				}
			}
		],
		"eyes": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "eyes.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 246,
						"sourceHeight": 88
					}
				}
			}
		],
		"fishbone": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "fishbone.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 100,
						"sourceHeight": 52
					}
				}
			}
		],
		"fishingBoat": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "fishingBoat.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 1142,
						"sourceHeight": 443
					}
				}
			}
		],
		"foam-plate": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "foam-plate.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 119,
						"sourceHeight": 84
					}
				}
			}
		],
		"iceberg": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "iceberg.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 1353,
						"sourceHeight": 751
					}
				}
			}
		],
		"paper-wad2": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "paper-wad2.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 93,
						"sourceHeight": 78
					}
				}
			}
		],
		"pupils": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "pupils.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 112,
						"sourceHeight": 11
					}
				}
			}
		],
		"timer": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "timer.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 151,
						"sourceHeight": 150
					}
				}
			}
		],
		"trashbag": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "trashbag.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 243,
						"sourceHeight": 177
					}
				}
			}
		],
		"announcementBox": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "announcementBox.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 614,
						"sourceHeight": 430
					}
				}
			}
		],
		"birbArea": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "birbArea.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 318,
						"sourceHeight": 344
					}
				}
			}
		],
		"buoy": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "buoy.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 300,
						"sourceHeight": 326
					}
				}
			}
		],
		"hazardArea": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "hazardArea.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 86,
						"sourceHeight": 220
					}
				}
			}
		],
		"orangeBuoy": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "orangeBuoy.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 134,
						"sourceHeight": 165
					}
				}
			}
		],
		"radar": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "radar.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 206,
						"sourceHeight": 206
					}
				}
			}
		],
		"seaweed": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "seaweed.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 145,
						"sourceHeight": 267
					}
				}
			}
		],
		"controlPanel": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "controlPanel.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 194,
						"sourceHeight": 287
					}
				}
			}
		],
		"eyelashes-f3": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "eyelashes-f3.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 246,
						"sourceHeight": 88
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "eyelashes-f3.png",
						"sourceX": 246,
						"sourceY": 0,
						"sourceWidth": 246,
						"sourceHeight": 88
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "eyelashes-f3.png",
						"sourceX": 492,
						"sourceY": 0,
						"sourceWidth": 246,
						"sourceHeight": 88
					}
				}
			}
		],
		"notice": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "notice.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 583,
						"sourceHeight": 212
					}
				}
			}
		],
		"sandbar-f10": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 179,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 358,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 537,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 716,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 895,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 1074,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 1253,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 1432,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			},
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "sandbar-f10.png",
						"sourceX": 1611,
						"sourceY": 0,
						"sourceWidth": 179,
						"sourceHeight": 400
					}
				}
			}
		],
		"radarObstacle": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "radarObstacle.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 15,
						"sourceHeight": 19
					}
				}
			}
		],
		"radarPaper": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "radarPaper.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 28,
						"sourceHeight": 19
					}
				}
			}
		],
		"radarTrash": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "radarTrash.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 27,
						"sourceHeight": 20
					}
				}
			}
		],
		"titleScreen": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "titleScreen.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 1140,
						"sourceHeight": 640
					}
				}
			}
		],
		"whaleLeftFlipperHappy": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "whaleLeftFlipperHappy.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 295,
						"sourceHeight": 274
					}
				}
			}
		],
		"whaleLeftFlipperSad": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "whaleLeftFlipperSad.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 295,
						"sourceHeight": 274
					}
				}
			}
		],
		"whaleLeftHappy": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "whaleLeftHappy.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 505,
						"sourceHeight": 345
					}
				}
			}
		],
		"whaleLeftSad": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "whaleLeftSad.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 505,
						"sourceHeight": 345
					}
				}
			}
		],
		"whaleRightFlipperArrowMsg": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "whaleRightFlipperArrowMsg.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 296,
						"sourceHeight": 286
					}
				}
			}
		],
		"whaleRightHappy": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "whaleRightHappy.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 505,
						"sourceHeight": 344
					}
				}
			}
		],
		"TimesUp": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "TimesUp.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 286,
						"sourceHeight": 80
					}
				}
			}
		],
		"TimesUpwRope": [
			{
				"time": 100,
				"properties": {
					"image": {
						"name": "TimesUpwRope.png",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 286,
						"sourceHeight": 353
					}
				}
			}
		]
	};

/***/ },
/* 123 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 124 */
/***/ function(module, exports) {

	module.exports = {
		"title": [
			{
				"id": 0,
				"name": "viewport",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 1136,
					"height": 640
				}
			},
			{
				"id": 1,
				"name": "camera",
				"camera": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"matchCanvasSize": true,
				"matchCenter": {
					"id": 0
				}
			}
		]
	};

/***/ },
/* 125 */
/***/ function(module, exports) {

	module.exports = {
		"axes": {},
		"buttons": {
			"action": [
				{
					"device": "keyboard",
					"button": "escape"
				},
				{
					"device": "keyboard",
					"button": "enter"
				},
				{
					"device": "keyboard",
					"button": "space"
				},
				{
					"device": "mouse",
					"button": 0
				},
				{
					"device": "gamepad",
					"button": "a"
				}
			],
			"up": [
				{
					"device": "keyboard",
					"button": "w"
				},
				{
					"device": "keyboard",
					"button": "up"
				},
				{
					"device": "gamepad",
					"button": "dpad up"
				},
				{
					"device": "gamepad",
					"button": "left stick up"
				}
			],
			"down": [
				{
					"device": "keyboard",
					"button": "s"
				},
				{
					"device": "keyboard",
					"button": "down"
				},
				{
					"device": "gamepad",
					"button": "dpad down"
				},
				{
					"device": "gamepad",
					"button": "left stick down"
				}
			],
			"left": [
				{
					"device": "keyboard",
					"button": "a"
				},
				{
					"device": "keyboard",
					"button": "left"
				},
				{
					"device": "gamepad",
					"button": "dpad left"
				},
				{
					"device": "gamepad",
					"button": "left stick left"
				}
			],
			"right": [
				{
					"device": "keyboard",
					"button": "d"
				},
				{
					"device": "keyboard",
					"button": "right"
				},
				{
					"device": "gamepad",
					"button": "dpad right"
				},
				{
					"device": "gamepad",
					"button": "left stick right"
				}
			],
			"restart": [
				{
					"device": "keyboard",
					"button": "r"
				},
				{
					"device": "gamepad",
					"button": "home"
				}
			]
		}
	};

/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports = [
		{
			"maps": [
				"level1"
			],
			"music": "trash-island-theme.mp3",
			"radius": 0,
			"goalRadius": 50,
			"message": "Can you grow to 50 meters?",
			"maxTime": 10
		},
		{
			"maps": [
				"sunshine"
			],
			"music": "trash-island-bossa.mp3",
			"radius": 0,
			"goalRadius": 100,
			"message": "Even bigger! 100m",
			"maxTime": 20
		},
		{
			"maps": [
				"level4"
			],
			"music": "trash-island-theme.mp3",
			"radius": 0,
			"goalRadius": 150,
			"message": "Keep growing! 150m!",
			"maxTime": 30
		},
		{
			"maps": [
				"level3"
			],
			"music": "trash-island-bossa.mp3",
			"radius": 0,
			"goalRadius": 200,
			"message": "Grow your island! 200m",
			"maxTime": 40
		},
		{
			"maps": [
				"KFP"
			],
			"music": "trash-island-theme.mp3",
			"radius": 0,
			"goalRadius": 275,
			"message": "Kentucky Fried Pixels! 275m",
			"maxTime": 50
		},
		{
			"maps": [
				"level2"
			],
			"music": "trash-island-bossa.mp3",
			"radius": 0,
			"goalRadius": 325,
			"message": "OM NOM NOM! 325m",
			"maxTime": 60
		},
		{
			"maps": [
				"cluster1"
			],
			"music": "trash-island-theme.mp3",
			"radius": 0,
			"goalRadius": 400,
			"message": "Can you do it? 400m",
			"maxTime": 90
		},
		{
			"maps": [
				"funnel"
			],
			"music": "trash-island-bossa.mp3",
			"radius": 0,
			"goalRadius": 500,
			"message": "Is this even possible? 500m!",
			"maxTime": 120
		},
		{
			"maps": [
				"trail"
			],
			"music": "trash-island-theme.mp3",
			"radius": 0,
			"goalRadius": 500,
			"message": "Escape Iceberg Canyon",
			"maxTime": 400
		}
	];

/***/ },
/* 127 */
/***/ function(module, exports) {

	module.exports = {
		"controls": {
			"name": "controls",
			"position": {
				"x": 230,
				"y": 200,
				"z": 1
			},
			"easing": {
				"position.y": {
					"type": "easeOutElastic",
					"start": 350,
					"end": 400,
					"time": 0,
					"max": 2000
				}
			},
			"image": {
				"name": "controls.png"
			}
		},
		"play-again": {
			"name": "play again",
			"position": {
				"x": 230,
				"y": 200,
				"z": 1
			},
			"easing": {
				"position.y": {
					"type": "easeOutElastic",
					"start": 350,
					"end": 400,
					"time": 0,
					"max": 2000
				}
			},
			"image": {
				"name": "play-again.png"
			}
		},
		"debris": {
			"name": "debris",
			"image": {
				"name": "particle-water-drop.png"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 28,
				"height": 19
			},
			"lifeSpan": {
				"current": 0,
				"max": 300
			},
			"easing": {
				"image.alpha": {
					"time": 0,
					"max": 300,
					"start": 1,
					"end": 0,
					"type": "easeInOutQuad"
				}
			}
		},
		"box": {
			"name": "Undelivered package from 2011",
			"image": {
				"name": "box.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 101,
				"destinationHeight": 88
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 101,
				"height": 88
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"box2": {
			"name": "Vagabox tiny house",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 173,
				"destinationHeight": 135
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "box2"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 173,
				"height": 135
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"milk": {
			"name": "Organic extra D vitamin milk",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 51,
				"destinationHeight": 90
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "milk"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 51,
				"height": 90
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"paper-wad": {
			"name": "'Do not litter' posters",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 76,
				"destinationHeight": 55
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "paper-wad"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 76,
				"height": 55
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"tire": {
			"name": "Tire - Do not burn",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 145,
				"destinationHeight": 144
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "tire"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 145,
				"height": 144
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3"
			]
		},
		"barrel": {
			"name": "Dinosaur Oil Company barrel",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 273,
				"destinationHeight": 158
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "barrel"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 273,
				"height": 158
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3",
				"sfx-metal-tonk.mp3",
				"sfx-metal-tube.mp3"
			]
		},
		"Fries": {
			"name": "Fries Queen XL fries",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 89,
				"destinationHeight": 94
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "Fries"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 89,
				"height": 94
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"boot": {
			"name": "Sole Mate branded boot",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 101,
				"destinationHeight": 125
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "boot"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 101,
				"height": 125
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-dink.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"bottle": {
			"name": "Tap Dat H2O water bottle",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 57,
				"destinationHeight": 149
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "bottle"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 57,
				"height": 149
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"box3": {
			"name": "Wait, was something in there...?",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 75,
				"destinationHeight": 53
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "box3"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 75,
				"height": 53
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"cheese": {
			"name": "Weathered cheddar",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 40,
				"destinationHeight": 39
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "cheese"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 40,
				"height": 39
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"chickenLeg": {
			"name": "Piece of poultry",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 69,
				"destinationHeight": 55
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "chickenLeg"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 69,
				"height": 55
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"egg-carton": {
			"name": "Baby chicken transporter",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 155,
				"destinationHeight": 58
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "egg-carton"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 155,
				"height": 58
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"fishbone": {
			"name": "Expired aquatic being",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 100,
				"destinationHeight": 52
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "fishbone"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 100,
				"height": 52
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"foam-plate": {
			"name": "Totally wasteful food carrier",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 119,
				"destinationHeight": 84
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "foam-plate"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 119,
				"height": 84
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"paper-wad2": {
			"name": "Trump ballots",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 93,
				"destinationHeight": 78
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "paper-wad2"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 93,
				"height": 78
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"trashbag": {
			"name": "Hastily discarded bag",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 243,
				"destinationHeight": 177
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "trashbag"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 233,
				"height": 167
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3",
				"sfx-paper-flip.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"iceberg": {
			"name": "OMG an iceberg!",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 1353,
				"destinationHeight": 751
			},
			"type": "obstacle",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "iceberg"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 1353,
				"height": 751
			},
			"collisions": [],
			"noises": [
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3"
			]
		},
		"buoy": {
			"name": "Swim at your own risk",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 300,
				"destinationHeight": 326
			},
			"type": "obstacle",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "buoy"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 300,
				"height": 326
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3",
				"sfx-metal-tonk.mp3",
				"sfx-metal-tube.mp3"
			]
		},
		"fishingBoat": {
			"name": "SS Not-So-Swole fishing boat",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 1142,
				"destinationHeight": 443
			},
			"type": "obstacle",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "fishingBoat"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 1142,
				"height": 443
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3",
				"sfx-metal-tonk.mp3",
				"sfx-metal-tube.mp3"
			]
		},
		"birbArea": {
			"name": "@ProBirdsRights",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 318,
				"destinationHeight": 344
			},
			"type": "obstacle",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "birbArea"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 318,
				"height": 344
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-dink.mp3",
				"sfx-metal-tonk.mp3",
				"sfx-metal-tube.mp3"
			]
		},
		"hazardArea": {
			"name": "Posted hazard area",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 86,
				"destinationHeight": 220
			},
			"type": "obstacle",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "hazardArea"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 86,
				"height": 220
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3",
				"sfx-metal-tonk.mp3",
				"sfx-metal-tube.mp3"
			]
		},
		"orangeBuoy": {
			"name": "No ships allowed!",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 134,
				"destinationHeight": 165
			},
			"type": "obstacle",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "orangeBuoy"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 134,
				"height": 165
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3",
				"sfx-metal-tonk.mp3",
				"sfx-metal-tube.mp3"
			]
		},
		"seaweed": {
			"name": "No ships allowed!",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 145,
				"destinationHeight": 267
			},
			"type": "obstacle",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "seaweed"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 145,
				"height": 267
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-rolled-paper-slap.mp3"
			]
		},
		"driftwood": {
			"name": "Driftwood",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 573,
				"destinationHeight": 188
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "driftwood"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 573,
				"height": 188
			},
			"friction": {
				"x": 0.999,
				"y": 0.999
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-rolled-paper-slap.mp3",
				"sfx-metal-boom.mp3",
				"sfx-metal-dink.mp3"
			]
		},
		"cup": {
			"name": "Crushed red partycups",
			"image": {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 61,
				"destinationHeight": 52
			},
			"type": "trash",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "cup"
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 61,
				"height": 52
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"straw": {
			"name": "Single-use plastic sipping device",
			"image": {
				"name": "straw.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 64,
				"destinationHeight": 52
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 64,
				"height": 52
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"buttTrash": {
			"name": "Nonbiodegradable tobacco filter",
			"image": {
				"name": "buttTrash.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 39,
				"destinationHeight": 15
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 39,
				"height": 15
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"banjo": {
			"name": "Ba na ner ner ner ner ner ner ner",
			"image": {
				"name": "banjo.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 258,
				"destinationHeight": 95
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 258,
				"height": 95
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"chicken-bucket": {
			"name": "0% trans fat!",
			"image": {
				"name": "chicken-bucket.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 85,
				"destinationHeight": 84
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 85,
				"height": 84
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"moonshine": {
			"name": "800 proof",
			"image": {
				"name": "moonshine.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 154,
				"destinationHeight": 192
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 154,
				"height": 192
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"ticket": {
			"name": "Another downtown parking ticket",
			"image": {
				"name": "ticket.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 107,
				"destinationHeight": 57
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 107,
				"height": 57
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"bourbon": {
			"name": "Some hipster bourbon",
			"image": {
				"name": "bourbon.png",
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": 0,
				"destinationY": 0,
				"destinationWidth": 80,
				"destinationHeight": 154
			},
			"type": "trash",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 80,
				"height": 154
			},
			"friction": {
				"x": 0.97,
				"y": 0.97
			},
			"collisions": [],
			"noises": [
				"sfx-crunch.mp3",
				"sfx-crush.mp3"
			]
		},
		"particle-ooze-1": {
			"image": {
				"name": "particle-ooze-1.png"
			},
			"size": {
				"width": 63,
				"height": 96
			}
		},
		"particle-ooze-2": {
			"image": {
				"name": "particle-ooze-2.png"
			},
			"size": {
				"width": 17,
				"height": 19
			}
		},
		"particle-ooze-3": {
			"image": {
				"name": "particle-ooze-3.png"
			},
			"size": {
				"width": 28,
				"height": 51
			}
		},
		"particle-ooze-4": {
			"image": {
				"name": "particle-ooze-4.png"
			},
			"size": {
				"width": 36,
				"height": 41
			}
		},
		"particle-ooze-5": {
			"image": {
				"name": "particle-ooze-5.png"
			},
			"size": {
				"width": 34,
				"height": 40
			}
		},
		"particle-ooze-6": {
			"image": {
				"name": "particle-ooze-6.png"
			},
			"size": {
				"width": 10,
				"height": 7
			}
		},
		"particle-ooze-7": {
			"image": {
				"name": "particle-ooze-7.png"
			},
			"size": {
				"width": 58,
				"height": 50
			}
		},
		"particle-ooze-8": {
			"image": {
				"name": "particle-ooze-8.png"
			},
			"size": {
				"width": 25,
				"height": 11
			}
		}
	};

/***/ },
/* 128 */
/***/ function(module, exports) {

	module.exports = {
		"loading": {
			"first": true
		},
		"title": {
			"first": false,
			"onEnter": "./scripts/title-enter",
			"onExit": "./scripts/title-exit"
		}
	};

/***/ },
/* 129 */
/***/ function(module, exports) {

	module.exports = {
		"simulation": [
			{
				"name": "splat-ecs/lib/systems/simulation/match-canvas-size",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/match-center",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/advance-timers",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/advance-animations",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/apply-easing",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/apply-velocity",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/match-parent",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/follow-parent",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/simulation/box-collider",
				"scenes": "all"
			},
			{
				"name": "./systems/simulation/handle-collisions",
				"scenes": [
					"level"
				]
			},
			{
				"name": "splat-ecs/lib/systems/simulation/match-aspect-ratio",
				"scenes": "all"
			}
		],
		"renderer": [
			{
				"name": "splat-ecs/lib/systems/renderer/apply-shake",
				"scenes": "all"
			},
			{
				"name": "splat-ecs/lib/systems/renderer/clear-screen",
				"scenes": []
			},
			{
				"name": "splat-ecs/lib/systems/renderer/viewport-move-to-camera",
				"scenes": "all"
			},
			{
				"name": "./systems/renderer/tile-background",
				"scenes": [
					"intro",
					"title",
					"level-select",
					"level",
					"finished"
				]
			},
			{
				"name": "splat-ecs/lib/systems/renderer/draw-image",
				"scenes": "all"
			},
			{
				"name": "./systems/renderer/render-loading-bar",
				"scenes": [
					"loading"
				]
			},
			{
				"name": "splat-ecs/lib/systems/renderer/viewport-reset",
				"scenes": []
			},
			{
				"name": "splat-ecs/lib/systems/renderer/viewport-reset",
				"scenes": "all"
			}
		]
	};

/***/ },
/* 130 */
/***/ function(module, exports) {

	function webpackContext(req) {
		throw new Error("Cannot find module '" + req + "'.");
	}
	webpackContext.keys = function() { return []; };
	webpackContext.resolve = webpackContext;
	module.exports = webpackContext;
	webpackContext.id = 130;


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map