import Draw from '../core/draw.js';

export default class Img extends Draw {
	constructor (source, centerX, centerY, numberWidth, numberHeight, options = {}) {
		super(centerX, centerY, numberWidth, numberHeight, options);

		this.image = new Image();
		this.source = source;
	}

	load (callback) {
		this.image.onload = () => {
			this.loaded = true;

			this.width = this.image.width / this.numberWidth;
			this.height = this.image.height / this.numberHeight;

			if (callback !== undefined) {
				callback();
			}
		};
		this.image.src = this.source;

		return this;
	}
};
