import * as CAL from 'src/index.js';

var group = new CAL.Group({canvas: document.getElementById("CAL")});

var image = new CAL.Image('./img/tanks_sheet.png');
image.load(() => {
	group.drawCanvas = true;
	group.clearCanvas = true;
});

group.add(image);

class LineDistance {
	constructor () {
		this.visible = true;
		this.active = true;

		this.mouse = new CAL.Vector();

		this.pointA = new CAL.Vector(100, 200);
		this.pointB = new CAL.Vector(600, 400);

		this.text = new CAL.Text();

		this.distance = 0;
	}
	mouseMove (mouse) {
		this.mouse.copy(mouse.position);

		this.parent.drawCanvas = true;
		this.parent.clearCanvas = true;

		var normal = this.pointB.subtract(this.pointA).normal().normalize();
		this.distance = Math.abs(normal.dot(this.mouse.subtract(this.pointA)));
	}
	draw (context, matrix) {
		
		context.beginPath();
		context.arc(this.mouse.x, this.mouse.y, 10, 0, Math.PI*2, false);
		context.stroke();

		context.beginPath();
		context.arc(this.pointA.x, this.pointA.y, 3, 0, Math.PI*2, false);
		context.stroke();

		context.beginPath();
		context.arc(this.pointB.x, this.pointB.y, 3, 0, Math.PI*2, false);
		context.stroke();

		context.beginPath();
		context.moveTo(this.pointA.x, this.pointA.y);
		context.lineTo(this.pointB.x, this.pointB.y);
		context.stroke();

		this.text.drawText(context, "distance: " + Math.round(this.distance) + "px", 100, 150);
	}
}
var lineDistance = new LineDistance();
group.add(lineDistance);

(function loop () {
	requestAnimFrame(loop);

	group.cycle();
})();