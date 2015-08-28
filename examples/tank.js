import * as CAL from 'src/index.js';

let group = new CAL.Group({
	canvas: document.getElementById('CAL')
});

function init () {
	let field = new Field();
	let tank = new Tank();

	group.add(field, tank);

	group.drawCanvas = true;
}

let fieldTile = [
	[24, 25, 25, 25, 25, 25, 25, 25, 25, 24],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25,  0,  0,  0,  0,  0,  0,  0,  0, 25],
	[25, 24, 24, 24, 24, 24, 24, 24, 24, 25]
];

var tank_sprite = new CAL.Image("./img/tanks_sheet.png", 16, 16, 8, 4);
tank_sprite.load(init);

class Field {
	constructor () {
		this.visible = true;
		this.active = false;
		this.depth = -1;

		let height = fieldTile.length;
		let width = fieldTile[0].length;

		this.surface = new CAL.Surface({width: width * 32, height: height * 32});

		for (var y = 0; y < height; y ++) {
			var row = fieldTile[y];
			for (var x = 0; x < width; x ++) {
				let posX = x * 32 + 16;
				let posY = y * 32 + 16;
				tank_sprite.drawSimple(this.surface.context, row[x], posX, posY);
			}
		}
	}

	draw (context, matrix) {
		this.surface.drawSimple(context, 0, 0, 0);
	}
}

class Tank {
	constructor () {
		this.visible = true;
		this.active = true;
		this.depth = 0;

		this.x = 100;
		this.y = 100;

		this.t = 0;
		this.tileNumber = 1;

		this.direction = [0];
		this.angle = 0;
		this.driving = false;
	}

	keyDown ({key}) {
		if (key.endsWith('arrow')) {
			if (this.driving) {
				this.direction.unshift(key);
			}
			else {
				this.direction[0] = key;
				this.driving = true;
			}
		}
	}

	keyUp ({key}) {
		if (key.endsWith('arrow')) {
			if (this.direction.length > 1) {
				let index = this.direction.indexOf(key);
				this.direction.splice(index, 1);
			}
			else {
				this.driving = false;
			}
		}
	}

	step (dt, group) {
		if (this.driving) {
			let direction;
			switch (this.direction[0]) {
				case 'up_arrow': 
					direction = new CAL.Vector(0, -1);
					this.angle = 0;
					break;

				case 'right_arrow': 
					direction = new CAL.Vector(1, 0);
					this.angle = 1;
					break;

				case 'down_arrow': 
					direction = new CAL.Vector(0, 1);
					this.angle = 2;
					break;

				case 'left_arrow': 
					direction = new CAL.Vector(-1, 0);
					this.angle = 3;
					break;
			}

			let xTile = Math.floor((this.x + 16 * direction.x) / 32);
			let yTile = Math.floor((this.y + 16 * direction.y) / 32);

			if (fieldTile[xTile][yTile] === 0) {
				let step = Math.round(dt / 20);
				this.x += step * direction.x;
				this.y += step * direction.y;

				this.t += dt;
				this.tileNumber = Math.round(this.t / 100) % 7 + 1;
			}

			group.drawCanvas = true;
		}
	}

	draw (context, matrix) {
		let angle = this.angle * Math.PI/2;
		tank_sprite.drawAngle(context, this.tileNumber, this.x, this.y, angle);
	}
}

(function loop () {
	requestAnimFrame(loop);

	group.cycle();
}());
