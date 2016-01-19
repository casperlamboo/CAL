import draw from './core/draw.js';
import group from './core/group.js';
import surface from './core/surface.js';
import * as utils from './core/utils.js';
import color from './math/color.js';
import matrix from './math/matrix.js';
import vector from './math/vector.js';
import image from './object/image.js';
import keyListener from './object/keylistener.js';
import loader from './object/loader.js';
import text from './object/text.js';
import timeLine from './object/timeline.js';
import tween from './object/tween.js';
import shape from './object/shape.js';
import collisionMap from './object/collisionmap.js';
import star from './shapes/star.js';
import polygon from './shapes/polygon.js';

export let Draw = draw;
export let Group = group;
export let Surface = surface;
export let Utils = utils;
export let Color = color;
export let Matrix = matrix;
export let Vector = vector;
export let Image = image;
export let KeyListener = keyListener;
export let Loader = loader;
export let Text = text;
export let TimeLine = timeLine;
export let Tween = tween;
export let Shape = shape;
export let CollisionMap = collisionMap;
export let Star = star;
export let Polygon = polygon;

window.requestAnimFrame = (() => {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || ((callback) => {
		setTimeout(callback, 1000/60);
	});
}());
