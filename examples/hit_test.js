import * as CAL from 'src/index.js';

let group = new CAL.Group({
	canvas: document.getElementById('CAL')
});

let collisionMapImage;

let image = new CAL.Image('img/hourglass.png', 0, 0, 1, 1, {
	x: 450, 
	y: 50, 
	alpha: 0.5
}).load(() => {
	group.drawCanvas = true;
	group.clearCanvas = true;

	collisionMapImage = new CAL.CollisionMap().createFromImage(image, {applyMatrix: true});
});

group.add(image);

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

let collisionMapShape = new CAL.CollisionMap().createFromShape(shape, {margin: 10, applyMatrix: true});

class HitDetection {
	constructor () {
		this.visible = false;
		this.active = true;
	}

	mouseMove (mouse) {
		shape.lineColor.setColor(collisionMapShape.hit(mouse.position) ? 0xff0000 : 0x000000);
		image.alpha = collisionMapImage.hit(mouse.position) ? 1 : 0.5;

		group.clearCanvas = true;
		group.drawCanvas = true;
	}

	keyDown (mouse) {
		for (let x = 0; x < group.image.width; x ++) {
			for (let y = 0; y < group.image.height; y ++) {
				let position = new CAL.Vector(x, y);

				let hit = collisionMapShape.hit(position) || collisionMapImage.hit(position);
				group.context.fillStyle = hit ? 'rgba(0,255,0,0.4)' : 'rgba(255,0,0,0.4)';

				group.context.fillRect(x, y, 1, 1);
			}
		}
	}
}

group.add(new HitDetection());

group.clearCanvas = true;
group.drawCanvas = true;

(function loop () {
	requestAnimFrame(loop);

	group.cycle();
}());