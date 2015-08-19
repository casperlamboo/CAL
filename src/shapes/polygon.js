import Shape from '../object/shape.js';

export default class Polygon extends Shape {

	constructor (angles, radius, options) {
		super(options);

		this.set(angles);
	}

	set (angles = 8, radius = 100) {
		this.points = [];

		this.angles = angles;
		this.radius = radius;

		for (var rad = 0; rad < Math.PI*2; rad += Math.PI*2 / this.angles) {
			var x = Math.cos(rad) * this.radius;
			var y = Math.sin(rad) * this.radius;

			this.addPoint(new CAL.Vector(x, y));
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
