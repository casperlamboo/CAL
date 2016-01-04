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

	setColor (...args) {
		if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') {
			this.setFromRGB(...args);
		}
		else if (typeof arguments[0] === 'number') {
			this.setFromHex(...args);
		}
	}

	setFromRGB (r, g, b, alpha = 1) {
		this.r = r;
		this.g = g;
		this.b = b;

		this.a = alpha;
	}

	setFromHex (hex, alpha = 1) {
		hex = Math.floor(hex);

		this.r = hex >> 16 & 255;
		this.g = hex >> 8 & 255;
		this.b = hex & 255;

		this.a = alpha;
	}

	getString () {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
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
