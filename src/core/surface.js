import Draw from './draw.js';

export default class Surface extends Draw {

	constructor (options = {}) {
		let {clearColor = false, canvas = document.createElement("canvas")} = options;
		super(options.centerX, options.centerY, options.numberWidth, options.numberHeight, options);

		this.clearColor = clearColor;

		this.setCanvas(canvas);

		this.setSize(options.width, options.height, options.pixelRatio);
	}

	setSize (width, height, pixelRatio) {
		var width = width || this.image.width;
		var height = height || this.image.height;
		var pixelRatio = (pixelRatio ? pixelRatio : 1);

		this.image.width = width * pixelRatio;
		this.image.height = height * pixelRatio;

		this.image.style.width = width + 'px';
		this.image.style.height = height + 'px';

		this.width = this.image.width / this.numberWidth;
		this.height = this.image.height / this.numberHeight;

		return this;
	}

	setCanvas (canvas) {
		this.image = canvas;
		this.context = canvas.getContext("2d");

		return this;
	}

	clear () {
		if (this.clearColor) {
			this.clearColor.setColor(this.context);
			this.context.fillRect(0, 0, this.image.width, this.image.height);
		}
		else {
			this.context.clearRect(0, 0, this.image.width, this.image.height);
		}

		return this;
	}

	getImageData (x, y, width, height) {
		var x = x || 0;
		var y = y || 0;
		var width = width || this.image.width;
		var height = height || this.image.height;

		return this.context.getImageData(x, y, width, height);
	}

	getDataURL () {
		return this.image.toDataURL();
	}

	/*
	blur = (function () {
		//source: http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
		//author: Mario Klingemann

		var mul_table = [512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
		var shg_table = [9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24 ];

		return function (radius, x, y, width, height) {
			x = x || 0;
			y = y || 0;
			width = this.image.width || 0;
			height = this.image.height || 0;
			var imageData = this.getImageData(x, y, width, height);

			var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
			r_out_sum, g_out_sum, b_out_sum, a_out_sum,
			r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
			pr, pg, pb, pa, rbs;

			var div = radius + radius + 1;
			var w4 = width << 2;
			var widthMinus1 = width - 1;
			var heightMinus1 = height - 1;
			var radiusPlus1 = radius + 1;
			var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
			var pixels = imageData.data;

			var stackStart = {r: 0, g: 0, b: 0, next: null};
			var stack = stackStart;
			for (i = 1; i < div; i ++) {
				stack = stack.next = {r: 0, g: 0, b: 0, next: null};
				if (i == radiusPlus1) {
					var stackEnd = stack;
				}
			}
			stack.next = stackStart;
			var stackIn = null;
			var stackOut = null;

			yw = yi = 0;

			var mul_sum = mul_table[radius];
			var shg_sum = shg_table[radius];

			for (y = 0; y < height; y ++) {
				r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
				
				r_out_sum = radiusPlus1 * (pr = pixels[yi]);
				g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
				b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);
				a_out_sum = radiusPlus1 * (pa = pixels[yi+3]);
				
				r_sum += sumFactor * pr;
				g_sum += sumFactor * pg;
				b_sum += sumFactor * pb;
				a_sum += sumFactor * pa;
				
				stack = stackStart;
				
				for (i = 0; i < radiusPlus1; i ++) {
					stack.r = pr;
					stack.g = pg;
					stack.b = pb;
					stack.a = pa;
					stack = stack.next;
				}
				
				for (i = 1; i < radiusPlus1; i ++) {
					p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
					r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
					g_sum += (stack.g = (pg = pixels[p+1])) * rbs;
					b_sum += (stack.b = (pb = pixels[p+2])) * rbs;
					a_sum += (stack.a = (pa = pixels[p+3])) * rbs;
					
					r_in_sum += pr;
					g_in_sum += pg;
					b_in_sum += pb;
					a_in_sum += pa;
					
					stack = stack.next;
				}
				
				stackIn = stackStart;
				stackOut = stackEnd;
				for (x = 0; x < width; x ++) {
					pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
					if (pa === 0) {
						pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
					}
					else {
						pa = 255 / pa;
						pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
						pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
						pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
					}
					
					
					r_sum -= r_out_sum;
					g_sum -= g_out_sum;
					b_sum -= b_out_sum;
					a_sum -= a_out_sum;
					
					r_out_sum -= stackIn.r;
					g_out_sum -= stackIn.g;
					b_out_sum -= stackIn.b;
					a_out_sum -= stackIn.a;
					
					p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
					
					r_in_sum += (stackIn.r = pixels[p]);
					g_in_sum += (stackIn.g = pixels[p+1]);
					b_in_sum += (stackIn.b = pixels[p+2]);
					a_in_sum += (stackIn.a = pixels[p+3]);
					
					r_sum += r_in_sum;
					g_sum += g_in_sum;
					b_sum += b_in_sum;
					a_sum += a_in_sum;
					
					stackIn = stackIn.next;
					
					r_out_sum += (pr = stackOut.r);
					g_out_sum += (pg = stackOut.g);
					b_out_sum += (pb = stackOut.b);
					a_out_sum += (pa = stackOut.a);
					
					r_in_sum -= pr;
					g_in_sum -= pg;
					b_in_sum -= pb;
					a_in_sum -= pa;
					
					stackOut = stackOut.next;

					yi += 4;
				}
				yw += width;
			}


			for (x = 0; x < width; x ++) {
				g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
				
				yi = x << 2;
				r_out_sum = radiusPlus1 * (pr = pixels[yi]);
				g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
				b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);
				a_out_sum = radiusPlus1 * (pa = pixels[yi+3]);
				
				r_sum += sumFactor * pr;
				g_sum += sumFactor * pg;
				b_sum += sumFactor * pb;
				a_sum += sumFactor * pa;
				
				stack = stackStart;
				
				for (i = 0; i < radiusPlus1; i ++) {
					stack.r = pr;
					stack.g = pg;
					stack.b = pb;
					stack.a = pa;
					stack = stack.next;
				}
				
				yp = width;
				
				for (i = 1; i <= radius; i ++) {
					yi = (yp + x) << 2;
					
					r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
					g_sum += (stack.g = (pg = pixels[yi+1])) * rbs;
					b_sum += (stack.b = (pb = pixels[yi+2])) * rbs;
					a_sum += (stack.a = (pa = pixels[yi+3])) * rbs;
				 
					r_in_sum += pr;
					g_in_sum += pg;
					b_in_sum += pb;
					a_in_sum += pa;
					
					stack = stack.next;
				
					if (i < heightMinus1) {
						yp += width;
					}
				}
				
				yi = x;
				stackIn = stackStart;
				stackOut = stackEnd;
				for (y = 0; y < height; y ++) {
					p = yi << 2;
					pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
					if (pa > 0) {
						pa = 255 / pa;
						pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
						pixels[p+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
						pixels[p+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
					}
					else {
						pixels[p] = pixels[p+1] = pixels[p+2] = 0;
					}
					
					r_sum -= r_out_sum;
					g_sum -= g_out_sum;
					b_sum -= b_out_sum;
					a_sum -= a_out_sum;
				 
					r_out_sum -= stackIn.r;
					g_out_sum -= stackIn.g;
					b_out_sum -= stackIn.b;
					a_out_sum -= stackIn.a;
					
					p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;
					
					r_sum += (r_in_sum += (stackIn.r = pixels[p]));
					g_sum += (g_in_sum += (stackIn.g = pixels[p+1]));
					b_sum += (b_in_sum += (stackIn.b = pixels[p+2]));
					a_sum += (a_in_sum += (stackIn.a = pixels[p+3]));
				 
					stackIn = stackIn.next;
					
					r_out_sum += (pr = stackOut.r);
					g_out_sum += (pg = stackOut.g);
					b_out_sum += (pb = stackOut.b);
					a_out_sum += (pa = stackOut.a);
					
					r_in_sum -= pr;
					g_in_sum -= pg;
					b_in_sum -= pb;
					a_in_sum -= pa;
					
					stackOut = stackOut.next;
					
					yi += width;
				}
			}
			return imageData;
		};
	})();

	CAL.Draw.prototype.drawBlur = (function () {
		
		var surface = new CAL.Surface();

		return function (context, number, x, y, radius) {
			if (radius > 0) {
				surface.setSize(this.width + 2*radius, this.height + 2*radius);
				this.drawSimple(surface.context, number, this.centerX+radius, this.centerY+radius);
				var imageData = surface.blur(radius);
				
				context.putImageData(imageData, x-this.centerX - radius, y-this.centerY - radius);

				/*
				surface.setSize(this.width, this.height);
				this.drawSimple(surface.context, number, this.centerX, this.centerY);
				var imageData = surface.blur(radius);
				
				context.putImageData(imageData, x-this.centerX, y-this.centerY);
				*/
				/*
			}
			else {
				this.drawSimple(context, number, x, y);
			}
		};
	})();
	*/

};