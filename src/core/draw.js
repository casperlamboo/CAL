import { Vector, Matrix } from 'casperlamboo/Math';

const POSITION = new Vector();

export default class Draw extends Matrix {
	constructor (centerX = 0, centerY = 0, numberWidth = 1, numberHeight = 1, options = {}) {
		super(options);

		let {
			visible = true,
			depth = 0,
			alpha = 1
		} = options;

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

	getBoundingBox (applyMatrix) {
		const top = -this.centerY;
		const left = -this.centerX;
		const right = this.width - this.centerX;
		const bottom = this.height - this.centerY;

		const points = [
			new Vector(left, top),
			new Vector(right, top),
			new Vector(left, bottom),
			new Vector(right, bottom)
		];

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (let i = 0; i < points.length; i ++) {
			const point = applyMatrix ? POSITION.copy(points[i]).applyMatrix(this) : points[i];

			minX = (point.x < minX) ? point.x : minX;
			minY = (point.y < minY) ? point.y : minY;
			maxX = (point.x > maxX) ? point.x : maxX;
			maxY = (point.y > maxY) ? point.y : maxY;
		}

		return {
			top: minY,
			left: minX,
			bottom: maxY,
			right: maxX,
			width: maxX - minX,
			height: maxY - minY
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

	drawCrop (context, index = 0, x = 0, y = 0, maxWidth = this.width, maxHeight = this.height) {
		var sx = (index % this.numberWidth) * this.width;
		var sy = Math.floor(index / this.numberWidth) * this.height;

		var offsetX = x - this.centerX;
		var offsetY = y - this.centerY;

		for (var widthStep = 0; widthStep < maxWidth; widthStep += this.width) {
			let width = widthStep + this.width <= maxWidth ? this.width : maxWidth % this.width;

			for (var heightStep = 0; heightStep < maxHeight; heightStep += this.height) {
				let height = heightStep + this.height <= maxHeight ? this.height : maxHeight % this.height;

				context.drawImage(this.image, sx, sy, width, height, offsetX + widthStep, offsetY + heightStep, width, height);
			}
		}

		return this;
	}

	drawCropAngle (context, index = 0, x = 0, y = 0, width = this.width, height = this.height, angle = 0) {
		context.save();
		context.translate(x, y);
		context.rotate(angle);
		this.drawCrop(context, index, 0, 0, width, height);
		context.restore();

		return this;
	}


	drawCropAngleScale (context, index = 0, x = 0, y = 0, width = this.width, height = this.height, angle = 0, sx = 1, sy = 1) {
		context.save();
		context.translate(x, y);
		context.scale(sx, sy)
		context.rotate(angle);
		this.drawCrop(context, index, 0, 0, width, height);
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

	drawAngleScale (context, index, x, y, angle, sx, sy) {
		context.save();
		context.translate(x, y);
		context.scale(sx, sy)
		context.rotate(angle);
		this.drawSimple(context, index, 0, 0);
		context.restore();

		return this;
	}

	drawScale (context, index, x, y, scaleX, scaleY) {
		let sx = (index % this.length) * this.width;
		let sy = Math.floor(index / this.length) * this.height;

		let offsetX = x - this.centerX * scaleX;
		let offsetY = y - this.centerY * scaleY;

		context.drawImage(this.image, sx, sy, this.width, this.height, offsetX, offsetY, this.width * scaleX, this.height * scaleY);

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
