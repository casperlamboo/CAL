import Matrix from '../math/matrix.js';
import Color from '../math/color';

export default class Text extends Matrix {

	constructor (options = {}) {
		let {visible = true, active = true, depth = 0, text = '', style = 'normal', variant = 'normal', weight = 'normal', size = 12, font = 'Arial', align = 'left', baseline = 'bottom', textAlign = 'left', color = new Color(), alpha = 'number'} = options;
		super(options);

		this.visible = visible;
		this.active = active;
		this.depth = depth;
		this.text = text;
		this.style = style;
		this.variant = variant;
		this.weight = weight;
		this.size = size;
		this.font = font;
		this.align = align;
		this.baseline = baseline;

		this.textAlign = textAlign;

		this.color = color;
		this.alpha = alpha;
	}

	measure (text = this.text) {
		context.font = [this.style, this.variant, this.weight, this.size + "px", this.font].join(" ");

		return context.measureText(text).width;
	}

	drawText (context, text, x, y) {
		context.font = [this.style, this.variant, this.weight, this.size + "px", this.font].join(" ");

		context.textAlign = this.align;
		context.textBaseline = this.baseline;
		
		this.color.setContext(context);
		
		context.fillText(text, x, y);
	}

	drawTextAlpha (context, text, x, y, apha) {
		context.globalAlpha = apha;

		this.drawText(context, text, x, y);

		context.globalAlpha = 1;
	}

	draw (context, matrix) {
		context.save();

		context.globalAlpha = this.alpha;
		matrix.setMatrixContext(context);

		this.drawText(context, this.text, 0, 0);
		
		context.restore();
	}

	clone () {
		return new Text({
			style : this.style,
			variant : this.variant,
			weight : this.weight,
			size : this.size,
			font : this.font,
			color : this.color.clone()
		});
	}

};