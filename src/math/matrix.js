import { MathExtended } from '../core/utils.js';

export default class Matrix {
	constructor (options) {
		if (options === undefined) {
			this.identity;
			return;
		}

		if (options instanceof Array) {
			options = new Float64Array(options);
		}

		if (options instanceof Float64Array) {
			this.hasMatrix = true;
			this._matrix = options;

			this.hasX = false;
			this._x = 0;
			this.hasY = false;
			this._y = 0;
			this.hasSx = false;
			this._sx = 1;
			this.hasSy = false;
			this._sy = 1;
			this.hasRotation = false;
			this._rotation = 0;
		} else {
			if (options.matrix instanceof Array) {
				options.matrix = new Float64Array(options.matrix);
			}

			if (options.matrix instanceof Float64Array) {
				this.hasMatrix = true;
				this._matrix = options.matrix;
			} else {
				this.hasMatrix = false;
				this._matrix  = new Float64Array([
					1, 0, 0,
					0, 1, 0
				]);
			}
			if (typeof options.x === 'number') {
				this.hasX = true;
				this._x = options.x;
			} else {
				this.hasX = !this.hasMatrix;
				this._x = 0;
			}
			if (typeof options.y === 'number') {
				this.hasY = true;
				this._y = options.y;
			} else {
				this.hasY = !this.hasMatrix;
				this._y = 0;
			}
			if (typeof options.sx === 'number') {
				this.hasSx = true;
				this._sx = options.sx;
			} else {
				this.hasSx = !this.hasMatrix;
				this._sx = 1;
			}
			if (typeof options.sy === 'number') {
				this.hasSy = true;
				this._sy = options.sy;
			} else {
				this.hasSy = !this.hasMatrix;
				this._sy = 1;
			}
			if (typeof options.rotation === 'number') {
				this.hasRotation = true;
				this._rotation = options.rotation;
			} else {
				this.hasRotation = !this.hasMatrix;
				this._rotation = 0;
			}
		}
	}

	get sx () {
		if (!this.hasSx) {
			this.hasSx = true;
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

		this.hasMatrix = false;;
	}

	get sy () {
		if (!this.hasSy) {
			this.hasSy = true;
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

		this.hasMatrix = false;;
	}

	set scale (scale) {
		this.rotation;
		this.x;
		this.y;

		this._sx = scale;
		this._sy = scale;

		this.hasMatrix = false;;
	}

	get rotation () {
		if (!this.hasRotation) {
			this.hasRotation = true;
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

		this.hasMatrix = false;;
	}

	get x () {
		if (!this.hasX) {
			this.hasX = true;
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

		if (this.hasMatrix) {
			this._matrix[2] = x;
		}
	}

	get y () {
		if (!this.hasY) {
			this.hasY = true;
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

		if (this.hasMatrix) {
			this._matrix[5] = y;
		}
 	}

	get matrix () {
		if (!this.hasMatrix) {
			this.hasMatrix = true;
			const sin = Math.sin(this._rotation);
			const cos = Math.cos(this._rotation)

			this._matrix = new Float64Array([
				this._sx * cos, this._sy * sin, this._x,
				-this._sx * sin, this._sy * cos, this._y
			]);
		}

		return this._matrix;
	}

	set matrix (m) {
		this.hasMatrix = true;
		this._matrix = m;

		this.hasX = false;
		this.hasY = false;
		this.hasSx = false;
		this.hasSy = false;
		this.hasRotation = false;
	}

	identity () {
		this.hasMatrix = true;
		this._matrix = new Float64Array([
			1, 0, 0,
			0, 1, 0
		]);

		this.hasX = true;
		this._x = 0;
		this.hasY = true;
		this._y = 0;
		this.hasSx = true;
		this._sx = 1;
		this.hasSy = true;
		this._sy = 1;
		this.hasRotation = true;
		this._rotation = 0;

		return this;
	}

	multiplyMatrix (m) {
		const a = this.matrix;
		const b = m.matrix;

		return new Matrix(new Float64Array([
			a[0]*b[0] + a[3]*b[1], a[1]*b[0] + a[4]*b[1], a[2]*b[0] + a[5]*b[1] + b[2],
			a[0]*b[3] + a[3]*b[4], a[1]*b[3] + a[4]*b[4], a[2]*b[3] + a[5]*b[4] + b[5]
		]));
	}

	determinant () {
		const m = this.matrix;
		return 1 / (m[0]*m[4] - m[1]*m[3]);
	}

	inverseMatrix () {
		const m = this.matrix;
		const det = this.determinant();

		return new Matrix(new Float64Array([
			 det * m[4], -det * m[1],  det * (m[1]*m[5] - m[2]*m[4]),
			-det * m[3],  det * m[0], -det * (m[0]*m[5] - m[2]*m[3])
		]));
	}

	translate (x, y) {
		const matrix = this.clone();
		matrix.x += x;
		matrix.y += y;

		return matrix;
	}

	normalize () {
		const matrix = this.clone();
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
		this._matrix = matrix._matrix ? new Float64Array([...matrix._matrix]) : undefined;
		this._x = matrix._x;
		this._y = matrix._y;
		this._sx = matrix._sx;
		this._sy = matrix._sy;
		this._rotation = matrix._rotation;

		return this;
	}
	setMatrixContext (context) {
		const m = this.matrix;
		context.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
	}

	rotateAroundAbsolute (angle, center) {
		this.rotateAroundRelative(angle, center.applyMatrix(this.inverseMatrix()));

		return this;
	}

	rotateAroundRelative (angle, center) {
		if (angle !== 0) {
			const before = center.applyMatrix(this);

			this.rotation = angle;

			const after = center.applyMatrix(this);

			const offset = before.subtract(after);

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
		const before = center.applyMatrix(this);

		this.sx = sx;
		this.sy = sy;

		const after = center.applyMatrix(this);

		const offset = before.subtract(after);

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
		return this;
	}
}
