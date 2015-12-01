export default class Color {
	constructor (...args) {
		if (args.length !== 0) {
			this.setColor(...args);
		}
		else {
			this.r = this.g = this.b = 0;
			this.a = 1;
		}
	}

	setColor () {
		if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && typeof arguments[2] === 'number') {
			this.r = arguments[0];
			this.g = arguments[1];
			this.b = arguments[2];
			this.a = (typeof arguments[3] === 'number') ? arguments[3] : 1;
		}
		else if (typeof arguments[0] === 'number') {
			let hex = Math.floor(arguments[0]);

			this.r = hex >> 16 & 255;
			this.g = hex >> 8 & 255;
			this.b = hex & 255;
			this.a = (typeof arguments[1] === 'number') ? arguments[1] : 1;
		}
	}

	getString () {
		return `rgba(${this.r}, ${this.g} , ${this.b} , ${this.a})`;
	}

	setStroke (context) {
		context.strokeStyle = this.getString();

		return this;
	}

	setFill (context) {
		context.fillStyle = this.getString();

		return this;
	}

	setShadow (context) {
		context.shadowColor = this.getString();

		return this;
	}

	setContext (context) {
		this.setStroke(context);
		this.setFill(context);

		return this;
	}
};
