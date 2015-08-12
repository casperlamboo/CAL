import {Easings} from '../core/utils.js';

export default class Tween {

	constructor (object, attributes, duration, options = {}) {
		let {easing = Easings.linear, callback, drawCanvas = true, clearCanvas = false} = options;

		this.visible = false;
		this.active = true;
		this.depth = -10000;

		this.object = object;
		this.attributes = attributes;
		this.timer = 0;
		this.duration = duration;
		this.easing = easings;
		this.callback = callback;

		this.begin = {};
		for (var i in attributes) {
			this.begin[i] = this.object[i];
		}

		this.change = {};
		for (var i in attributes) {
			this.change[i] = attributes[i] - this.begin[i];
		}

		this.drawCanvas = drawCanvas;
		this.clearCanvas = clearCanvas;
	}

	start () {
		this.t = 0;
		this.active = true;

		return this;
	}

	stop () {
		this.t = 0;
		this.active = false;

		return this;
	}

	pause () {
		this.active = false;

		return this;
	}

	resume () {
		this.active = true;

		return this;
	}

	step (deltaTime, group) {
		this.timer += deltaTime;

		if (this.timer < this.duration) {
			for (var i in this.attributes) {
				var dt = this.timer;
				var d = this.duration;
				var b = this.begin[i];
				var c = this.change[i];
				
				this.object[i] = this.easing(dt, b, c, d);
			}
		}
		else {
			for (var i in this.attributes) {
				this.object[i] = this.attributes[i];
			}

			if (this.callback !== undefined) {
				this.callback();
			}
			group.remove(this);
		}

		if (this.clearCanvas) {
			group.clearCanvas = true;
		}
		if (this.drawCanvas) {
			group.drawCanvas = true;
		}
	}

};