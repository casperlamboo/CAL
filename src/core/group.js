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
			down: [],
			buttons: [{
				start: new Vector(),
				delta: new Vector(),
				length: 0,
				down: false
			}, {
				start: new Vector(),
				delta: new Vector(),
				length: 0,
				down: false
			}, {
				start: new Vector(),
				delta: new Vector(),
				length: 0,
				down: false
			}]
		};

		this.touches = [];

		this._lastTime = new Date().getTime();

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
				case 'mouseup':
				// case 'mouseout':
				case 'mousemove':
					var button = event.button;

					var offsetX = event.pageX - this.image.offsetLeft;
					var offsetY = event.pageY - this.image.offsetTop;

					var x = this.image.width / this.image.clientWidth * offsetX;
					var y = this.image.height / this.image.clientHeight * offsetY;

					var position = new Vector(x, y);

					switch (event.type) {
						case 'mousedown':
							this.mouseDown({
								position,
								button
							});
							break;

						// case 'mouseout':
						case 'mouseup':
							this.mouseUp({
								position,
								button
							});
							break;

						case 'mousemove':
							this.mouseMove({
								position,
								button
							});
							break;
					}
					break;

				case 'touchstart':
					event.preventDefault();

					let identifiers = this.touches.map(({identifier}) => identifier);

					for (let touch of Array.from(event.touches)) {
						// new finger?
						var {identifier} = touch;

						if (identifiers.indexOf(identifier) !== -1) {
							continue;
						}

						// get location in canvas coordinate system
						var offsetX = touch.pageX - this.image.offsetLeft;
						var offsetY = touch.pageY - this.image.offsetTop;

						var x = this.image.width / this.image.clientWidth * offsetX;
						var y = this.image.height / this.image.clientHeight * offsetY;

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

						this.mouseDown({
							position: new Vector(x, y),
							finger,
							identifier
						});
					}

					this.touchStart();
					break;

				case 'touchmove':
					event.preventDefault();

					for (let touch of Array.from(event.touches)) {
						let {identifier} = touch;

						let offsetX = touch.pageX - this.image.offsetLeft;
						let offsetY = touch.pageY - this.image.offsetTop;

						let x = this.image.width / this.image.clientWidth * offsetX;
						let y = this.image.height / this.image.clientHeight * offsetY;

						let position = new Vector(x, y);

						this.mouseMove({
							position,
							identifier
						});
					}

					this.touchMove();
					break;

				case 'touchend':
					event.preventDefault();

					identifiers = Array.from(event.touches).map(({identifier}) => identifier);

					for (let {identifier} of Array.from(this.touches)) {
						if (identifiers.indexOf(identifier) === -1) {
							this.mouseUp({
								identifier
							});
						}
					}

					this.touchEnd();
					break;

				case 'keydown':
					if (this.useCanvas && !this.keysDown[event.keyCode]) {
						this.keysDown[event.keyCode] = true;
						this.keyDown({
							key: KeyLookUp[event.keyCode],
							keyCode: event.keyCode,
							keysDown: this.keysDown
						});
					}
					break;

				case 'keyup':
					if (this.useCanvas) {
						this.keysDown[event.keyCode] = false;

						this.keyUp({
							key: KeyLookUp[event.keyCode],
							keyCode: event.keyCode,
							keysDown: this.keysDown
						});
					}
					break;

				case 'mousewheel':
					event.preventDefault();

					if (this.useCanvas) {
						const offsetX = event.pageX - this.image.offsetLeft;
						const offsetY = event.pageY - this.image.offsetTop;

						const x = this.image.width / this.image.clientWidth * offsetX;
						const y = this.image.height / this.image.clientHeight * offsetY;

						const position = new Vector(x, y);

						this.mouseWheel({
							delta: event.wheelDelta,
							position
						});
					}
					break;

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

	_addEventsListeners () {
		this.image.addEventListener('mousedown', this);
		this.image.addEventListener('mouseup', this);
		this.image.addEventListener('mousemove', this);
		this.image.addEventListener('mouseout', this);
		this.image.addEventListener('touchstart', this);
		this.image.addEventListener('touchmove', this);
		this.image.addEventListener('touchend', this);
		this.image.addEventListener('touchout', this);
		this.image.addEventListener('mousewheel', this);
		this.image.addEventListener('contextmenu', this);
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
		this.image.removeEventListener('mousewheel', this);
		this.image.removeEventListener('contextmenu', this);
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

	mouseWheel (wheel) {
		const matrix = this.inverseMatrix();
		const position = wheel.position.applyMatrix(matrix);

		wheel = {
			...wheel,
			position
		};

		const objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			const object = objects[i];
			if (object.active && object.mouseWheel !== undefined) {
				if (object.mouseWheel(wheel, this)) {
					break;
				}
			}
		}
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

	mouseDown (mouse) {
		const matrix = this.inverseMatrix();
		const position = mouse.position.applyMatrix(matrix);
		const {button, finger, identifier} = mouse;

		let mouseObject;

		if (button !== undefined) {
			this.mouse.position.copy(position);
			this.mouse.down.push(mouse.button);

			mouseObject = this.mouse.buttons[button];
		}
		else if (finger !== undefined) {
			mouseObject = {
				position,
				start: new Vector(),
				delta: new Vector(),
				finger,
				identifier
			};

			this.touches.push(mouseObject);
		}

		mouseObject.start.copy(position);
		mouseObject.delta.identity();
		mouseObject.length = 0;
		mouseObject.down = true;

		mouse = {
			position,
			button,
			...mouseObject
		};

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.mouseDown !== undefined) {
				if (object.mouseDown(mouse, this)) {
					break;
				}
			}
		}
	}

	mouseUp (mouse) {
		const matrix = this.inverseMatrix();
		const {button, identifier} = mouse;

		let mouseObject, index, position;

		if (button !== undefined) {
			mouseObject = this.mouse.buttons[button];
			position = this.mouse.position;
		}
		else if (identifier !== undefined) {
			const identifiers = this.touches.map(({identifier}) => identifier);
			index = identifiers.indexOf(identifier);

			mouseObject = this.touches[index];
			position = this.touches[index].position;
		}

		mouseObject.down = false;

		mouse = {
			position,
			button,
			...mouseObject
		};

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.mouseUp !== undefined) {
				if (object.mouseUp(mouse, this)) {
					break;
				}
			}
		}

		if (button !== undefined) {
			var buttonIndex = this.mouse.down.indexOf(button);
			this.mouse.down.splice(buttonIndex, 1);

			this.mouse.buttons[button].start.identity();
			this.mouse.buttons[button].delta.identity();
			this.mouse.buttons[button].length = 0;
		}
		else if (identifier !== undefined) {
			this.touches.splice(index, 1);
		}
	}

	mouseMove (mouse) {
		const matrix = this.inverseMatrix();
		const position = mouse.position.applyMatrix(matrix);
		const {button, identifier} = mouse;

		let mouseObject;

		if (button !== undefined) {
			const lengthDelta = this.mouse.position.distanceTo(position);
			this.mouse.position.copy(position);

			for (let buttonIndex of this.mouse.down) {
				const button = this.mouse.buttons[buttonIndex];

				button.length += lengthDelta;
				button.delta.copy(position.subtract(button.start));
			}

			mouseObject = this.mouse.buttons[button];
		}
		else if (identifier !== undefined) {
			const identifiers = this.touches.map(({identifier}) => identifier);
			const index = identifiers.indexOf(identifier);

			mouseObject = this.touches[index];

			const lengthDelta = mouseObject.position.distanceTo(position);

			mouseObject.length += lengthDelta;
			mouseObject.position.copy(position);
			mouseObject.delta.copy(position.subtract(mouseObject.start));
		}

		mouse = {
			position,
			button,
			...mouseObject
		};

		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.mouseMove !== undefined) {
				if (object.mouseMove(mouse, this)) {
					break;
				}
			}
		}
	}

	touchStart (touches) {
		let objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.touchStart !== undefined) {
				if (object.touchStart(this.touches, this)) {
					break;
				}
			}
		}
	}

	touchMove (touches) {
		const objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.touchMove !== undefined) {
				if (object.touchMove(this.touches, this)) {
					break;
				}
			}
		}
	}

	touchEnd (touches) {
		const objects = Array.from(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.touchEnd !== undefined) {
				if (object.touchEnd(this.touches, this)) {
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
				this.clearCanvas = false;
				this.clear();
			}
			if (this.drawCanvas || this.autoDrawCanvas) {
				this.draw();
			}
		}
	}

	cycle () {
		if (this.focus) {
			let currentTime = new Date().getTime();
			let deltaTime = currentTime - this._lastTime;
			this._lastTime = currentTime;

			this.step(deltaTime);
		}
	}

	draw (context, matrix) {
		this.drawCanvas = false;

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
