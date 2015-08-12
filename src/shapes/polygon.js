"use strict";

CAL.Polygon = class extends CAL.Shape {

	constructor (angles, radius, options) {
		super(options);

		this.set(angles);
	}

	set (angles, radius) {
		this.points = [];

		this.angles = angles || 8;
		this.radius = radius || 100;

		for (var rad = 0; rad < Math.PI*2; rad += Math.PI*2 / this.angles) {
			var x = Math.cos(rad) * this.radius;
			var y = Math.sin(rad) * this.radius;

			this.addPoint(new CAL.BezierPoint(new CAL.Vector(x, y), null, null));
		}
	}

	toShape () {
		return new CAL.Shape({
			points: this.points, 
			closedPath: true, 
			lineColor: this.lineColor, 
			shapeColor: this.shapeColor, 
			lineWidth: this.lineWidth, 
			lineJoin: this.lineJoin, 
			lineCap: this.lineCap, 
			matrix: this.matrix
		});
	}

};