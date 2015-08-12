import Surface from './surface.js';
import Vector from '../math/vector.js';
import Matrix from '../math/matrix.js';

export default class Group extends Surface {

	constructor (options = {}) {
		let {useCanvas = true, autoClearCanvas = false, autoDrawCanvas = false} = options;
		super(options);

		this.active = true;
		this.visible = true;

		this.objects = [];
		this.useCanvas = useCanvas;

		this.clearCanvas = true;
		this.drawCanvas = true;
		this.autoClearCanvas = autoClearCanvas;
		this.autoDrawCanvas = autoDrawCanvas;

		this.loop = false;
		this.itemsToAdd = [];
		this.itemsToRemove = [];

		this.mouse = {
			position: new Vector(), 
			start: new Vector(), 
			delta: new Vector(), 
			length: 0, 
			down: false
		}

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
				case "mousedown":
					var offsetX = event.pageX - this.image.offsetLeft;
					var offsetY = event.pageY - this.image.offsetTop;

					var x = this.mouse.startX = Math.round(this.image.width / this.image.clientWidth * offsetX);
					var y = this.mouse.startY = Math.round(this.image.height / this.image.clientHeight * offsetY);

					this.mouse.position.copy(new Vector(x, y));
					this.mouse.start.copy(this.mouse.position);
					this.mouse.delta.identity();
					this.mouse.length = 0;
					this.mouse.down = true;

					this.mouseDown(this.mouse);
				break;

				case "mouseup":
					var offsetX = event.pageX - this.image.offsetLeft;
					var offsetY = event.pageY - this.image.offsetTop;

					var x = Math.round(this.image.width / this.image.clientWidth * offsetX);
					var y = Math.round(this.image.height / this.image.clientHeight * offsetY);

					this.mouse.position.copy(new Vector(x, y));
					this.mouse.down = false;

					this.mouseUp(this.mouse);

					this.mouse.start.identity();
					this.mouse.delta.identity();
					this.mouse.length = 0;
				break;

				case "mousemove":
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

				case "touchstart":
					event.preventDefault();

					if (event.touches.length === 1) {
						var touch = event.touches[0];

						var offsetX = touch.pageX - this.image.offsetLeft;
						var offsetY = touch.pageY - this.image.offsetTop;

						var x = this.mouse.startX = Math.round(this.image.width / this.image.clientWidth * offsetX);
						var y = this.mouse.startY = Math.round(this.image.height / this.image.clientHeight * offsetY);

						this.mouse.position.copy(new Vector(x, y));
						this.mouse.start.copy(this.mouse.position);
						this.mouse.delta.identity();
						this.mouse.length = 0;
						this.mouse.down = true;

						this.mouseDown(this.mouse);
					}
				break;

				case "touchmove":
					event.preventDefault();

					var touch = event.touches[0];

					var offsetX = touch.pageX - this.image.offsetLeft;
					var offsetY = touch.pageY - this.image.offsetTop;

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

				case "touchend":
					event.preventDefault();

					if (this.useCanvas && event.touches.length === 0) {
						this.mouse.down = false;

						this.mouseUp(this.mouse);

						this.mouse.start.identity();
						this.mouse.delta.identity();
						this.mouse.length = 0;
					}
				break;

				case "keydown":
					if (!this.keysDown[event.keyCode]) {
						this.keysDown[event.keyCode] = true;
						this.keyDown(event.keyCode);
					}
				break;

				case "keyup":
					this.keysDown[event.keyCode] = false;

					this.keyUp(event.keyCode);
				break;

				case "blur":
					this.focus = false;
				break;

				case "focus":
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
		this.image.addEventListener('touchstart', this);
		this.image.addEventListener('touchmove', this);
		this.image.addEventListener('touchend', this);
	}

	_removeEventListeners () {
		this.image.removeEventListener('mousedown', this);
		this.image.removeEventListener('mouseup', this);
		this.image.removeEventListener('mousemove', this);
		this.image.removeEventListener('touchstart', this);
		this.image.removeEventListener('touchmove', this);
		this.image.removeEventListener('touchend', this);
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
		if (this.loop) {
			for (var i = 0; i < objects.length; i ++) {
				var object = objects[i];
				this.itemsToAdd.push(object);
			}
		}
		else {
			for (var i = 0; i < objects.length; i ++) {
				var object = objects[i];
				if (this.objects.indexOf(object) === -1) {
					object.parent = this;
					this.objects.push(object);
					if (object.init) {
						object.init(this);
					}
				}
			}
			this.sort();
		}

		return this;
	}

	remove (...objects) {
		if (this.loop) {
			for (var i = 0; i < objects.length; i ++) {
				var object = objects[i];
				this.itemsToRemove.push(object);
			}
		}
		else {
			for (var i = 0; i < objects.length; i ++) {
				var object = objects[i];

				var index = this.objects.indexOf(object);
				if (index === -1) {
					continue;
				}

				this.objects.splice(index, 1);

				if (object.active && object.remove !== undefined) {
					object.parent = false;
					object.remove(this);
				}
			}
		}
	}

	handleAdded () {
		for (var i = 0; i < this.itemsToAdd.length; i ++) {
			var object = this.itemsToAdd[i];
			this.add(object);
		}

		for (var i = 0; i < this.itemsToRemove.length; i ++) {
			var object = this.itemsToRemove[i];
			this.remove(object);
		}
	}

	sort () {
		this.objects.sort(function (a, b) {
			return (a.depth || 0) - (b.depth || 0);
		});
	}

	keyDown (keyCode) {
		this.loop = true;
		for (var i = this.objects.length-1; i >= 0; i --) {
			var object = this.objects[i];
			if (object.active && object.keyDown !== undefined) {
				if (object.keyDown(keyCode, this)) {
					break;
				}
			}
		}
		this.loop = false;
		this.handleAdded();
	}

	keyUp (keyCode) {
		this.loop = true;
		for (var i = this.objects.length-1; i >= 0; i --) {
			var object = this.objects[i];
			if (object.active && object.keyUp !== undefined) {
				if (object.keyUp(keyCode, this)) {
					break;
				}
			}
		}
		this.loop = false;
		this.handleAdded();
	}

	mouseDown (mouse) {
		var position = mouse.position.applyMatrix(this.inverseMatrix());
		var start = mouse.start.applyMatrix(this.inverseMatrix());

		var mouse = {
			position: position, 
			start: start, 
			delta: position.subtract(start), 
			length: mouse.length * this.sx * this.sy, 
			down: mouse.down
		}

		this.loop = true;
		for (var i = this.objects.length - 1; i >= 0; i --) {
			var object = this.objects[i];
			if (object.useCanvas !== true && object.active && object.mouseDown !== undefined) {
				if (object.mouseDown(mouse, this)) {
					break;
				}
			}
		}
		this.loop = false;
		this.handleAdded();
	}

	mouseUp (mouse) {
		var position = mouse.position.applyMatrix(this.inverseMatrix());
		var start = mouse.start.applyMatrix(this.inverseMatrix());

		var mouse = {
			position: position, 
			start: start, 
			delta: position.subtract(start), 
			length: mouse.length * this.sx * this.sy, 
			down: mouse.down
		}

		this.loop = true;
		for (var i = this.objects.length-1; i >= 0; i --) {
			var object = this.objects[i];
			if (object.useCanvas !== true && object.active && object.mouseUp !== undefined) {
				if (object.mouseUp(mouse, this)) {
					break;
				}
			}
		}
		this.loop = false;
		this.handleAdded();
	}

	mouseMove (mouse) {
		var position = mouse.position.applyMatrix(this.inverseMatrix());
		var start = mouse.start.applyMatrix(this.inverseMatrix());

		var mouse = {
			position: position, 
			start: start, 
			delta: position.subtract(start), 
			length: mouse.length * this.sx * this.sy, 
			down: mouse.down
		}

		this.loop = true;
		for (var i = this.objects.length-1; i >= 0; i --) {
			var object = this.objects[i];
			if (object.useCanvas !== true && object.active && object.mouseMove !== undefined) {
				if (object.mouseMove(mouse, this)) {
					break;
				}
			}
		}
		this.loop = false;
		this.handleAdded();
	}

	step (deltaTime) {
		this.loop = true;
		for (var i = 0; i < this.objects.length; i ++) {
			var object = this.objects[i];
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
		this.loop = false;
		this.handleAdded();

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
			var currentTime = new Date().getTime();
			var deltaTime = currentTime - this.lastTime;
			this.lastTime = currentTime;

			this.step(deltaTime);
		}
	}

	draw (context, matrix) {
		if (this.useCanvas) {
			context = this.context;
			matrix = this;
		}

		this.loop = true;
		for (var i = 0; i < this.objects.length; i ++) {
			var object = this.objects[i];
			if (/*object.useCanvas !== true && */object.visible && object.draw !== undefined) {
				if (object.useCanvas !== true && object instanceof Matrix) {
					object.draw(context, object.multiplyMatrix(matrix));
				}
				else {
					object.draw(context, matrix);
				}
			}
		}
		this.loop = false;
		this.handleAdded();
	}

};