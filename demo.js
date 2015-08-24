function plasma(canvas) {
	var width, height;
	var ctx;

	this.init = function () {
		width = 20;
		height = 20;

		ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;

		this.points = this.getPoints(width, height);

		this.draw();

		new convolution_filter(canvas);
	};

	this.getPoints = function (w, h) {
		var points = [];

		for (var i = 0; i < w; i++) {
			points[i] = [];
		}

		var p1 = (Math.random());
		var p2 = (Math.random());
		var p3 = (Math.random());
		var p4 = (Math.random());

		this.split(points, 0, 0, width, height, p1, p2, p3, p4);

		return points;
	};

	this.split = function (p, x, y, w, h, p1, p2, p3, p4) {
		var nw = ~~(w / 2);
		var nh = ~~(h / 2);

		if (w > 1 || h > 1) {
			var np1 = this.norm(p1 / 2 + p2 / 2);
			var np2 = this.norm(p2 / 2 + p3 / 2);
			var np3 = this.norm(p3 / 2 + p4 / 2);
			var np4 = this.norm(p4 / 2 + p1 / 2);
			var center = this.norm((p1 + p2 + p3 + p4) / 4 + this.shift(nw, nh));

			this.split(p, 
				x, y, nw, nh, 
				p1, np1, center, np4);
			this.split(p, 
				x + nw, y, w - nw, nh, 
				np1, p2, np2, center);
			this.split(p, 
				x, y + nh, nw, h - nh, 
				np4, center, np3, p4);
			this.split(p, 
				x + nw, y + nh, w - nw, h - nh, 
				center, np2, p3, np3);
		} else {
			p[x][y] = (p1 + p2 + p3 + p4) / 4;			
		}
	};

	this.norm = function (v) {
		return v > 1 ? 1 : (v < 0 ? 0 : v);
	};

	this.shift = function (nw, nh) {
		return (0.5 - Math.random()) * (nw + nh) / (width + height);
	};

	this.draw = function () {
		var color;
		ctx.clearRect(0, 0, width, height);

		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				color = this.getColor(this.points[i][j]);
				var style = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
				ctx.fillStyle = style;
				// console.log(style);
				ctx.fillRect(i, j, 1, 1);
			}
		}
	};

	this.getColor = function (c) {
		var r, g, b;

		if (c < 0.5)
			r = c * 2;
		else
			r = (1.0 - c) * 2;

		//g
		if (c >= 0.3 && c < 0.8)
			g = (c - 0.3) * 2;
		else if (c < 0.3)
			g = (0.3 - c) * 2;
		else
			g = (1.3 - c) * 2;

		//b
		if (c >= 0.5)
			b = (c - 0.5) * 2;
		else
			b = (0.5 - c) * 2;
		return {
			r: ~~(255 * r),
			g: ~~(255 * g),
			b: ~~(255 * b)
		};
	};

	// setInterval(this.init.bind(this), 60);
}

new plasma(document.getElementById('viewport'));

var tempCanvas = document.createElement('canvas');
document.body.appendChild(tempCanvas);
var tempCtx = tempCanvas.getContext('2d');

function gen_matrix() {
	var is1 = Math.random();
	var is2 = Math.random();
	var is3 = Math.random();
	var is4 = Math.random();
	var is5 = Math.random();
	var is6 = Math.random();
	var is7 = Math.random();
	var is8 = Math.random();
	var is9 = Math.random();

	var sgn1 = Math.random() > 0.5 ? 1 : -1;
	var sgn2 = Math.random() > 0.5 ? 1 : -1;
	var sgn3 = Math.random() > 0.5 ? 1 : -1;
	var sgn4 = Math.random() > 0.5 ? 1 : -1;
	var sgn5 = Math.random() > 0.5 ? 1 : -1;
	var sgn6 = Math.random() > 0.5 ? 1 : -1;
	var sgn7 = Math.random() > 0.5 ? 1 : -1;
	var sgn8 = Math.random() > 0.5 ? 1 : -1;
	var sgn9 = Math.random() > 0.5 ? 1 : -1;

	return [
		is1 * sgn1, is2 * sgn2, is3 * sgn3,
		is4 * sgn4, is5 * sgn5, is6 * sgn6,
		is7 * sgn7, is8 * sgn8, is9 * sgn9
	];
}

function convolution_filter(canvas) {
	var w = canvas.width;
	var h = canvas.height;

	var ctx = canvas.getContext('2d');
	var pixels = ctx.getImageData(0, 0, w, h);
	var pw = pixels.width;
	var ph = pixels.height;

	pixels = pixels.data;

	var mt = gen_matrix();
	var msum = mt.reduce(function (a, e) {
		return a + e;
	}, 0);

	var tempData = tempCtx.createImageData(pw, ph);
	var tempPxs = tempData.data;
	for (var i = 0; i < ph; i++) {
		for (var j = 0; j < 4 * pw; j++) {
			var x = i * pw;
			var y = j * 4;

			var pixelr = pixels[x + y];
			var pixelg = pixels[x + y + 1];
			var pixelb = pixels[x + y + 2];
			var pixela = pixels[x + y + 3];
			var n1r = ((j - 1) < 0 || (i - 1) < 0) ? 1 : pixels[(i - 1) * ph + j - 4];
			var n1g = ((j - 1) < 0 || (i - 1) < 0) ? 1 : pixels[(i - 1) * ph + j - 3];
			var n1b = ((j - 1) < 0 || (i - 1) < 0) ? 1 : pixels[(i - 1) * ph + j - 2];
			var n1a = ((j - 1) < 0 || (i - 1) < 0) ? 1 : pixels[(i - 1) * ph + j - 1];
			var n2r = i - 1 < 0 ? 1 : pixels[(i - 1) * ph + j];
			var n2g = i - 1 < 0 ? 1 : pixels[(i - 1) * ph + j + 1];
			var n2b = i - 1 < 0 ? 1 : pixels[(i - 1) * ph + j + 2];
			var n2a = i - 1 < 0 ? 1 : pixels[(i - 1) * ph + j + 3];
			var n3r = (i - 1 < 0 || j + 4 >= 4 * pw) ? 1 : pixels[(i - 1) * ph + j + 4];
			var n3g = (i - 1 < 0 || j + 4 >= 4 * pw) ? 1 : pixels[(i - 1) * ph + j + 5];
			var n3b = (i - 1 < 0 || j + 4 >= 4 * pw) ? 1 : pixels[(i - 1) * ph + j + 6];
			var n3a = (i - 1 < 0 || j + 4 >= 4 * pw) ? 1 : pixels[(i - 1) * ph + j + 7];
			var n4r = ((j - 1) < 0) ? 1 : pixels[i * ph + j - 4];
			var n4g = ((j - 1) < 0) ? 1 : pixels[i * ph + j - 3];
			var n4b = ((j - 1) < 0) ? 1 : pixels[i * ph + j - 2];
			var n4a = ((j - 1) < 0) ? 1 : pixels[i * ph + j - 1];
			var n6r = ((j + 4) >= 4 * pw) ? 1 : pixels[i * ph + j + 4];
			var n6g = ((j + 4) >= 4 * pw) ? 1 : pixels[i * ph + j + 5];
			var n6b = ((j + 4) >= 4 * pw) ? 1 : pixels[i * ph + j + 6];
			var n6a = ((j + 4) >= 4 * pw) ? 1 : pixels[i * ph + j + 7];
			var n7r = ((j - 1) < 0 || (i + 1) === ph) ? 1 : pixels[(i + 1) * ph + j - 4];
			var n7g = ((j - 1) < 0 || (i + 1) === ph) ? 1 : pixels[(i + 1) * ph + j - 3];
			var n7b = ((j - 1) < 0 || (i + 1) === ph) ? 1 : pixels[(i + 1) * ph + j - 2];
			var n7a = ((j - 1) < 0 || (i + 1) === ph) ? 1 : pixels[(i + 1) * ph + j - 1];
			var n8r = i + 1 === ph ? 1 : pixels[(i + 1) * ph + j];
			var n8g = i + 1 === ph ? 1 : pixels[(i + 1) * ph + j + 1];
			var n8b = i + 1 === ph ? 1 : pixels[(i + 1) * ph + j + 2];
			var n8a = i + 1 === ph ? 1 : pixels[(i + 1) * ph + j + 3];
			var n9r = (i + 1 === ph || (j + 4) >= 4 * pw) ? 1 : pixels[(i + 1) * ph + j + 4];
			var n9g = (i + 1 === ph || (j + 4) >= 4 * pw) ? 1 : pixels[(i + 1) * ph + j + 5];
			var n9b = (i + 1 === ph || (j + 4) >= 4 * pw) ? 1 : pixels[(i + 1) * ph + j + 6];
			var n9a = (i + 1 === ph || (j + 4) >= 4 * pw) ? 1 : pixels[(i + 1) * ph + j + 7];
		
			var newpixelr = (n1r * mt[0] + n2r * mt[1] + n3r * mt[2] + 
						n4r * mt[3] + pixelr * mt[4] + n6r * mt[5] + 
						n7r * mt[6] + n8r * mt[7] + n9r * mt[8]) / msum;
			var newpixelb = (n1b * mt[0] + n2b * mt[1] + n3b * mt[2] + 
						n4b * mt[3] + pixelb * mt[4] + n6b * mt[5] + 
						n7b * mt[6] + n8b * mt[7] + n9b * mt[8]) / msum;
			var newpixelg = (n1g * mt[0] + n2g * mt[1] + n3g * mt[2] + 
						n4g * mt[3] + pixelg * mt[4] + n6g * mt[5] + 
						n7g * mt[6] + n8g * mt[7] + n9g * mt[8]) / msum;

			tempPxs[x + y] = newpixelr;
			tempPxs[x + y + 1] = newpixelg;
			tempPxs[x + y + 2] = newpixelb;
			tempPxs[x + y + 3] = pixela;
		}
	}

	ctx.putImageData(tempData, 0, 0);
}