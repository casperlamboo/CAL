import * as CAL from 'src/index.js';

console.log('loaded');

const scene = new CAL.Group({
	canvas: document.getElementById('CAL')
});

const green = new CAL.Color(0x00ff00);
const red = new CAL.Color(0xff0000);

class mouseHandler {
	constructor () {
		this.active = true;
		this.depth = 0;
		this.visible = false;
	}

	mouseDown (event, parent) {
		console.log('mouseDown', event);

		this.currentShape = new CAL.Shape({
			points: [event.position],
			shapeColor: false,
			lineWidth: 3
		});

		scene.add(this.currentShape);
	}

	mouseMove (event, parent) {
		console.log('mouseMove', event);

		if (this.currentShape) {
			this.currentShape.addPoint(event.position);
			this.currentShape.lineColor = this.currentShape.isClockWise() ? green : red;

			scene.clearCanvas = true;
			scene.drawCanvas = true;
		}
	}

	mouseUp (event, parent) {
		console.log('mouseUp', event);

		delete this.currentShape;

		scene.clearCanvas = true;
		scene.drawCanvas = true;
	}
}

scene.add(new mouseHandler());

(function loop () {
	scene.cycle();

	requestAnimFrame(loop);
}());
