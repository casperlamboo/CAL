import Matrix from '../math/matrix.js';

export default class Draw extends Matrix {

	constructor (centerX = 0, centerY = 0, numberWidth = 1, numberHeight = 1, options = {}) {
		let {visible = true, depth = 0, alpha = 1} = options;
		super(options);

		this.visible = visible;
		this.active = false;
		this.depth = depth;

		this.alpha = alpha;

		this.centerX = centerX;
		this.centerY = centerY;
		this.index = 0;

		this.numberWidth = numberWidth;
		this.numberHeight = numberHeight;
		this.length = this.numberWidth * this.numberHeight;
	}

	getBoundingBox () {
		return {
			top: -this.centerX, 
			left: -this.centerY,
			right: this.width - this.centerX, 
			bottom: this.height - this.centerY,
			width: this.width, 
			height: this.height
		};
	}

	draw (context, matrix = this) {

		context.save();
		matrix.setMatrixContext(context);
		context.globalAlpha = this.alpha;
		
		this.drawSimple(context, this.index, 0, 0);
		
		context.restore();

		return this;
	}

	drawSimple (context, index, x, y) {
		var sx = (index % this.numberWidth) * this.width;
		var sy = Math.floor(index / this.numberWidth) * this.height;

		var offsetX = x - this.centerX;
		var offsetY = y - this.centerY;

		context.drawImage(this.image, sx, sy, this.width, this.height, offsetX, offsetY, this.width, this.height);

		return this;
	}

	drawAlpha (context, index, x, y, alpha) {
		context.globalAlpha = alpha;
		this.drawSimple(context, index, x, y);
		context.globalAlpha = 1;

		return this;
	}

	drawAngle (context, index, x, y, angle) {
		context.save();
		context.translate(x, y);
		context.rotate(angle);
		this.drawSimple(context, index, 0, 0);
		context.restore();

		return this;
	}

	drawScale (context, index, x, y, width, height) {
		var sx = (index % this.length) * this.width;
		var sy = Math.floor(index / this.length) * this.height;

		var offsetX = x - this.centerX;
		var offsetY = y - this.centerY;

		context.drawImage(this.image, sx, sy, this.width, this.height, offsetX, offsetY, width, height);

		return this;	
	}

	drawContain (context, index, x, y, width, height) {
		if ((width / height) > (this.width / this.height)) {
			x = x + (width - height / this.height * this.width) / 2;
			width = height / this.height * this.width;
		}
		else {
			y = y + (height - width / this.width * this.height) / 2;
			height = width / this.width * this.height;
		}

		this.drawScale(context, index, x, y, width, height);

		return this;
	}

};