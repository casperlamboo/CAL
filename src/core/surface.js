import Draw from './draw.js';

export default class Surface extends Draw {
	constructor (options = {}) {
		super(options.centerX, options.centerY, options.numberWidth, options.numberHeight, options);

		let {
			clearColor = false, 
			canvas = document.createElement("canvas")
		} = options;

		this.clearColor = clearColor;

		this.setCanvas(canvas);

		this.setSize(options.width, options.height, options.pixelRatio);
	}

	setSize (width = this.image.width, height = this.image.height, pixelRatio = 1) {
		this.image.width = width * pixelRatio;
		this.image.height = height * pixelRatio;

		this.image.style.width = width + 'px';
		this.image.style.height = height + 'px';

		this.width = this.image.width / this.numberWidth;
		this.height = this.image.height / this.numberHeight;

		return this;
	}

	setCanvas (canvas) {
		this.image = canvas;
		this.context = canvas.getContext("2d");

		return this;
	}

	clear () {
		if (this.clearColor) {
			this.clearColor.setContext(this.context);
			this.context.fillRect(0, 0, this.image.width, this.image.height);
		}
		else {
			this.context.clearRect(0, 0, this.image.width, this.image.height);
		}

		return this;
	}

	getImageData (x = 0, y = 0, width = this.image.width, height = this.image.height) {
		return this.context.getImageData(x, y, width, height);
	}

	getDataURL () {
		return this.image.toDataURL();
	}
};
