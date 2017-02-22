export default class Vector {
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	identity () {
		this.x = 0;
		this.y = 0;

		return this;
	}

	set (x, y) {
		this.x = x;
		this.y = y;

		return this;
	}

	copy (vector) {
		this.set(vector.x, vector.y);

		return this;
	}

	add (vector) {
		const x = this.x + vector.x;
		const y = this.y + vector.y;

		return new Vector(x, y);
	}

	subtract (vector) {
		const x = this.x - vector.x;
		const y = this.y - vector.y;

		return new Vector(x, y);
	}

	scale (scalar) {
		const x = this.x * scalar;
		const y = this.y * scalar;

		return new Vector(x, y);
	}

	rotate (angle) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const x = cos*this.x - sin*this.y;
		const y = sin*this.x + cos*this.y;

		return new Vector(x, y);
	}

	multiply (vector) {
		const x = this.x * vector.x;
		const y = this.y * vector.y;

		return new Vector(x, y);
	}

	setLength (length) {
		return new Vector().copy(this).normalize().scale(length);
	}

	length () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normal () {
		return new Vector(this.y, -this.x);
	}

	normalize () {
		const length = this.length();

		const x = this.x / length;
		const y = this.y / length;

		return new Vector(x, y);
	}

	angle () {
		return Math.atan2(this.y, this.x);
	}

	dot (vector) {
		return this.x * vector.x + this.y * vector.y;
	}

	cross (vector) {
		return this.x * vector.y - this.y * vector.x;
	}

	round () {
		const x = Math.round(this.x);
		const y = Math.round(this.y);

		return new Vector(x, y);
	}

	applyMatrix (matrix) {
		const m = matrix.matrix;

		const x = m[0]*this.x + m[1]*this.y + m[2];
		const y = m[3]*this.x + m[4]*this.y + m[5];

		return new Vector(x, y);
	}

	distanceTo (vector) {
		return this.subtract(vector).length();
	}

	clone () {
		return new Vector().copy(this);
	}

	equals (vector) {
		return this.x === vector.x && this.y === vector.y;
	}

	draw (context, x = 0, y = 0) {
		const end = new Vector(this.x + x, this.y + y);
		const arrowOrigin = new Vector(x, y).add(this.subtract(this.normalize().scale(10)));
		const left = this.normal().normalize().scale(10).add(arrowOrigin);
		const right = this.normal().normalize().scale(-10).add(arrowOrigin);

		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(end.x, end.y);
		context.moveTo(left.x, left.y);
		context.lineTo(end.x, end.y);
		context.lineTo(right.x, right.y);

		context.stroke();
	}

	toJSON () {
		return {
			metadata: {
				library: 'CAL',
				type: 'Vector'
			},
			x: this.x,
			y: this.y
		};
	}

	fromJSON (json) {
		this.copy(json);
		return this;
	}
	
	toString () {
		return `${this.x.toFixed(2)}x${this.y.toFixed(2)}`;
	}
};
