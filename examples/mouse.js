import * as CAL from 'src/index.js';

const scene = new CAL.Group({
	canvas: document.getElementById('CAL')
});

class mouseHandler {
	constructor () {
		this.active = true;
		this.depth = 0;
		this.visible = false;
	}

	mouseDown (event, parent) {
		console.log('mouse down', event);
	}

	mouseMove (event, parent) {
		console.log('mouse move', event);
	}

	mouseUp (event, parent) {
		console.log('mouse up', event);
	}

	touchStart (event, parent) {
		console.log('touch start', event);
	}

	touchMove (event, parent) {
		console.log('touch move', event);
	}

	touchEnd (event, parent) {
		console.log('touch end', event);
	}
}

scene.add(new mouseHandler());

console.log('loaded');
