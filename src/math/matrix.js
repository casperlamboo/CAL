import {MathExtended} from '../core/utils.js';

export default class Matrix {
	constructor (options) {
		if (options === undefined) {
			this.identity();
		}
		else if (options instanceof Array) {
			this.matrix = options;
		}
		else {
			let {matrix} = options;

			if (options.matrix instanceof Array) {
				this.matrix = options.matrix;
			}
			if (typeof options.x === 'number') {
				this._x = options.x;
			}
			if (typeof options.y === 'number') {
				this._y = options.y;
			}
			if (typeof options.sx === 'number') {
				this._sx = options.sx;
			}
			if (typeof options.sy === 'number') {
				this._sy = options.sy;
			}
			if (typeof options.rotation === 'number') {
				this._rotation = options.rotation;
			}

			if (this._matrix === undefined) {
				this._x = (typeof this._x === 'number') ? this._x : 0;
				this._y = (typeof this._y === 'number') ? this._y : 0;
				this._sx = (typeof this._sx === 'number') ? this._sx : 1;
				this._sy = (typeof this._sy === 'number') ? this._sy : 1;
				this._rotation = (typeof this._rotation === 'number') ? this._rotation : 0;
			}
		}
	}

	get sx () {
		if (this._sx === undefined) {
			this._sx = Math.sqrt(Math.pow(this._matrix[0], 2) + Math.pow(this._matrix[3], 2));
		}

		return this._sx;
	}

	set sx (sx) {
		this.rotation;
		this.x;
		this.y;
		this.sy;

		this._sx = sx;

		delete this._matrix;
	}

	get sy () {
		if (this._sy === undefined) {
			this._sy = MathExtended.sign(this.determinant()) * Math.sqrt(Math.pow(this._matrix[1], 2) + Math.pow(this._matrix[4], 2));
		}

		return this._sy;
	}

	set sy (sy) {
		this.rotation;
		this.x;
		this.y;
		this.sx;

		this._sy = sy;

		delete this._matrix;
	}

	set scale (scale) {
		this.rotation;
		this.x;
		this.y;

		this._sx = scale;
		this._sy = scale;

		delete this._matrix;
	}

	get rotation () {
		if (this._rotation === undefined) {
			this._rotation = Math.atan2(-this._matrix[3], this._matrix[0]);
		}

		return this._rotation;
	}

	set rotation (rotation) {
		this.x;
		this.y;
		this.sx;
		this.sy;

		this._rotation = rotation;

		delete this._matrix;
	}

	get x () {
		if (this._x === undefined) {
			this._x = this._matrix[2];
		}

		return this._x;
	}

	set x (x) {
		this.rotation;
		this.y;
		this.sx;
		this.sy;

		this._x = x;

		if (this._matrix !== undefined) {
			this._matrix[2] = x;
		}
	}

	get y () {
		if (this._y === undefined) {
			this._y = this._matrix[5];
		}

		return this._y;
	}

	set y (y) {
		this.rotation;
		this.x;
		this.sx;
		this.sy;

		this._y = y;

		if (this._matrix !== undefined) {
			this._matrix[5] = y;
		}
 	}

	get matrix () {
		if (this._matrix === undefined) {
			let sin = Math.sin(this._rotation);
			let cos = Math.cos(this._rotation)

			this._matrix = [
				this._sx * cos, this._sy * sin, this._x,
				-this._sx * sin, this._sy * cos, this._y
			];
		}

		return this._matrix;
	}

	set matrix (m) {
		this._matrix = m;

		delete this._x;
		delete this._y;
		delete this._sx;
		delete this._sy;
		delete this._rotation;
	}

	identity () {
		this._matrix = [
			1, 0, 0,
			0, 1, 0
		];

		this._x = 0;
		this._y = 0;
		this._sx = 1;
		this._sy = 1;
		this._rotation = 0;

		return this;
	}

	multiplyMatrix (m) {
		let a = this.matrix;
		let b = m.matrix;

		return new Matrix([
			a[0]*b[0] + a[3]*b[1], a[1]*b[0] + a[4]*b[1], a[2]*b[0] + a[5]*b[1] + b[2],
			a[0]*b[3] + a[3]*b[4], a[1]*b[3] + a[4]*b[4], a[2]*b[3] + a[5]*b[4] + b[5]
		]);
	}

	determinant () {
		let m = this.matrix;
		return 1 / (m[0]*m[4] - m[1]*m[3]);
	}

	inverseMatrix () {
		let m = this.matrix;
		let det = this.determinant();

		return new Matrix([
			 det * m[4], -det * m[1],  det * (m[1]*m[5] - m[2]*m[4]),
			-det * m[3],  det * m[0], -det * (m[0]*m[5] - m[2]*m[3])
		]);
	}

	translate (x, y) {
		let matrix = this.clone();
		matrix.x += x;
		matrix.y += y;

		return matrix;
	}

	normalize () {
		let matrix = this.clone();
		matrix.x = 0;
		matrix.y = 0;

		return matrix;
	}

	equals (a) {
		const b = this;

		if (a._x !== undefined && b._x !== undefined) {
			return (
				a._x === b._x &&
				a._y === b._y &&
				a._sx === b._sx &&
				a._sy === b._sy &&
				a._rotation === b._rotation
			);
		} else {
			return (
				a.matrix[0] === b.matrix[0] &&
				a.matrix[1] === b.matrix[1] &&
				a.matrix[2] === b.matrix[2] &&
				a.matrix[3] === b.matrix[3] &&
				a.matrix[4] === b.matrix[4] &&
				a.matrix[5] === b.matrix[5]
			);
		}
	}

	copyMatrix (matrix) {
		this._matrix = matrix._matrix ? [...matrix._matrix] : undefined;
		this._x = matrix._x;
		this._y = matrix._y;
		this._sx = matrix._sx;
		this._sy = matrix._sy;
		this._rotation = matrix._rotation;

		return this;
	}
	setMatrixContext (context) {
		let m = this.matrix;
		context.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
	}

	rotateAroundAbsolute (angle, center) {
		this.rotateAroundRelative(angle, center.applyMatrix(this.inverseMatrix()));

		return this;
	}

	rotateAroundRelative (angle, center) {
		if (angle !== 0) {
			let before = center.applyMatrix(this);

			this.rotation = angle;

			let after = center.applyMatrix(this);

			let offset = before.subtract(after);

			this.x += offset.x;
			this.y += offset.y;
		}

		return this;
	}

	scaleAroundAbsolute (sx, sy, center) {
		this.scaleAroundRelative(sx, sy, center.applyMatrix(this.inverseMatrix()));

		return this;
	}

	scaleAroundRelative (sx, sy, center) {
		let before = center.applyMatrix(this);

		this.sx = sx;
		this.sy = sy;

		let after = center.applyMatrix(this);

		let offset = before.subtract(after);

		this.x += offset.x;
		this.y += offset.y;

		return this;
	}

	clone () {
		return new Matrix({
			matrix: this._matrix,
			x: this._x,
			y: this._y,
			sx: this._sx,
			sy: this._sy,
			rotation: this._rotation
		});
	}

	toJSON () {
		return {
			metadata: {
				library: 'CAL',
				type: 'Matrix'
			},
			matrix: this.matrix
		};
	}

	fromJSON (json) {
		this.matrix = json.matrix;
	}
}
