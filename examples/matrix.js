import * as CAL from 'src/index.js';

let group = new CAL.Group({
	canvas: document.getElementById('CAL'), 
	x: 10, 
	rotation: 0.2, 
	sx: 2
});

let matrix = new CAL.Matrix({
	x: 100, 
	y: 100, 
	rotation: 1, 
	sx: 0.2, 
	sy: 0.8
});

let image = new CAL.Image('img/hourglass.png', 0, 0, 1, 1, {
	x: matrix.x, 
	y: matrix.y, 
	rotation: matrix.rotation, 
	sx: matrix.sx, 
	sy: matrix.sy
});
image.load(() => {
	let shape = new CAL.Shape({
		points: [
			new CAL.Vector(0, 0), 
			new CAL.Vector(image.width, 0), 
			new CAL.Vector(image.width, image.height), 
			new CAL.Vector(0, image.height)
		], 
		lineWidth: 2, 
		lineColor: new CAL.Color(256, 0, 0), 
		shapeColor: false, 
		closePath: true, 
		x: matrix.x, 
		y: matrix.y, 
		rotation: matrix.rotation, 
		sx: matrix.sx, 
		sy: matrix.sy
	});

	group.add(image, shape);

	group.draw();
});
