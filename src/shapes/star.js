import Shape from '../object/shape.js';
import Vector from '../math/vector.js';

export default class Star extends Shape {
	constructor (rays, outerRadius, innerRadius, options) {
		super(options);

		this.closePath = true;

		this.set(rays, outerRadius, innerRadius);
	}

	set (rays = 5, outerRadius = 100, innerRadius = 50) {
		this.rays = rays;
		this.outerRadius = outerRadius;
		this.innerRadius = innerRadius;

		this.points = [];

		let even = false;
		for (let rad = 0; rad < Math.PI*2; rad += Math.PI / this.rays) {
			let radius = even ? this.outerRadius : this.innerRadius;

			let x = Math.sin(rad) * radius;
			let y = Math.cos(rad) * radius;

			this.addPoint(new Vector(x, y));

			even = !even;
		}
	}

	toShape () {
		return new Shape({
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
