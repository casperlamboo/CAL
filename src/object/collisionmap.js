import Matrix from '../math/matrix.js';
import Surface from '../core/surface.js';
import Shape from '../object/shape.js';
import Color from '../math/color.js';

export default class CollsionMap extends Matrix {
	
	createFromShape (shape, {margin = 0, applyMatrix = false, fill}) {
		let boundingBox = shape.getBoundingBox(applyMatrix);

		let lineWidth = Math.ceil((shape.lineWidth + margin)/2);

		this.width = Math.ceil(boundingBox.width) + lineWidth*2;
		this.height = Math.ceil(boundingBox.height) + lineWidth*2;

		this.x = -boundingBox.left + lineWidth;
		this.y = -boundingBox.top + lineWidth;

		let surface = new Surface({
			width: this.width, 
			height: this.height
		});

		let collisionShape = new Shape({
			points: shape.points, 
			lineWidth: lineWidth * 2, 
			lineColor: new Color(), 
			shapeColor: ((shape.shapeColor || fill) ? new Color() : false), 
			closePath: (shape.shapeColor || shape.closePath)
		});

		let matrix = applyMatrix ? shape.multiplyMatrix(this) : this;
		collisionShape.draw(surface.context, matrix);

		let imageData = surface.getImageData();

		this.createFromImageData(imageData);

		return this;		
	}

	createFromImageData (imageData) {
		this.map = [];
		for (let dataIndex = 3, mapIndex = 0; dataIndex < imageData.data.length; dataIndex += 4, mapIndex ++) {
			this.map[mapIndex] = (imageData.data[dataIndex] > 125);
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

	mouse
}
