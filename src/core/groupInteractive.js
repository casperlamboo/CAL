import Group from './group.js';
import Vector from '../math/vector.js';
import { KeyLookUp, cloneArray } from './utils.js';

export default class GroupInteractive extends Group {
	constructor (options = {}) {
		super(options);

		const {
			richEvents = false
		} = options;

		this.richEvents = richEvents;

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

		this.keysDown = [];

		window.addEventListener('keydown', this);
		window.addEventListener('keyup', this);
	}

	handleEvent (event) {
		if (this.useCanvas) {
			switch (event.type) {
				case 'mousedown':
				case 'mouseup':
				case 'mouseout':
				case 'mousemove':
					{
						const button = event.button;

						const offsetX = event.pageX - this.image.offsetLeft;
						const offsetY = event.pageY - this.image.offsetTop;

						const x = this.image.width / this.image.clientWidth * offsetX;
						const y = this.image.height / this.image.clientHeight * offsetY;

						const position = new Vector(x, y);

						switch (event.type) {
							case 'mousedown':
								this.mouseDown({
									position,
									button
								});
								break;

							case 'mouseout':
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
					}
					break;

				case 'touchstart':
					{
						event.preventDefault();

						const identifiers = this.touches.map(({identifier}) => identifier);

						for (let i = 0; i < event.touches.length; i ++) {
							const touch = event.touches[i];
							// new finger?
							var {identifier} = touch;

							if (identifiers.indexOf(identifier) !== -1) {
								continue;
							}

							// get location in canvas coordinate system
							const offsetX = touch.pageX - this.image.offsetLeft;
							const offsetY = touch.pageY - this.image.offsetTop;

							const x = this.image.width / this.image.clientWidth * offsetX;
							const y = this.image.height / this.image.clientHeight * offsetY;

							// determine finger index
							let finger = this.touches.length;
							// if there is a "hole" in the finger indexes list it will use the first hole index
							const fingers = this.touches.map(({finger}) => finger).sort();
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
					}
					break;

				case 'touchmove':
					{
						event.preventDefault();

						for (let i = 0; i < event.touches.length; i ++) {
							const touch = event.touches[i];

							const { identifier } = touch;
							const identifiers = this.touches.map(({identifier}) => identifier);
							const index = identifiers.indexOf(identifier);

							const offsetX = touch.pageX - this.image.offsetLeft;
							const offsetY = touch.pageY - this.image.offsetTop;

							const x = this.image.width / this.image.clientWidth * offsetX;
							const y = this.image.height / this.image.clientHeight * offsetY;

							const position = new Vector(x, y);

							this.mouseMove({
								position,
								index
							});
						}

						this.touchMove();
					}
					break;

				case 'touchend':
					{
						event.preventDefault();

						const identifiers = Array.from(event.touches).map(({identifier}) => identifier);
						const touches = cloneArray(this.touches);

						for (let index = 0; index < touches.length; index ++) {
							const identifier = touches[index].identifier;

							if (identifiers.indexOf(identifier) === -1) {
								this.mouseUp({
									identifier
								});
							}
						}

						this.touchEnd();
					}
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
					{
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
					}
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
		}

		super.setCanvas(canvas);

		this._addEventsListeners();

		return this;
	}

	mouseWheel (wheel) {
		const matrix = this.inverseMatrix();
		const position = wheel.position.applyMatrix(matrix);

		wheel = {
			...wheel,
			position
		};

		const objects = cloneArray(this.objects);

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
		const objects = cloneArray(this.objects);

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
		const objects = cloneArray(this.objects);

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

		const objects = cloneArray(this.objects);

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

		const identifiers = this.touches.map(({identifier}) => identifier);
		const index = identifiers.indexOf(identifier);

		let mouseObject, position;

		if (button !== undefined) {
			mouseObject = this.mouse.buttons[button];
			position = this.mouse.position;
		}
		else if (identifier !== undefined) {
			mouseObject = this.touches[index];
			position = this.touches[index].position;
		}

		if (!mouseObject.down) {
			return;
		}

		mouseObject.down = false;

		mouse = {
			position,
			button,
			index,
			...mouseObject
		};

		const objects = cloneArray(this.objects);

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
		const {button, index} = mouse;

		let mouseObject;
		if (button !== undefined) {
			if (this.richEvents) {
				const lengthDelta = this.mouse.position.distanceTo(position);

				for (let i = 0; i < this.mouse.down.length; i ++) {
					const buttonIndex = this.mouse.down[i];
					const button = this.mouse.buttons[buttonIndex];

					button.length += lengthDelta;
					button.delta.copy(position.subtract(button.start));
				}
			}

			this.mouse.position.copy(position);
			mouseObject = this.mouse.buttons[button];
		} else if (index !== undefined) {
			if (this.richEvents) {
				const lengthDelta = mouseObject.position.distanceTo(position);

				mouseObject.length += lengthDelta;
				mouseObject.delta.copy(position.subtract(mouseObject.start));
			}
			mouseObject = this.touches[index];
			mouseObject.position.copy(position);
		}

		mouse = { position, button, index, ...mouseObject };

		const objects = cloneArray(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			const object = objects[i];
			if (object.useCanvas !== true && object.active && object.mouseMove !== undefined) {
				if (object.mouseMove(mouse, this)) {
					break;
				}
			}
		}
	}

	touchStart (touches) {
		const objects = cloneArray(this.objects);

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
		const objects = cloneArray(this.objects);

		for (let i = objects.length - 1; i >= 0; i --) {
			let object = objects[i];
			if (object.useCanvas !== true && object.active && object.touchMove !== undefined) {
				if (object.touchMove(this.touches, this)) {
					break;
				}
			}
		}
	}
};
