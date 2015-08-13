import Matrix from '../math/matrix.js';
import Color from '../math/color.js';
import Vector from '../math/vector.js';

export default class Shape extends Matrix {
	constructor (options = {}) {
		super(options);

		let {visible = true, depth = 0, closePath = true, lineColor = new Color(), shapeColor = new Color(), lineWidth = 0, lineJoin = 'round', lineCap = 'round', points = []} = options;

		this.visible = visible;
		this.active = false;
		this.depth = depth;

		this.closePath = closePath;
		this.lineColor = lineColor;
		this.shapeColor = shapeColor;
		this.lineWidth = lineWidth;
		this.lineJoin = lineJoin;
		this.lineCap = lineCap;

		this.points = points;
	}

	addPoint (...points) {
		for (var i = 0; i < points.length; i ++) {
			var point = points[i];

			if (point instanceof Vector) {
				this.points.push(point);
			}
		}

		return this;
	}

	applyMatrix (matrix) {
		for (var i = 0; i < this.points.length; i ++) {
			var point = this.points[i];
			point.copy(point.applyMatrix(matrix));
		}

		return this;
	}

	hit (vector, matrix) {
		if (matrix instanceof Matrix) {
			vector = vector.applyMatrix(matrix.multiplyMatrix(this.inverseMatrix()));
		}
		else {
			vector = vector.applyMatrix(this.inverseMatrix());
		}

		if (this.points.length <= 3) {
			return false;
		}

		for (var i = 0; i < this.points.length; i ++) {
			if (vector.subtract(this.points[i]).dot(this.getNormal(i)) > 0) {
				return false;
			}
		}

		return true;
	}

	getBoundingBox (applyMatrix = false) {
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;

		for (var i = 0; i < this.points.length; i ++) {
			var point = applyMatrix ? this.points[i].applyMatrix(this) : this.points[i];

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

	getNormal (i) {
		var pointA = this.points[((i+1)%this.points.length)];
		var pointB = this.points[i];

		return pointA.subtract(pointB).normal().normalize();
	}

	setContext (context, matrix = this) {
		var matrix = matrix;

		context.beginPath();

		var currentPoint = this.points[0].applyMatrix(matrix);

		context.moveTo(currentPoint.x, currentPoint.y);

		var length = this.closePath ? (this.points.length + 1) : this.points.length;
		for (var i = 0; i < length; i ++) {
			var point = this.points[i % this.points.length].applyMatrix(matrix);

			context.lineTo(point.x, point.y);
		}

		return this;
	}

	clip (context, matrix) {
		this.setContext(context, matrix);
		context.clip();

		return this;
	}

	fill (context, matrix) {
		this.setContext(context, matrix);

		this.shapeColor.setFill(context);

		context.fill();

		return this;
	}

	stroke (context, matrix) {
		this.setContext(context, matrix);

		context.lineColor = this.lineColor;
		context.lineWidth = this.lineWidth;
		context.lineJoin = this.lineJoin;
		context.lineCap = this.lineCap;

		this.lineColor.setStroke(context);

		context.stroke();

		return this;
	}

	draw (context, matrix) {
		this.setContext(context, matrix);

		if (this.shapeColor) {
			this.shapeColor.setFill(context);
			context.fill();
		}

		if (this.lineColor) {
			context.lineColor = this.lineColor;
			context.lineWidth = this.lineWidth;
			context.lineJoin = this.lineJoin;
			context.lineCap = this.lineCap;
			this.lineColor.setStroke(context);
			context.stroke();
		}
	}
};