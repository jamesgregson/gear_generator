
var graphics = {

	component_to_hex: function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	},

	rgb_to_hex: function(r, g, b) {
	    return "#" + this.component_to_hex(r) + this.component_to_hex(g) + this.component_to_hex(b);
	},

	init: function( canvas, bounds ){
		var gctx = { 
			canvas: canvas, 
			context: canvas.getContext("2d"), 
			width: canvas.width, 
			height: canvas.height, 
			bounds: bounds, 
			colour: this.rgb_to_hex(0,0,0) 
		};
		return gctx;
	}, 

	resize: function( gctx, width, height ){
		gctx.canvas.width = width;
		gctx.canvas.height = height;
		gctx.width = width;
		gctx.height = height;
	},

	clear: function( gctx ){
		gctx.context.clearRect(0, 0, gctx.canvas.width, gctx.canvas.height );
		gctx.canvas.width = gctx.canvas.width;
		gctx.context.fillStyle='white';
		gctx.context.fillRect( 0, 0, gctx.canvas.width, gctx.canvas.height );
		gctx.context.fillStyle='none';
	},  

	color: function( gctx, r, g, b ){
		gctx.colour = this.rgb_to_hex( r, g, b );
	},

	map_point: function( gctx, pnt ){
		var mp = [ gctx.width*(pnt[0]-gctx.bounds[0])/(gctx.bounds[1]-gctx.bounds[0]), gctx.height*(pnt[1]-gctx.bounds[2])/(gctx.bounds[3]-gctx.bounds[2]) ];
		return mp;
	},

	rotate_point: function( cen, pnt, theta ){
		var tpnt = [ pnt[0]-cen[0], pnt[1]-cen[1] ];
		var rpnt = [ Math.cos(theta)*tpnt[0] + Math.sin(theta)*tpnt[1], -Math.sin(theta)*tpnt[0]+Math.cos(theta)*tpnt[1] ];
		return [ rpnt[0]+cen[0], rpnt[1]+cen[1] ];
	},

	rotate_curve: function( cen, pnts, theta ){
		var s = Math.sin(theta);
		var c = Math.cos(theta);
		var ret = [];
		for( var i=0; i<pnts.length; i++ ){
			x = pnts[i][0]-cen[0];
			y = pnts[i][1]-cen[1];
			ret[i] = [ c*x + s*y + cen[0], -s*x + c*y + cen[1] ];
		}
		return ret;
	},

	circle: function( gctx, center, rad ){
		var cen = this.map_point( gctx, center );
		var beg = this.map_point( gctx, [center[0]+rad, center[1]] );
		gctx.context.beginPath();
		gctx.context.arc( cen[0], cen[1], beg[0]-cen[0], beg[1]-cen[1], 2*Math.PI );
		gctx.context.strokeStyle = gctx.colour;
		gctx.context.stroke();
	},

	line: function( gctx, p0, p1 ){
		var mp0 = this.map_point( gctx, p0 );
		var mp1 = this.map_point( gctx, p1 );
		gctx.context.beginPath();
		gctx.context.moveTo( mp0[0], mp0[1] );
		gctx.context.lineTo( mp1[0], mp1[1] );
		gctx.context.strokeStyle = gctx.colour;
		gctx.context.stroke();
	},

	polyline: function( gctx, pnts, close ){
		gctx.context.fillStyle = gctx.colour;
		gctx.context.beginPath();
		var p = this.map_point( gctx, pnts[0] );
		gctx.context.moveTo( p[0], p[1] );
		for( var i=1; i<pnts.length; i++ ){
			p = this.map_point( gctx, pnts[i] );
			gctx.context.lineTo( p[0], p[1] );
		}
		gctx.context.closePath();
		gctx.context.fill();
		gctx.context.stroke();
	}


};