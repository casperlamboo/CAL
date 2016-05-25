import * as CAL from 'src/index.js';

const group = new CAL.GroupInteractive({
	canvas: document.getElementById('CAL')
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

		const targetObject = this;
		const targetProperties = {
			x: mouse.position.x
		};
		const duration = 2000;
		const options = {
			easing: CAL.Utils.Easings[this.easing],
			clearCanvas: true,
			drawCanvas: true
		};

		this.tween = new CAL.Tween(this, targetProperties, duration, options);

		this.parent.add(this.tween);
	}

	draw (context) {
		this.text.drawText(context, `CAL.Utils.Easings.${this.easing}`, this.x, this.y);
	}
}

let y = 45;
for (let easing in CAL.Utils.Easings) {
	group.add(new EasingsObject(y, easing));
	y += 45;
}

(function loop () {
	group.cycle();

	requestAnimFrame(loop);
}());
