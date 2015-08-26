import * as CAL from 'src/index.js';

var group = new CAL.Group({
	canvas: document.getElementById("CAL")
});

class EasingsObject {
	constructor  (y, easing) {
		this.visible = true;
		this.active = true;

		this.easing = easing;

		this.x = 30;
		this.y = y;

		this.text = new CAL.Text();
	}

	mouseDown (mouse) {
		if (this.tween !== undefined) {
			this.parent.remove(this.tween);
		}

		let targetObject = this;
		let targetProperties = {
			x: mouse.position.x
		}
		let duration = 2000;
		let options = {
			easing: CAL.Utils.Easings[this.easing], 
			clearCanvas: true, 
			drawCanvas: true
		};

		this.tween = new CAL.Tween(targetObject, targetProperties, duration, options);

		this.parent.add(this.tween);
	}

	draw (context) {
		this.text.drawText(context, `CAL.Utils.Easings.${this.easing}`, this.x, this.y);
	}
}

var y = 45;
for (var i in CAL.Utils.Easings) {
	group.add(new EasingsObject(y, i));
	y += 45;
}

(function loop () {
	requestAnimFrame(loop);

	group.cycle();
}());