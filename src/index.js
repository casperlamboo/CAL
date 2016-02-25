import * as Math from 'casperlamboo/Math';
import draw from './core/draw.js';
import group from './core/group.js';
import surface from './core/surface.js';
import * as utils from './core/utils.js';
import image from './object/image.js';
import keyListener from './object/keylistener.js';
import loader from './object/loader.js';
import text from './object/text.js';
import timeLine from './object/timeline.js';
import tween from './object/tween.js';
import shape from './object/shape.js';
import collisionMap from './object/collisionmap.js';

export const Draw = draw;
export const Group = group;
export const Surface = surface;
export const Utils = utils;
export const Image = image;
export const KeyListener = keyListener;
export const Loader = loader;
export const Text = text;
export const TimeLine = timeLine;
export const Tween = tween;
export const Shape = shape;
export const CollisionMap = collisionMap;

export const Color = Math.Color;
export const Matrix = Math.Matrix;
export const Vector = Math.Vector;
export const MathExtended = Math.MathExtended;

window.requestAnimFrame = (() => {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || ((callback) => {
		setTimeout(callback, 1000/60);
	});
}());
