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

	setInterval(this.init.bind(this), 60);
}

new plasma(document.getElementById('viewport'));