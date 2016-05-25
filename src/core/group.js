import Surface from './surface.js';
import Matrix from '../math/matrix.js';
import { cloneArray } from './utils.js';

export default class Group extends Surface {
	constructor (options = {}) {
		super(options);

		const {
			useCanvas = true,
			autoClearCanvas = false,
			autoDrawCanvas = false,
			drawWhenBlurred = false
		} = options;

		this.active = true;
		this.visible = true;

		this.objects = [];
		this.useCanvas = useCanvas;

		this.clearCanvas = true;
		this.drawCanvas = true;
		this.autoClearCanvas = autoClearCanvas;
		this.autoDrawCanvas = autoDrawCanvas;
		this.drawWhenBlurred = drawWhenBlurred;

		this._lastTime = new Date().getTime();

		this.keysDown = [];
		this.focus = true;

		window.addEventListener('blur', this);
		window.addEventListener('focus', this);
	}

	init() {
		this.useCanvas = false;
	}

	handleEvent (event) {
		if (this.useCanvas) {
			switch (event.type) {
				case 'blur':
					this.focus = false;
					break;

				case 'focus':
					this._lastTime = new Date().getTime();
					this.focus = true;
					break;

				case 'contextmenu':
					event.preventDefault();

					break;
			}
		}
	}

	setCanvas (canvas) {
		this.useCanvas = true;

		let imageData;
		if (this.image instanceof Node) {
			imageData = this.context.getImageData(0, 0, this.width, this.height);
			this.clear();
		}

		super.setCanvas(canvas);
		this.clear();

		if (imageData !== undefined) {
			this.context.putImageData(imageData, 0, 0);
		}

		return this;
	}

	add (...objects) {
		for (let i = 0; i < objects.length; i ++) {
			let object = objects[i];
			if (this.objects.indexOf(object) === -1) {
				object.parent = this;
				this.objects.push(object);
				if (object.useCanvas) {
					object.useCanvas = false;
				}
				if (object.init) {
					object.init(this);
				}
			}
		}
		this.sort();

		return this;
	}

	remove (...objects) {
		for (let i = 0; i < objects.length; i ++) {
			let object = objects[i];

			let index = this.objects.indexOf(object);
			if (index === -1) {
				continue;
			}

			this.objects.splice(index, 1);

			object.parent = false;
			if (object.active && object.remove !== undefined) {
				object.remove(this);
			}
		}

		return this;
	}

	sort () {
		this.objects.sort(({depth: a = 0}, {depth: b = 0}) => {
			return a - b;
		});
	}

	getScreenMatrix() {
		if (this.parent) {
			return this.multiplyMatrix(this.parent.getScreenMatrix());
		} else {
			return this;
		}
	}

	step (deltaTime) {
		const objects = cloneArray(this.objects);

		for (let i = 0; i < objects.length; i ++) {
			let object = objects[i];
			if (object.active && object.step !== undefined) {
				if (object instanceof Group && !object.useCanvas) {
					if (object.clearCanvas || object.autoClearCanvas) {
						this.clearCanvas = true;
						object.clearCanvas = false;
					}
					if (object.drawCanvas || object.autoDrawCanvas) {
						this.drawCanvas = true;
						object.drawCanvas = false;
					}
				}

				object.step(deltaTime, this);
			}
		}

		if (this.useCanvas) {
			if (this.clearCanvas || this.autoClearCanvas) {
				this.clear();
			}
			if (this.drawCanvas || this.autoDrawCanvas) {
				this.draw();
			}
		}
	}

	cycle () {
		if (this.drawWhenBlurred || this.focus) {
			let currentTime = new Date().getTime();
			let deltaTime = currentTime - this._lastTime;
			this._lastTime = currentTime;

			this.step(deltaTime);
		}
	}

	clear () {
		this.clearCanvas = false;

		super.clear();
	}

	draw (context, matrix) {
		this.drawCanvas = false;

		if (this.useCanvas) {
			context = this.context;
			matrix = this;
		}

		const objects = cloneArray(this.objects);

		for (let i = 0; i < objects.length; i ++) {
			let object = objects[i];

			if (/*object.useCanvas !== true && */object.visible && object.draw !== undefined) {
				if (object.useCanvas !== true && object instanceof Matrix) {
					object.draw(context, object.multiplyMatrix(matrix));
				}
				else {
					object.draw(context, matrix);
				}
			}
		}
	}
};
