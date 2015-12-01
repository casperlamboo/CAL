import Matrix from '../math/matrix.js';
import Color from '../math/color.js';
import Vector from '../math/vector.js';
import {MathExtended} from '../core/utils.js';

export default class Shape extends Matrix {
	constructor (options = {}) {
		super(options);

		let {
			visible = true, 
			depth = 0, 
			closePath = true, 
			lineColor = new Color(), 
			shapeColor = new Color(), 
			lineWidth = 0, 
			lineJoin = 'round', 
			lineCap = 'round', 
			points = [], 
			shadow = false, 
			shadowOffsetX = 0, 
			shadowOffsetY = 0, 
			shadowBlur = 10, 
			shadowColor = new Color()
		} = options;

		this.visible = visible;
		this.active = false;
		this.depth = depth;

		this.closePath = closePath;
		this.lineColor = lineColor;
		this.shapeColor = shapeColor;
		this.lineWidth = lineWidth;
		this.lineJoin = lineJoin;
		this.lineCap = lineCap;

		this.shadow = shadow;
		this.shadowOffsetX = shadowOffsetX;
		this.shadowOffsetY = shadowOffsetY;
		this.shadowBlur = shadowBlur;
		this.shadowColor = shadowColor;

		this.points = points;
	}

	addPoint (...points) {
		for (let i = 0; i < points.length; i ++) {
			let point = points[i];

			if (point instanceof Vector) {
				this.points.push(point);
			}
		}

		return this;
	}

	removePoint (...points) {
		for (let i = 0; i < points.length; i ++) {
			let point = points[i];

			let index = this.points.indexOf(point);
			if (index !== -1) {
				this.points.splice(index, 1);
			}
		}

		return this;
	}

	applyMatrix (matrix) {
		for (let i = 0; i < this.points.length; i ++) {
			let point = this.points[i];
			point.copy(point.applyMatrix(matrix));
		}

		return this;
	}

	clean (treshold = 0) {
		// clean should be relative to it's own length
		let pointsRemoved = 0;

		for (let i = 2; i < this.points.length; i ++) {
			let previousPoint = this.points[i - 2];
			let currentPoint = this.points[i - 1];
			let nextPoint = this.points[i];

			let normal = nextPoint.subtract(previousPoint).normal().normalize();
			let distance = Math.abs(normal.dot(currentPoint.subtract(previousPoint)));

			if (distance <= treshold) {
				this.removePoint(currentPoint);
				i --;
				pointsRemoved ++;
			}
		}

		return pointsRemoved;
	}

	hit (vector, matrix) {
		if (matrix instanceof Matrix) {
			vector = vector.applyMatrix(matrix.multiplyMatrix(this.inverseMatrix()));
		}
		else {
			vector = vector.applyMatrix(this.inverseMatrix());
		}

		if (this.points.length < 3) {
			return false;
		}

		for (let i = 0; i < this.points.length; i ++) {
			if (vector.subtract(this.points[i]).dot(this.getNormal(i)) > 0) {
				return false;
			}
		}

		return true;
	}

	getBoundingBox (applyMatrix = false) {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (let i = 0; i < this.points.length; i ++) {
			let point = applyMatrix ? this.points[i].applyMatrix(this) : this.points[i];

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

	isSelfIntersecting () {
		let intersections = [];

		for (var i = 0; i < this.points.length - 1; i ++) {
			let lineA = {
				pointA: this.points[i], 
				pointB: this.points[i + 1]
			};

			for (var j = i + 3; j < this.points.length - 1; j ++) {
				let lineB = {
					pointA: this.points[j], 
					pointB: this.points[j + 1]
				}

				let intersection = MathExtended.lineCollision(lineA.pointA, lineA.pointB, lineB.pointA, lineB.pointB);

				if (intersection) {
					intersections.push(intersection);
				}
			}
		}

		return intersections;
	}

	removeSelfIntersecting () {
		let shapes = [];
		let pointCollections = [this.points];


		for (let i = 0; i < pointCollections.length; i ++) {
			let points = pointCollections[i];

			for (let j = 0; j < points.length - 1; j ++) {
				let lineA = {
					pointA: points[j], 
					pointB: points[j + 1]
				};

				for (let k = j + 3; k < points.length - 1; k ++) {
					let lineB = {
						pointA: points[k], 
						pointB: points[k + 1]
					}

					let intersection = MathExtended.lineCollision(lineA.pointA, lineA.pointB, lineB.pointA, lineB.pointB);

					if (intersection) {
						let shape = new Shape({
							points: [intersection, ...points.splice(j+1, k-j, intersection.clone())], 
							closePath: true, 
							lineWidth: this.lineWidth, 
							lineCap: this.lineCap, 
							lineColor: this.lineColor, 
							shapeColor: this.shapeColor, 
							lineJoin: this.lineJoin
						});

						shapes.push(shape);

						pointCollections.push(shape.points);
					}
				}
			}
		}

		return shapes;
	}

	getNormal (i) {
		let pointA = this.points[((i+1) % this.points.length)];
		let pointB = this.points[i];

		return pointA.subtract(pointB).normal().normalize();
	}

	setContext (context, matrix = this) {
		context.beginPath();

		let currentPoint = this.points[0].applyMatrix(matrix);

		context.moveTo(currentPoint.x, currentPoint.y);

		let length = this.closePath ? (this.points.length + 1) : this.points.length;
		for (let i = 0; i < length; i ++) {
			let point = this.points[i % this.points.length].applyMatrix(matrix);

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

		if (this.shadow) {
			context.save();
			this.shadowColor.setShadow(context);
			context.shadowBlur = this.shadowBlur;
			context.shadowOffsetX = this.shadowOffsetX;
			context.shadowOffsetY = this.shadowOffsetY;
		}

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

		if (this.shadow) {
			context.restore();
		}
	}
};
