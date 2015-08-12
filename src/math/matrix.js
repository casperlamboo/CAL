export default class Matrix {

	constructor (options) {
		if (options === undefined) {
			this.identity();
		}
		else if (options instanceof Array) {
			this.matrix = options;
		}
		else {
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
		this._sx = sx;

		delete this._matrix;

		if (this.onchangetransfrom !== undefined) {
			this.onchangetransfrom();
		}
	}

	get sy () {
		if (this._sy === undefined) {
			this._sy = Math.sqrt(Math.pow(this._matrix[1], 2) + Math.pow(this._matrix[4], 2));
		}

		return this._sy;
	}

	set sy (sy) {
		this._sy = sy;

		delete this._matrix;

		if (this.onchangetransfrom !== undefined) {
			this.onchangetransfrom();
		}
	}

	get rotation () {
		if (this._rotation === undefined) {
			this._rotation = Math.atan2(-this._matrix[3], this._matrix[0]);
		}

		return this._rotation;
	}

	set rotation (rotation) {
		this._rotation = rotation;

		delete this._matrix;

		if (this.onchangetransfrom !== undefined) {
			this.onchangetransfrom();
		}
	}

	get x () {
		if (this._x === undefined) {
			this._x = this._matrix[2];
		}

		return this._x;
	}

	set x (x) {
		this._x = x;

		if (this._matrix !== undefined) {
			this._matrix[2] = x;
		}

		if (this.onchangetransfrom !== undefined) {
			this.onchangetransfrom();
		}
	}

	get y () {
		if (this._y === undefined) {
			this._y = this._matrix[5];
		}

		return this._y;
	}

	set y (y) {
		this._y = y;

		if (this._matrix !== undefined) {
			this._matrix[5] = y;
		}

 	}

	get matrix () {
		if (this._matrix === undefined) {
			var sin = Math.sin(this._rotation);
			var cos = Math.cos(this._rotation)

			this._matrix = [
				this._sx * cos, this._sx * -sin, this._x,
				this._sy * sin, this._sy * cos, this._y, 
				0, 0, 1
			];
		}

		return this._matrix;
	}

	set matrix (m) {
		if (m instanceof Array) {
			this._matrix = m;

			delete this._x;
			delete this._y;
			delete this._sx;
			delete this._sy;
			delete this._rotation;
		}
		else {
			this.set(m);
		}

		if (this.onchangetransfrom !== undefined) {
			this.onchangetransfrom();
		}
	}

	identity () {
		this._matrix = [
			1, 0, 0,
			0, 1, 0, 
			0, 0, 1
		];

		this._x = 0;
		this._y = 0;
		this._sx = 1;
		this._sy = 1;
		this._rotation = 0;

		if (this.onchangetransfrom !== undefined) {
			this.onchangetransfrom();
		}

		return this;
	}

	multiplyMatrix (m) {
		var a = this.matrix;
		var b = m.matrix;

		return new Matrix([
			a[0]*b[0] + a[3]*b[1] + a[6]*b[2], a[1]*b[0] + a[4]*b[1] + a[7]*b[2], a[2]*b[0] + a[5]*b[1] + a[8]*b[2],
			a[0]*b[3] + a[3]*b[4] + a[6]*b[5], a[1]*b[3] + a[4]*b[4] + a[7]*b[5], a[2]*b[3] + a[5]*b[4] + a[8]*b[5],
			a[0]*b[6] + a[3]*b[7] + a[6]*b[8], a[1]*b[6] + a[4]*b[7] + a[7]*b[8], a[2]*b[6] + a[5]*b[7] + a[8]*b[8]
		]);
	}

	inverseMatrix () {
		var m = this.matrix;

		var det = 1 / (m[0]*m[4]*m[8] + m[1]*m[5]*m[6] + m[2]*m[3]*m[7] - m[1]*m[3]*m[8] - m[0]*m[5]*m[7] - m[2]*m[4]*m[6]);

		return new Matrix([
			 det * (m[4]*m[8] - m[5]*m[7]), -det * (m[1]*m[8] - m[2]*m[7]),  det * (m[1]*m[5] - m[2]*m[4]),
			-det * (m[3]*m[8] - m[5]*m[6]),  det * (m[0]*m[8] - m[2]*m[6]), -det * (m[0]*m[5] - m[2]*m[3]),
			 det * (m[3]*m[7] - m[4]*m[6]), -det * (m[0]*m[7] - m[1]*m[6]),  det * (m[0]*m[4] - m[1]*m[3])
		]);
	}

	translate (x, y) {
		this.x += x;
		this.y += y;

		return this;
	}

	setMatrix (matrix) {
		this._matrix = matrix.matrix;
		this._x = matrix.x;
		this._y = matrix.y;
		this._sx = matrix.sx;
		this._sy = matrix.sy;
		this._rotation = matrix.rotation;

		if (this.onchangetransfrom !== undefined) {
			this.onchangetransfrom();
		}

		return this;
	}

	setMatrixContext (context) {
		var m = this.matrix;
		context.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
	}

	rotateAroundAbsolute (angle, center) {
		this.rotateAroundRelative(angle, center.applyMatrix(this.inverseMatrix()));

		return this;
	}

	rotateAroundRelative (angle, center) {
		if (angle !== 0) {
			var before = center.applyMatrix(this);

			this.rotation = angle;

			var after = center.applyMatrix(this);

			var offset = before.subtract(after);

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
		var before = center.applyMatrix(this);

		this.sx = sx;
		this.sy = sy;

		var after = center.applyMatrix(this);

		var offset = before.subtract(after);
		
		this.x += offset.x;
		this.y += offset.y;

		return this;
	}
}