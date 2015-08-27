//canvas cheat sheet
//http://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/

//TODO
//Global Composite Operation
//Linear Gradient
//Radial Gradient
export let MathExtended = {
	clamb: function (value, min, max) {
		return (value > min) ? ((value < max) ? value : max) : min;
	},
	randomInt: function (min, max) {
		return Math.floor(CAL.Math.random(min, max + 1));
	},
	random: function (min = 0, max = 1) {
		return Math.random() * (max - min) + min;
	},
	sign: function (value) {
		return (value > 0) ? 1 : ((value < 0) ? -1 : 0);
	},
	lineCollision: function (v1, v2, v3, v4) {
		//bron: http://mathworld.wolfram.com/Line-LineIntersection.html
		var intersection = new CAL.Vector(
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
	'backspace': 8, 
	'tab': 9, 
	'enter': 13, 
	'shift': 16, 
	'ctrl': 17, 
	'alt': 18, 
	'pause': 19, 
	'break': 19, 
	'caps_lock': 20, 
	'escape': 27, 
	'page_up': 33, 
	'page_down': 34, 
	'end': 35, 
	'home': 36, 
	'left_arrow': 37, 
	'up_arrow': 38, 
	'right_arrow': 39, 
	'down_arrow': 40, 
	'insert': 45, 
	'delete': 46, 
	'0': 48, 
	'1': 49, 
	'2': 50, 
	'3': 51, 
	'4': 52, 
	'5': 53, 
	'6': 54, 
	'7': 55, 
	'8': 56, 
	'9': 57, 
	'a': 65, 
	'b': 66, 
	'c': 67, 
	'd': 68, 
	'e': 69, 
	'f': 70, 
	'g': 71, 
	'h': 72, 
	'i': 73, 
	'j': 74, 
	'k': 75, 
	'l': 76, 
	'm': 77, 
	'n': 78, 
	'o': 79, 
	'p': 80, 
	'q': 81, 
	'r': 82, 
	's': 83, 
	't': 84, 
	'u': 85, 
	'v': 86, 
	'w': 87, 
	'x': 88, 
	'y': 89, 
	'z': 90, 
	'left_window_key': 91, 
	'right_window_key': 92, 
	'select_key': 93, 
	'numpad_0': 96, 
	'numpad_1': 97, 
	'numpad_2': 98, 
	'numpad_3': 99, 
	'numpad_4': 100, 
	'numpad_5': 101, 
	'numpad_6': 102, 
	'numpad_7': 103, 
	'numpad_8': 104, 
	'numpad_9': 105, 
	'multiply': 106, 
	'add': 107, 
	'subtract': 109, 
	'decimal_point': 110, 
	'divide': 111, 
	'f1': 112, 
	'f2': 113, 
	'f3': 114, 
	'f4': 115, 
	'f5': 116, 
	'f6': 117, 
	'f7': 118, 
	'f8': 119, 
	'f9': 120, 
	'f10': 121, 
	'f11': 122, 
	'f12': 123, 
	'num_lock': 144, 
	'scroll_lock': 145, 
	'semi-colon': 186, 
	'equal sign': 187, 
	'comma': 188, 
	'dash': 189, 
	'period': 190, 
	'forward_slash': 191, 
	'grave_accent': 192, 
	'open_bracket': 219, 
	'back_slash': 220, 
	'close_braket': 221, 
	'single_quote': 222
};
