import { Color } from 'casperlamboo/Math';
import { MathExtended, Vector, Matrix } from 'casperlamboo/Math';

const POINT = new Vector();
const POINT_A = new Vector();
const POINT_B = new Vector();

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

		this.points = points.map(({x, y}) => new Vector(x, y));
	}

	addPoint (...points) {
		for (let i = 0; i < points.length; i ++) {
			const point = new Vector().copy(points[i]);

			this.points.push(point);
		}

		return this;
	}

  // TODO doesnt work because cannot do index check
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
			point.applyMatrix(matrix);
		}

		return this;
	}


	area () {
		let area = 0;

		for (let i = 0; i < this.points.length; i ++) {
			POINT_A.copy(this.points[i]).applyMatrix(this);
			POINT_B.copy(this.points[(i + 1) % this.points.length]).applyMatrix(this);

      area += POINT_A.x * POINT_B.y;
      area -= POINT_B.x * POINT_A.y;
    }
    return area / 2;
	}

	isClockWise() {
		return this.area() > 0;
	}

	setClockWise(clockWise) {
		if (this.isClockWise() !== clockWise) {
			this.points.reverse();
		}

		return this;
	}

	getBoundingBox (applyMatrix = false) {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (let i = 0; i < this.points.length; i ++) {
			const point = applyMatrix ? POINT.copy(this.points[i]).applyMatrix(this) : this.points[i];

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
		POINT_A.copy(this.points[((i+1) % this.points.length)]);
		POINT_B.copy(this.points[i]);

		return POINT_A.subtract(POINT_B).normal().normalize();
	}

	setContext (context, matrix = this) {
		const length = this.closePath ? (this.points.length + 1) : this.points.length;
		for (let i = 0; i < length; i ++) {
			POINT.copy(this.points[i % this.points.length]).applyMatrix(matrix);

			if (i === 0) {
				context.moveTo(POINT.x, POINT.y);
			} else {
				context.lineTo(POINT.x, POINT.y);
			}
		}

		return this;
	}

	clip (context, matrix) {
		context.beginPath();
		this.setContext(context, matrix);
		context.clip();

		return this;
	}

	fill (context, matrix) {
		context.beginPath();
		this.setContext(context, matrix);

		this.shapeColor.setFill(context);

		context.fill();

		return this;
	}

	stroke (context, matrix) {
		context.beginPath();
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
		context.beginPath();
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
