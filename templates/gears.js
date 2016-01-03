/*
	gears.js
	James Gregson (2015)
	Library of spur gear utility routines
*/
var gears = {

	dupliate_points: function( pnts ){
		var ret = [];
		for( var i=0; i<pnts.length; i++ ){
			ret[i] = [ pnts[i][0], pnts[i][1] ];
		}
		return ret;
	},

	point_radius: function( pnt ){
		return Math.sqrt( pnt[0]*pnt[0] + pnt[1]*pnt[1] );
	},

	lerp: function( val, v0, p0, v1, p1 ){
		var w = (val - v0)/(v1-v0);
		return [p1[0]*w+p0[0]*(1.0-w), p1[1]*w+p0[1]*(1.0-w)];
	},

	rotate_point: function( cen, pnt, theta ){
		var tpnt = [ pnt[0]-cen[0], pnt[1]-cen[1] ];
		var rpnt = [ Math.cos(theta)*tpnt[0] + Math.sin(theta)*tpnt[1], -Math.sin(theta)*tpnt[0]+Math.cos(theta)*tpnt[1] ];
		return [ rpnt[0]+cen[0], rpnt[1]+cen[1] ];
	},

	involute_point: function( r, theta ){
		return [ r*(Math.cos(theta)+theta*Math.sin(theta)), -r*(Math.sin(theta)-theta*Math.cos(theta)) ]; 
	},

	involute_bisect: function( r_base, r_target ){
		var theta_lo = 0.0;
		var r_lo = this.point_radius( this.involute_point( r_base, theta_lo ) );
		var theta_hi = Math.PI;
		var r_hi = this.point_radius( this.involute_point( r_base, theta_hi ) );
		// check if the target is achievable
		if( r_hi < r_target ) 
			return -1.0;

		var theta_mi = (theta_lo+theta_hi)/2.0;
		var r_mi;
		for( i=0; i<20; i++ ){
			theta_mi = (theta_lo+theta_hi)/2.0;
			r_mi = this.point_radius( this.involute_point( r_base, theta_mi ) );
			if( r_mi <= r_target ){
				r_lo     = r_mi;
				theta_lo = theta_mi;
			} else {
				r_hi     = r_mi;
				theta_hi = theta_mi;
			}
		}
		return theta_mi;
	},

	involute_curve: function( r_base, theta_max, r_min, r_max, N ){
		var theta_lo = 0.0;
		var theta_hi = this.involute_bisect( r_base, r_max );
		var curve = [];
		var cnt=0;
		if( r_min < r_base ){
			curve[cnt++] = [ r_min, 0 ];
		}
		var dtheta = (theta_hi-theta_lo)/(N-1);
		for( var i=0; i<N; i++ ){
			curve[cnt++] = this.involute_point( r_base, i*dtheta+theta_lo );
		}
		return curve;
	},

	pitch_diameter: function( module, pressure_angle, num_teeth ){
		return module*num_teeth;
	},

	base_diameter: function( module, pressure_angle, num_teeth ){
		return this.pitch_diameter(module,pressure_angle,num_teeth)*Math.cos(pressure_angle);
	},

	dedendum: function( module, pressure_angle, num_teeth ){
		return 1.2*module;
	},

	addendum: function( module, pressure_angle, num_teeth ){
		return 1.0*module;
	},

	tooth_thickness: function( module, pressure_angle, num_teeth ){
		return Math.PI*this.pitch_diameter(module,pressure_angle,num_teeth)/(2.0*num_teeth);
	},

	generate: function( module, pressure_angle, num_teeth ){
		var Rp = this.pitch_diameter(module,pressure_angle,num_teeth)/2.0;
		var Rb = this.base_diameter(module,pressure_angle,num_teeth)/2.0;
		var Rd = Rp - this.dedendum(module,pressure_angle,num_teeth);
		var Ra = Rp + this.addendum(module,pressure_angle,num_teeth);
		var t  = this.tooth_thickness(module,pressure_angle,num_teeth);

		// find the crossing point of the involute curve with the pitch circle
		var p_cross = this.involute_point( Rb, this.involute_bisect( Rb, Rp ) );
		var theta_cross = Math.atan2( p_cross[1], p_cross[0] );
		var dtheta = t/Rp;

		// compute whether the gear profile will self-intersect once patterned
    	var tmp = this.involute_curve( Rb, Math.PI/2, Rd, Ra, 20 );
		var cnt = 0;
    	var involute = [];
    	for( var i=0; i<tmp.length; i++ ){
    		tpnt = this.rotate_point( [0,0], tmp[i], +theta_cross-dtheta/2 );
    		angle1 = Math.atan2( tpnt[1], tpnt[0] );
    		if( angle1 < Math.PI/num_teeth && tpnt[1] > 0 ){
    			involute[cnt++] = [ tmp[i][0], tmp[i][1] ];
    		}
    	}


    	var cnt = 0;
    	var gear = [];
    	for( var i=0; i<num_teeth; i++ ){
      		var theta = i*Math.PI*2.0/(num_teeth)+theta_cross-dtheta/2;
      		var theta2 = i*Math.PI*2.0/(num_teeth)-theta_cross+dtheta/2;

      		for( var j=0; j<involute.length; j++ ){
      			gear[cnt++] = this.rotate_point( [0,0], [ involute[j][0], involute[j][1] ], theta );
      		}
      		for( var j=involute.length-1; j>=0; j-- ){
      			gear[cnt++] = this.rotate_point( [0,0], [ involute[j][0], -involute[j][1] ], theta2 );
      		}
    	}
    	return gear;
	}

};