import {Easings} from '../core/utils.js';

export default class Tween {
	constructor (targetObject, targetProperties, duration, options = {}) {
		let {
			easing = Easings.linear, 
			callback, 
			drawCanvas = false, 
			clearCanvas = false
		} = options;

		this.visible = false;
		this.active = true;
		this.depth = -10000;

		this.targetObject = targetObject;
		this.targetProperties = targetProperties;
		this.timer = 0;
		this.duration = duration;
		this.easing = easing;
		this.callback = callback;

		this.begin = {};
		for (let i in targetProperties) {
			this.begin[i] = this.targetObject[i];
		}

		this.change = {};
		for (let i in targetProperties) {
			this.change[i] = targetProperties[i] - this.begin[i];
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
			for (let i in this.targetProperties) {
				let dt = this.timer;
				let d = this.duration;
				let b = this.begin[i];
				let c = this.change[i];
				
				this.targetObject[i] = this.easing(dt, b, c, d);
			}
		}
		else {
			for (let i in this.targetProperties) {
				this.targetObject[i] = this.targetProperties[i];
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
