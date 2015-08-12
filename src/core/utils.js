//canvas cheat sheet
//http://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/

//TODO
//Global Composite Operation
//Linear Gradient
//Radial Gradient
export let math = {
	clamb: function (value, min, max) {
		return (value > min) ? ((value < max) ? value : max) : min;
	},
	randomInt: function (min, max) {
		return Math.floor(CAL.Math.random(min, max + 1));
	},
	random: function (min, max) {
		min = (min === undefined) ? 0 : min;
		max = (max === undefined) ? 1 : max;

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

export let easings = {
	bounceEaseOut: function (dt, b, c, d) {
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
	easeIn: function (dt, b, c, d) {
		return c * (dt /= d) * dt + b;
	},
	easeOut: function (dt, b, c, d) {
		return -c * (dt /= d) * (dt - 2) + b;
	},
	easeInOut: function (dt, b, c, d) {
		if ((dt /= d / 2) < 1) {
			return c / 2 * dt * dt + b;
		}
		return -c / 2 * ((--dt) * (dt - 2) - 1) + b;
	},
	strongEaseIn: function (dt, b, c, d) {
		return c * (dt /= d) * dt * dt * dt * dt + b;
	},
	strongEaseOut: function (dt, b, c, d) {
		return c * (( dt = dt / d - 1) * dt * dt * dt * dt + 1) + b;
	},
	strongEaseInOut: function (dt, b, c, d) {
		if ((dt /= d / 2) < 1) {
			return c / 2 * dt * dt * dt * dt * dt + b;
		}
		return c / 2 * ((dt -= 2) * dt * dt * dt * dt + 2) + b;
	},
	linear: function (dt, b, c, d) {
		return c * dt / d + b;
	}
};