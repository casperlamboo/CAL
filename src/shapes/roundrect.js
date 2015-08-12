"use strict";

CAL.RoundRect = class extends CAL.Shape {

	constructor (radius, width, height, options) {
		super(options);

		this.set(radius, width, height);
	}

	set (radius, width, height) {
		this.points = [];

		this.radius = (typeof radius === "number") ? radius : 50;
		this.width = (typeof width === "number") ? width :  200;
		this.height = (typeof height === "number") ? height :  200;

		this.addPoint(
			new CAL.Vector(-this.width / 2, -this.height / 2), 
			new CAL.Vector(-this.width / 2, this.height / 2), 
			new CAL.Vector(this.width / 2, this.height / 2), 
			new CAL.Vector(this.width / 2, -this.height / 2)
		);
	}

	toShape () {
		var points = [];

		var prevPoint;
		var currentPoint = this.points[this.points.length - 1].position.applyMatrix(this);
		var nextPoint = this.points[0].position.applyMatrix(this);

		for (var i = 0; i < this.points.length; i ++) {
			prevPoint = currentPoint;
			currentPoint = nextPoint;
			var nextPoint = this.points[(i + 1) % this.points.length].position.applyMatrix(this);

			var maxRadius = Math.min(prevPoint.subtract(currentPoint).length(), nextPoint.subtract(currentPoint).length()) / 2;
			var radius = Math.min(this.radius, maxRadius);

			var start = currentPoint.add(prevPoint.subtract(currentPoint).setLength(radius));
			var end = currentPoint.add(nextPoint.subtract(currentPoint).setLength(radius));

			var handleIn = currentPoint.add(prevPoint.subtract(currentPoint).setLength(radius / 3));
			var handleOut = currentPoint.add(nextPoint.subtract(currentPoint).setLength(radius / 3));

			var inverseMatrix = this.inverseMatrix();

			points.push(new CAL.BezierPoint(new CAL.Vector().copy(start).applyMatrix(inverseMatrix), null, new CAL.Vector().copy(handleIn).applyMatrix(inverseMatrix)));
			points.push(new CAL.BezierPoint(new CAL.Vector().copy(end).applyMatrix(inverseMatrix), new CAL.Vector().copy(handleOut).applyMatrix(inverseMatrix), null));
		}

		return new CAL.Shape({
			points: points, 
			closedPath: true, 
			lineColor: this.lineColor, 
			shapeColor: this.shapeColor, 
			lineWidth: this.lineWidth, 
			lineJoin: this.lineJoin, 
			lineCap: this.lineCap, 
			matrix: this.matrix
		});
	}

	setContext (context, matrix) {
		var matrix = matrix || this;
		context.beginPath();

		var prevPoint;
		var currentPoint = this.points[this.points.length - 1].position.applyMatrix(matrix);
		var nextPoint = this.points[0].position.applyMatrix(matrix);

		for (var i = 0; i < this.points.length; i ++) {
			prevPoint = currentPoint;
			currentPoint = nextPoint;
			var nextPoint = this.points[(i + 1) % this.points.length].position.applyMatrix(matrix);

			var maxRadius = Math.min(prevPoint.subtract(currentPoint).length(), nextPoint.subtract(currentPoint).length()) / 2;
			var radius = Math.min(this.radius, maxRadius);

			var start = currentPoint.add(prevPoint.subtract(currentPoint).setLength(radius));
			var end = currentPoint.add(nextPoint.subtract(currentPoint).setLength(radius));

			context.lineTo(start.x, start.y);
			context.quadraticCurveTo(currentPoint.x, currentPoint.y, end.x, end.y);
		}
		context.closePath();
	}
};