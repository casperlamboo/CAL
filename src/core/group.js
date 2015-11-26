import Surface from './surface.js';
import Vector from '../math/vector.js';
import Matrix from '../math/matrix.js';
import {KeyLookUp} from './utils.js';

export default class Group extends Surface {
	constructor (options = {}) {
		super(options);

		let {
			useCanvas = true, 
			autoClearCanvas = false, 
			autoDrawCanvas = false
		} = options;

		this.active = true;
		this.visible = true;

		this.objects = [];
		this.useCanvas = useCanvas;

		this.clearCanvas = true;
		this.drawCanvas = true;
		this.autoClearCanvas = autoClearCanvas;
		this.autoDrawCanvas = autoDrawCanvas;

		this.mouse = {
			position: new Vector(), 
			start: new Vector(), 
			delta: new Vector(), 
			length: 0, 
			finger: 0, 
			down: false
		}

		this.touches = [];

		this.lastTime = new Date().getTime();

		this.keysDown = [];
		this.focus = true;

		window.addEventListener('keydown', this);
		window.addEventListener('keyup', this);
		window.addEventListener('blur', this);
		window.addEventListener('focus', this);
	}

	init () {
		this.useCanvas = false;
	}

	handleEvent (event) {
		if (this.useCanvas) {
			switch (event.type) {
				case 'mousedown':
					var offsetX = event.pageX - this.image.offsetLeft;
					var offsetY = event.pageY - this.image.offsetTop;

					var x = this.mouse.startX = Math.round(this.image.width / this.image.clientWidth * offsetX);
					var y = this.mouse.startY = Math.round(this.image.height / this.image.clientHeight * offsetY);

					this.mouse.position.set(x, y);
					this.mouse.start.copy(this.mouse.position);
					this.mouse.delta.identity();
					this.mouse.length = 0;
					this.mouse.down = true;

					this.mouseDown(this.mouse, 0);
					break;

				case 'mouseup':
				case 'mouseout':
					var offsetX = event.pageX - this.image.offsetLeft;
					var offsetY = event.pageY - this.image.offsetTop;

					var x = Math.round(this.image.width / this.image.clientWidth * offsetX);
					var y = Math.round(this.image.height / this.image.clientHeight * offsetY);

					this.mouse.position.set(x, y);
					this.mouse.down = false;

					this.mouseUp(this.mouse, 0);

					this.mouse.start.identity();
					this.mouse.delta.identity();
					this.mouse.length = 0;
					break;

				case 'mousemove':
					var offsetX = event.pageX - this.image.offsetLeft;
					var offsetY = event.pageY - this.image.offsetTop;

					var x = Math.round(this.image.width / this.image.clientWidth * offsetX);
					var y = Math.round(this.image.height / this.image.clientHeight * offsetY);

					var position = new Vector(x, y);

					this.mouse.length += this.mouse.position.distanceTo(position);
					
					this.mouse.position.copy(position);

					if (this.mouse.down) {
						this.mouse.delta.copy(this.mouse.position.subtract(this.mouse.start));
					}

					this.mouseMove(this.mouse);
					break;

				case 'touchstart':
					event.preventDefault();

					let identifiers = this.touches.map(({identifier}) => identifier);

					for (let touch of Array.from(event.touches)) {
						// new finger? 
						if (identifiers.indexOf(touch.identifier) !== -1) {
							continue;
						}

						// get location in canvas coordinate system
						var offsetX = touch.pageX - this.image.offsetLeft;
						var offsetY = touch.pageY - this.image.offsetTop;

						var x = this.mouse.startX = Math.round(this.image.width / this.image.clientWidth * offsetX);
						var y = this.mouse.startY = Math.round(this.image.height / this.image.clientHeight * offsetY);


						// determine finger index					
						let finger = this.touches.length;
						// if there is a "hole" in the finger indexes list it will use the first hole index 
						let fingers = this.touches.map(({finger}) => finger).sort();
						for (let i = 0; i < fingers.length; i ++) {
							if (i !== fingers[i]) {
								finger = i;
								break;
							}
						}

						let touchObject = {
							position: new Vector(x, y), 
							start: new Vector(x, y), 
							delta: new Vector(0, 0), 
							length: 0, 
							finger: finger, 
							identifier: touch.identifier, 
							down: true
						};

						this.touches.push(touchObject);

						this.mouseDown(touchObject, finger);
					}

					this.touchStart(this.touches);

					break;

				case 'touchmove':
					event.preventDefault();

					identifiers = this.touches.map(({identifier}) => identifier);

					for (let touch of Array.from(event.touches)) {
						let identifier = touch.identifier;
						let index = identifiers.indexOf(identifier);

						let touchObject = this.touches[index];

						if (!touchObject) {
							continue;
						}

						let offsetX = touch.pageX - this.image.offsetLeft;
						let offsetY = touch.pageY - this.image.offsetTop;

						let x = Math.round(this.image.width / this.image.clientWidth * offsetX);
						let y = Math.round(this.image.height / this.image.clientHeight * offsetY);

						let position = new Vector(x, y);

						let delta = touchObject.position.distanceTo(position);

						if (delta > 0) {
							touchObject.length += delta;

							touchObject.position.copy(position);
							touchObject.delta.copy(position.subtract(touchObject.start));

							this.mouseMove(touchObject, index);
						}
					}

					this.touchMove(this.touches);

					break;

				case 'touchend':
					event.preventDefault();

					identifiers = Array.from(event.touches).map(({identifier}) => identifier);

					for (let touchObject of Array.from(this.touches)) {
						if (touchObject && identifiers.indexOf(touchObject.identifier) === -1) {
							touchObject.down = false;

							let index = this.touches.indexOf(touchObject);

							this.touches.splice(index, 1);

							this.mouseUp(touchObject, index);
						}
					}

					this.touchEnd(this.touches);

					break;

				case 'keydown':
					if (!this.keysDown[event.keyCode]) {
						this.keysDown[event.keyCode] = true;
						this.keyDown({
							key: KeyLookUp[event.keyCode],
							keyCode: event.keyCode, 
							keysDown: this.keysDown
						});
					}
					break;

				case 'keyup':
					this.keysDown[event.keyCode] = false;

					this.keyUp({
						key: KeyLookUp[event.keyCode],
						keyCode: event.keyCode, 
						keysDown: this.keysDown
					});
					break;

				case 'blur':
					this.focus = false;
					break;

				case 'focus':
					this.lastTime = new Date().getTime();
					this.focus = true;
					break;
			}
		}
	}

	_addEventsListeners () {
		this.image.addEventListener('mousedown', this);
		this.image.addEventListener('mouseup', this);
		this.image.addEventListener('mousemove', this);
		this.image.addEventListener('mouseout', this);
		this.image.addEventListener('touchstart', this);
		this.image.addEventListener('touchmove', this);
		this.image.addEventListener('touchend', this);
		this.image.addEventListener('touchout', this);
	}

	_removeEventListeners () {
		this.image.removeEventListener('mousedown', this);
		this.image.removeEventListener('mouseup', this);
		this.image.removeEventListener('mousemove', this);
		this.image.removeEventListener('mouseout', this);
		this.image.removeEventListener('touchstart', this);
		this.image.removeEventListener('touchmove', this);
		this.image.removeEventListener('touchend', this);
		this.image.removeEventListener('touchout', this);
	}

	setCanvas (canvas) {
		if (this.image instanceof Node) {
			this._removeEventListeners();
			var imageData = this.context.getImageData(0, 0, this.width, this.height);
			this.clear();
		}

		super.setCanvas(canvas);
		this.clear();

		this._addEventsListeners();

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

	keyDown (key) {
		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.active && object.keyDown !== undefined) {
				if (object.keyDown(key, this)) {
					break;
				}
			}
		}
	}

	keyUp (key) {
		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.active && object.keyUp !== undefined) {
				if (object.keyUp(key, this)) {
					break;
				}
			}
		}
	}

	mouseDown (mouse, finger) {
		let matrix = this.inverseMatrix();
		let position = mouse.position.applyMatrix(matrix);
		let start = mouse.start.applyMatrix(matrix);

		mouse = {
			...mouse, 
			position,
			start, 
			delta: position.subtract(start), 
			length: mouse.length * this.sx * this.sy
		};

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.mouseDown !== undefined) {
				if (object.mouseDown(mouse, finger)) {
					break;
				}
			}
		}
	}

	mouseUp (mouse, finger) {
		let matrix = this.inverseMatrix();
		let position = mouse.position.applyMatrix(matrix);
		let start = mouse.start.applyMatrix(matrix);

		mouse = {
			...mouse, 
			position,
			start, 
			delta: position.subtract(start), 
			length: mouse.length * this.sx * this.sy
		};

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.mouseUp !== undefined) {
				if (object.mouseUp(mouse, finger)) {
					break;
				}
			}
		}
	}

	mouseMove (mouse, finger) {
		let matrix = this.inverseMatrix();
		let position = mouse.position.applyMatrix(matrix);
		let start = mouse.start.applyMatrix(matrix);

		mouse = {
			...mouse, 
			position,
			start, 
			delta: position.subtract(start), 
			length: mouse.length * this.sx * this.sy
		}

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.mouseMove !== undefined) {
				if (object.mouseMove(mouse, finger)) {
					break;
				}
			}
		}
	}

	touchStart (touches) {
		let matrix = this.inverseMatrix();

		touches = touches.map((touch) => {
			let position = touch.position.applyMatrix(matrix);
			let start = touch.start.applyMatrix(matrix);

			return {
				...touch, 
				position,
				start, 
				delta: position.subtract(start), 
				length: touch.length * this.sx * this.sy
			};
		});

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.touchStart !== undefined) {
				if (object.touchStart(touches)) {
					break;
				}
			}
		}
	}

	touchMove (touches) {
		let matrix = this.inverseMatrix();

		touches = touches.map((touch) => {
			let position = touch.position.applyMatrix(matrix);
			let start = touch.start.applyMatrix(matrix);

			return {
				...touch, 
				position,
				start, 
				delta: position.subtract(start), 
				length: touch.length * this.sx * this.sy
			};
		});

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.touchMove !== undefined) {
				if (object.touchMove(touches)) {
					break;
				}
			}
		}
	}

	touchEnd (touches) {
		let matrix = this.inverseMatrix();

		touches = touches.map((touch) => {
			let position = touch.position.applyMatrix(matrix);
			let start = touch.start.applyMatrix(matrix);

			return {
				...touch, 
				position,
				start, 
				delta: position.subtract(start), 
				length: touch.length * this.sx * this.sy
			};
		});

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.touchEnd !== undefined) {
				if (object.touchEnd(touches)) {
					break;
				}
			}
		}
	}

	step (deltaTime) {
		let objects = Array.from(this.objects);

		for (let i = 0; i < objects.length; i ++) {
			let object = objects[i];
			if (object.active && object.step !== undefined) {
				if (object instanceof Group && !object.useCanvas) {
					if (object.clearCanvas || object.autoClearCanvas) {
						this.clearCanvas = true;
					}
					if (object.drawCanvas || object.autoDrawCanvas) {
						this.drawCanvas = true;
					}
				}

				object.step(deltaTime, this);
			}
		}

		if (this.useCanvas) {
			if (this.clearCanvas || this.autoClearCanvas) {
				this.clearCanvas = false;
				this.clear();
			}
			if (this.drawCanvas || this.autoDrawCanvas) {
				this.drawCanvas = false;
				this.draw();
			}
		}
	}

	cycle () {
		if (this.focus) {
			let currentTime = new Date().getTime();
			let deltaTime = currentTime - this.lastTime;
			this.lastTime = currentTime;

			this.step(deltaTime);
		}
	}

	draw (context, matrix) {
		if (this.useCanvas) {
			context = this.context;
			matrix = this;
		}

		let objects = Array.from(this.objects);

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
