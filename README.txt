========================================================
gear_generator: a simple interactive javascript gear generator
(c) James Gregson 2016
james.gregson@gmail.com

License
======================================================== 
Use for whatever you want, at your own risk. Bug reports and feature requests are welcome.

Description 
======================================================== 
These files implement a simple involute spur gear generator in javascript with a html interface. The code is based on two simple javascript libraries: gears.js and graphics.js which handle generating the gear profiles and drawing the profiles to the canvas respectively.  The profiles can be output in SVG, DXF or comma-separated values (CSV) for inclusion in graphics, CAD or other applications. DXF export was guided by Paul Bourke's minimal DXF example (http://paulbourke.net/dataformats/dxf/min3d.html)

The generated profiles are checked for self-intersection with the tooth sector. Intersections here indicate profile self-intersection the top-land and/or bottom-land. If such intersections are detected, the profiles are chopped to ensure a simple polygon output. I have no idea if such profiles will actually mesh correctly but they are at least not valid geometry.

The module is built using the python-based Jinja template system to incorporate gears.js and graphics.js into the template spur_gear_ui.html in order to produce gear_generator.html, which has no external dependencies except JQuery.  This allows the module to be embedded into a <div> element using AJAX without encountering issues related to relative paths. If changes are needed, gear_generator.html can be rebuilt by running the build.py script (provided python and Jinja are installed). You will probably have to tweak the styling of the various elements
