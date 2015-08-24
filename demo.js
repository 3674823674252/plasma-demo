function plasma(canvas) {
	var width, height;
	var ctx;

	this.init = function () {
		width = canvas.offsetWidth;
		height = canvas.offsetHeight;

		ctx = canvas.getContext('2d');

		this.points = this.getPoints(width, height);

		this.draw();
	};

	this.getPoints = function (w, h) {
		var points = [];

		for (var i = 0; i < w; i++) {
			points[i] = [];
		}

		var p1 = Math.random();
		var p2 = Math.random();
		var p3 = Math.random();
		var p4 = Math.random();

		this.split(points, 0, 0, width, height, p1, p2, p3, p4);

		return points;
	};

	this.split = function (p, x, y, w, h, p1, p2, p3, p4) {
		var center = this.norm(p1 + p2 + p3 + p4) / 4;
		var nw = ~~(w / 2);
		var nh = ~~(h / 2);

		if (nw > 1 && nh > 1) {
			var np1 = this.norm(p1 / 2 + p2 / 2);
			var np2 = this.norm(p2 / 2 + p3 / 2);
			var np3 = this.norm(p3 / 2 + p4 / 2);
			var np4 = this.norm(p4 / 2 + p1 / 2);

			center += this.shift(nw, nh);

			this.split(p, x, y, nw, nh, p1, np1, center, np4);
			this.split(p, x + nw, y, w - nw, nh, np1, p2, np2, center);
			this.split(p, x, y + nh, nw, h, h - nh, center, np3, p4);
			this.split(p, x + nw, y + nh, w - nw, h - nh, center, np2, p3, np3);
		} else {
			p[x][y] = center;			
		}
	};

	this.norm = function (v) {
		return v > 1 ? 1 : v < 0 ? 0 : v;
	};

	this.shift = function (nw, nh) {
		return Math.random() * (nw + nh) / (width + height);
	};

	this.draw = function () {
		var color;
		ctx.clearRect(0, 0, width, height);

		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				color = this.getColor(this.points[i][j]);
				ctx.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
				ctx.fillRect(i, j, 1, 1);
			}
		}
	};

	this.getColor = function (v) {
		var r, g, b;

		if (v < 0.5) {
			r = v + 0.2;
		} else {
			r = Math.random() * 0.1 + 0.1;
			r = r > 1 ? 1 : r;
		}

		if (v < 0.4) {
			g = v + Math.random() * 0.3;
		} else {
			g = Math.random * 0.3 + 0.4;
			g = g > 1 ? 1 : g;
		}

		if (v < 0.4) {
			b = v + Math.random() * 0.4;
		} else {
			b = Math.random * 0.1 + 0.3;
			b = b > 1 ? 1 : b;
		}

		return {
			r: ~~(255 * r),
			g: ~~(255 * g),
			b: ~~(255 * b)
		};
	};

	this.init();
}

new plasma(document.getElementById('viewport'));