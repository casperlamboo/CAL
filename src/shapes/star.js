"use strict";

CAL.Star = class extends CAL.Shape {

	constructor (rays, outerRadius, innerRadius, options) {
		super(options);

		this.set(rays, outerRadius, innerRadius);
	}

	set (rays, outerRadius, innerRadius) {
		this.rays = rays || 5;
		this.outerRadius = (typeof outerRadius === "number") ? outerRadius : 100;
		this.innerRadius = (typeof innerRadius === "number") ? innerRadius : 50;

		this.points = [];

		var even = true;
		for (var rad = 0; rad <= Math.PI*2; rad += Math.PI / this.rays) {
			var radius = even ? this.outerRadius : this.innerRadius;

			var x = Math.cos(rad) * radius;
			var y = Math.sin(rad) * radius;

			this.addPoint(new CAL.BezierPoint(new CAL.Vector(x, y), null, null));

			even = !even;
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