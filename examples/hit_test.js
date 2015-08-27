import * as CAL from 'src/index.js';

var group = new CAL.Group({
	canvas: document.getElementById("CAL")
});

let shape = new CAL.Shape({
	points: [
		new CAL.Vector(100, 100), 
		new CAL.Vector(200, 200), 
		new CAL.Vector(300, 100), 
		new CAL.Vector(300, -100), 
		new CAL.Vector(250, -200)
	], 
	lineWidth: 10, 
	shapeColor: false, 
	closePath: false,
	rotation: 1, 
	sy: 1.1, 
	sx: 0.8, 
	x: 200, 
	y: 100
});

group.add(shape);

group.clearCanvas = true;
group.drawCanvas = true;

let collisionMap = new CAL.CollisionMap().createFromShape(shape, {margin: 10, applyMatrix: true});

class HitDetection {
	constructor () {
		this.visible = false;
		this.active = true;
	}

	mouseMove (mouse) {
		shape.lineColor.setColor(collisionMap.hit(mouse.position) ? 0xff0000 : 0x000000);

		group.clearCanvas = true;
		group.drawCanvas = true;
	}

	keyDown (mouse) {
		for (let x = 0; x < group.image.width; x ++) {
			for (let y = 0; y < group.image.height; y ++) {
				let position = new CAL.Vector(x, y);

				group.context.fillStyle = collisionMap.hit(position) ? 'rgba(0,255,0,0.4)' : 'rgba(255,0,0,0.4)';

				group.context.fillRect(x, y, 1, 1);
			}
		}
	}
}

group.add(new HitDetection());

(function loop () {
	requestAnimFrame(loop);

	group.cycle();
}());
