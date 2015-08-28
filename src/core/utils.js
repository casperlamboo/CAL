//canvas cheat sheet
//http://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/

//TODO
//Global Composite Operation
//Linear Gradient
//Radial Gradient

import Vector from '../math/vector.js';

export let MathExtended = {
	clamb: function (value, min, max) {
		return (value > min) ? ((value < max) ? value : max) : min;
	},
	randomInt: function (min, max) {
		return Math.floor(MathExtended.random(min, max + 1));
	},
	random: function (min = 0, max = 1) {
		return Math.random() * (max - min) + min;
	},
	sign: function (value) {
		return (value > 0) ? 1 : ((value < 0) ? -1 : 0);
	},
	lineCollision: function (v1, v2, v3, v4) {
		//bron: http://mathworld.wolfram.com/Line-LineIntersection.html
		var intersection = new Vector(
			((v1.x*v2.y-v1.y*v2.x)*(v3.x-v4.x)-(v1.x-v2.x)*(v3.x*v4.y-v3.y*v4.x)) / ((v1.x-v2.x)*(v3.y-v4.y)-(v1.y-v2.y)*(v3.x-v4.x)),
			((v1.x*v2.y-v1.y*v2.x)*(v3.y-v4.y)-(v1.y-v2.y)*(v3.x*v4.y-v3.y*v4.x)) / ((v1.x-v2.x)*(v3.y-v4.y)-(v1.y-v2.y)*(v3.x-v4.x))
		);

		var line1 = v1.subtract(v2).length();
		var line2 = v3.subtract(v4).length();

		var a = line1 >= v1.subtract(intersection).length();
		var b = line1 >= v2.subtract(intersection).length();
		var c = line2 >= v3.subtract(intersection).length();
		var d = line2 >= v4.subtract(intersection).length();

		return (a && b && c && d) ? intersection : false;
	}
};

export let Easings = {
	bounceEaseOut: (dt, b, c, d) => {
		if ((dt /= d) < (1 / 2.75)) {
			return c * (7.5625 * dt * dt) + b;
		}
		else if (dt < (2 / 2.75)) {
			return c * (7.5625 * (dt -= (1.5 / 2.75)) * dt + 0.75) + b;
		}
		else if (dt < (2.5 / 2.75)) {
			return c * (7.5625 * (dt -= (2.25 / 2.75)) * dt + 0.9375) + b;
		}
		else {
			return c * (7.5625 * (dt -= (2.625 / 2.75)) * dt + 0.984375) + b;
		}
	},
	easeIn: (dt, b, c, d) => {
		return c * (dt /= d) * dt + b;
	},
	easeOut: (dt, b, c, d) => {
		return -c * (dt /= d) * (dt - 2) + b;
	},
	easeInOut: (dt, b, c, d) => {
		if ((dt /= d / 2) < 1) {
			return c / 2 * dt * dt + b;
		}
		return -c / 2 * ((--dt) * (dt - 2) - 1) + b;
	},
	strongEaseIn: (dt, b, c, d) => {
		return c * (dt /= d) * dt * dt * dt * dt + b;
	},
	strongEaseOut: (dt, b, c, d) => {
		return c * (( dt = dt / d - 1) * dt * dt * dt * dt + 1) + b;
	},
	strongEaseInOut: (dt, b, c, d) => {
		if ((dt /= d / 2) < 1) {
			return c / 2 * dt * dt * dt * dt * dt + b;
		}
		return c / 2 * ((dt -= 2) * dt * dt * dt * dt + 2) + b;
	},
	linear: (dt, b, c, d) => {
		return c * dt / d + b;
	}
};

export let KeyLookUp = {
	 8: 'backspace', 
	 9: 'tab', 
	 13: 'enter', 
	 16: 'shift', 
	 17: 'ctrl', 
	 18: 'alt', 
	 19: 'pause', 
	 19: 'break', 
	 20: 'caps_lock', 
	 27: 'escape', 
	 33: 'page_up', 
	 34: 'page_down', 
	 35: 'end', 
	 36: 'home', 
	 37: 'left_arrow', 
	 38: 'up_arrow', 
	 39: 'right_arrow', 
	 40: 'down_arrow', 
	 45: 'insert', 
	 46: 'delete', 
	 48: '0', 
	 49: '1', 
	 50: '2', 
	 51: '3', 
	 52: '4', 
	 53: '5', 
	 54: '6', 
	 55: '7', 
	 56: '8', 
	 57: '9', 
	 65: 'a', 
	 66: 'b', 
	 67: 'c', 
	 68: 'd', 
	 69: 'e', 
	 70: 'f', 
	 71: 'g', 
	 72: 'h', 
	 73: 'i', 
	 74: 'j', 
	 75: 'k', 
	 76: 'l', 
	 77: 'm', 
	 78: 'n', 
	 79: 'o', 
	 80: 'p', 
	 81: 'q', 
	 82: 'r', 
	 83: 's', 
	 84: 't', 
	 85: 'u', 
	 86: 'v', 
	 87: 'w', 
	 88: 'x', 
	 89: 'y', 
	 90: 'z', 
	 91: 'left_window_key', 
	 92: 'right_window_key', 
	 93: 'select_key', 
	 96: 'numpad_0', 
	 97: 'numpad_1', 
	 98: 'numpad_2', 
	 99: 'numpad_3', 
	 100: 'numpad_4', 
	 101: 'numpad_5', 
	 102: 'numpad_6', 
	 103: 'numpad_7', 
	 104: 'numpad_8', 
	 105: 'numpad_9', 
	 106: 'multiply', 
	 107: 'add', 
	 109: 'subtract', 
	 110: 'decimal_point', 
	 111: 'divide', 
	 112: 'f1', 
	 113: 'f2', 
	 114: 'f3', 
	 115: 'f4', 
	 116: 'f5', 
	 117: 'f6', 
	 118: 'f7', 
	 119: 'f8', 
	 120: 'f9', 
	 121: 'f10', 
	 122: 'f11', 
	 123: 'f12', 
	 144: 'num_lock', 
	 145: 'scroll_lock', 
	 186: 'semi-colon', 
	 187: 'equal sign', 
	 188: 'comma', 
	 189: 'dash', 
	 190: 'period', 
	 191: 'forward_slash', 
	 192: 'grave_accent', 
	 219: 'open_bracket', 
	 220: 'back_slash', 
	 221: 'close_braket', 
	 2: 'single_quote'
};
