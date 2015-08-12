"use strict";

CAL.Circle = class extends CAL.Shape {

	constructor (radius, options) {
		super(options);

		this.set(radius);
	}

	set (radius) {
		this.points = [];

		this.radius = (typeof radius === "number") ? radius : 100;
		var offset = 4 * (Math.sqrt(2) - 1) / 3 * radius;

		this.addPoint(
			new CAL.BezierPoint(new CAL.Vector(0, radius), new CAL.Vector(-offset, radius), new CAL.Vector(offset, radius)), 
			new CAL.BezierPoint(new CAL.Vector(radius, 0), new CAL.Vector(radius, offset), new CAL.Vector(radius, -offset)), 
			new CAL.BezierPoint(new CAL.Vector(0, -radius), new CAL.Vector(offset, -radius), new CAL.Vector(-offset, -radius)), 
			new CAL.BezierPoint(new CAL.Vector(-radius, 0), new CAL.Vector(-radius, -offset), new CAL.Vector(-radius, offset))
		);
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