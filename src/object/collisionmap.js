import Matrix from '../math/matrix.js';
import Surface from '../core/surface.js';
import Shape from '../object/shape.js';
import Color from '../math/color.js';

export default class CollsionMap extends Matrix {

	createFromImage (image, {applyMatrix = false}) {
		let boundingBox = image.getBoundingBox(applyMatrix);

		this.width = Math.ceil(boundingBox.width);
		this.height = Math.ceil(boundingBox.height);

		this.x = -boundingBox.left;
		this.y = -boundingBox.top;

		this._applyMap(image, applyMatrix);

		return this;
	}

	createFromShape (shape, {margin = 0, applyMatrix = false, fill = false}) {
		let boundingBox = shape.getBoundingBox(applyMatrix);

		let lineWidth = Math.ceil((shape.lineWidth + margin) / 2);

		this.width = Math.ceil(boundingBox.width) + lineWidth * 2;
		this.height = Math.ceil(boundingBox.height) + lineWidth * 2;

		this.x = -boundingBox.left + lineWidth;
		this.y = -boundingBox.top + lineWidth;

		let collisionShape = new Shape({
			points: shape.points,
			lineWidth: lineWidth * 2,
			lineColor: new Color(),
			shapeColor: ((shape.shapeColor || fill) ? new Color() : false),
			closePath: (shape.shapeColor || shape.closePath)
		}).copyMatrix(shape);

		this._applyMap(collisionShape, applyMatrix);

		return this;
	}

	_applyMap (image, applyMatrix) {
		let surface = new Surface({
			width: this.width,
			height: this.height
		});

		let matrix = applyMatrix ? image.multiplyMatrix(this) : this;
		image.draw(surface.context, matrix);

		let imageData = surface.getImageData();

		this.map = [];
		for (let index = 3; index < imageData.data.length; index += 4) {
			this.map.push(imageData.data[index] > 125);
		}

		return this;
	}

	hit (vector, matrix) {
		matrix = matrix ? matrix.inverseMatrix().multiplyMatrix(this) : this;
		vector = vector.applyMatrix(matrix).round();

		if (vector.x < 0 || vector.y < 0 || vector.x >= this.width || vector.y >= this.height) {
			return false;
		}

		let index = vector.y * this.width + vector.x;

		return this.map[index];
	}
}
