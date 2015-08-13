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
		this.x = vector.x;
		this.y = vector.y;

		return this;
	}

	add (vector) {
		var x = this.x + vector.x;
		var y = this.y + vector.y;

		return new Vector(x, y);
	}

	subtract (vector) {
		var x = this.x - vector.x;
		var y = this.y - vector.y;

		return new Vector(x, y);
	}

	scale (scalar) {
		var x = this.x * scalar;
		var y = this.y * scalar;

		return new Vector(x, y);
	}

	rotate (angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var x = cos*this.x - sin*this.y;
		var y = sin*this.x + cos*this.y;

		return new Vector(x, y);
	}

	multiply (vector) {
		var x = this.x * vector.x;
		var y = this.y * vector.y;

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
		var length = this.length();

		var x = this.x / length;
		var y = this.y / length;

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
		var x = Math.round(this.x);
		var y = Math.round(this.y);

		return new Vector(x, y);
	}

	applyMatrix (matrix) {
		var m = matrix.matrix;

		var x = m[0]*this.x + m[1]*this.y + m[2];
		var y = m[3]*this.x + m[4]*this.y + m[5];

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
		var end = new Vector(this.x + x, this.y + y);
		var arrowOrigin = new Vector(x, y).add(this.subtract(this.normalize().scale(10)));
		var left = this.normal().normalize().scale(10).add(arrowOrigin);
		var right = this.normal().normalize().scale(-10).add(arrowOrigin);

		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(end.x, end.y);
		context.moveTo(left.x, left.y);
		context.lineTo(end.x, end.y);
		context.lineTo(right.x, right.y);

		context.stroke();
	}
};