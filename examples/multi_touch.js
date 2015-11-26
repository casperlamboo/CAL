import * as CAL from 'src/index.js';

const group = new CAL.Group({
	canvas: document.getElementById('CAL'), 
	autoClearCanvas: true, 
	autoDrawCanvas: true
});

const image = new CAL.Image('img/hourglass.png', 0, 0, 1, 1).load();
const initTransform = new CAL.Matrix();
const stepTransform = new CAL.Matrix();

class MouseViewer {
	constructor () {
		this.active = true;
		this.visible = true;
		this.depth = 0;

		this._initGestureValues = {
			length: 0, 
			rotation: 0, 
			center: new CAL.Vector()
		};

		this.colors = ['green', 'red', 'blue', 'yellow', 'purple', 'black', 'grey', 'pink'];
	}

	touchStart (touches) {
		if (touches.length !== 2) {
			return;
		}

		let fingerA = touches[0].position;
		let fingerB = touches[1].position;

		this._initGestureValues.length = fingerA.distanceTo(fingerB);
		this._initGestureValues.rotation = fingerB.subtract(fingerA).angle();
		this._initGestureValues.center.copy(fingerB.add(fingerA).scale(0.5));
	}

	touchMove (touches) {
		if (touches.length !== 2) {
			return;
		}

		let fingerA = touches[0].position;
		let fingerB = touches[1].position;

		let length = fingerA.distanceTo(fingerB);
		let rotation = fingerB.subtract(fingerA).angle();
		let center = fingerB.add(fingerA).scale(0.5);

		let scale = length / this._initGestureValues.length;
		let pan = center.subtract(this._initGestureValues.center);
		rotation = this._initGestureValues.rotation - rotation;

		let matrix = new CAL.Matrix({
			x: pan.x, 
			y: pan.y
		}).rotateAroundAbsolute(rotation, center).scaleAroundAbsolute(scale, scale, center);

		stepTransform.copyMatrix(matrix);

		image.copyMatrix(initTransform.multiplyMatrix(stepTransform));		
	}

	touchEnd (touches) {
		initTransform.copyMatrix(initTransform.multiplyMatrix(stepTransform));

		stepTransform.identity();
	}

	draw (context) {
		for (let touchObject of group.touches) {
			if (!touchObject) {
				continue;
			}

			let {finger, position} = touchObject;

			context.fillStyle = this.colors[finger];

			context.beginPath();
			context.arc(position.x, position.y, 40, 0, Math.PI*2, false);
			context.fill();
		}
	}
}

group.add(new MouseViewer(), image);

(function loop () {
	group.cycle();

	requestAnimFrame(loop);
}());
