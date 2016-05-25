import * as CAL from 'src/index.js';

let group = new CAL.GroupInteractive({
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
	x: 400,
	y: 240,
	sx: 0.9,
	sy: 0.4,
	rotation: 2
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

	keyDown ({key}) {
		let red = new CAL.Color(255, 0, 0, 0.4);
		let green = new CAL.Color(0, 255, 0, 0.4);

		let context = group.context;

		if (key === 'space') {
			for (let x = 0; x < group.image.width; x ++) {
				for (let y = 0; y < group.image.height; y ++) {
					let position = new CAL.Vector(x, y);

					let hit = collisionMapShape.hit(position) || collisionMapImage.hit(position);
					context.fillStyle = hit ? green.setFill(context) : red.setFill(context);

					context.fillRect(x, y, 1, 1);
				}
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
