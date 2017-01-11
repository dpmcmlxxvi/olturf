ol3-turf
============================================================

[![build status](https://travis-ci.org/dpmcmlxxvi/ol3-turf.svg?branch=master)](https://travis-ci.org/dpmcmlxxvi/ol3-turf)
[![coverage status](https://img.shields.io/coveralls/dpmcmlxxvi/ol3-turf.svg)](https://coveralls.io/r/dpmcmlxxvi/ol3-turf?branch=master)
[![npm version](https://badge.fury.io/js/ol3-turf.svg)](https://badge.fury.io/js/ol3-turf)
[![dependencies status](https://img.shields.io/david/dpmcmlxxvi/ol3-turf.svg)](https://david-dm.org/dpmcmlxxvi/ol3-turf)
[![devdependencies status](https://img.shields.io/david/dev/dpmcmlxxvi/ol3-turf.svg)](https://david-dm.org/dpmcmlxxvi/ol3-turf/#info=devDependencies)
[![built with grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

The ol3-turf library is a [Turf](http://turfjs.org/) toolbar for
[OpenLayers 3](http://openlayers.org/). The toolbar is a OpenLayers 3 custom
control that provides access to Turf commands. For commands that require user
inputs (e.g., point grid) a popup form is displayed. The Turf command output is
either added to the map (e.g., a feature) or displayed as a popup message
(e.g., polygon area). The toolbar is customizable in the commands displayed
and its styling.

  ![](docs/web/img/ol3turf-example-screenshot.png)

  DOCUMENTATION
------------------------------------------------------------

The following help is available at the ol3-turf
[website](http://dpmcmlxxvi.github.io/ol3-turf):

- [Inroduction](http://dpmcmlxxvi.github.io/ol3-turf/web/)
- [Examples](http://dpmcmlxxvi.github.io/ol3-turf/web/demos.html)
- [API](http://dpmcmlxxvi.github.io/ol3-turf/api/)

BUILD
------------------------------------------------------------

The only requirement for building ol3-turf is [node.js](https://nodejs.org).
The following instructions assume that `grunt-cli` has been installed globally:

    npm install -g grunt-cli

To build the library clone it, install it, then grunt it

    git clone https://github.com/dpmcmlxxvi/ol3-turf.git
    npm install
    grunt

TEST
------------------------------------------------------------

To run the unit tests

    grunt test

Then open the coverage report in the `coverage` directory in a browser.

USAGE
------------------------------------------------------------

The ol3-turf library consists of two files

 - ol3-turf.js
 - ol3-turf.css

and their minified versions. The main class exposed is
[ol.control.Turf](http://dpmcmlxxvi.github.io/ol3-turf/api/ol.control.Turf.html)
which is a OpenLayers 3 custom control that extends the 
[ol.control.Control](http://openlayers.org/en/latest/apidoc/ol.control.Control.html)
class. The simplest use case is to create the control and add it to an existing
[ol.Map](http://openlayers.org/en/latest/apidoc/ol.Map.html). This will add all
available Turf commands to the toolbar and use the default styling.

    var toolbar = new ol.control.Turf();
    var map = new ol.Map({...});
    map.addControl(toolbar);

The toolbar constructor takes an optional `options` argument which extends the
[ol.control.Control](http://openlayers.org/en/latest/apidoc/ol.control.Control.html)
options object. See the
[ol.control.Turf](http://dpmcmlxxvi.github.io/ol3-turf/api/ol.control.Turf.html)
documentation for details. The options allow modifying the toolbar's defaut
behavior by controlling which Turf controls are displayed, providing a custom
callback function to handle the processing of the Turf outputs, and providing a
custom style sheet class for the toolbar. In addition, the various `ol3-turf-*`
style sheet classes for the toolbar, controls, forms, and popups can be
overridden to suit an application's look and feel.

LICENSE
------------------------------------------------------------

Copyright (c) 2016 Daniel Pulido <dpmcmlxxvi@gmail.com>

Source code is released under the [MIT License](http://opensource.org/licenses/MIT).
Documentation is released under the [CC BY 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
Icons are from [OSGeo](http://trac.osgeo.org/osgeo/wiki) and released under the
[CC BY 3.0](http://creativecommons.org/licenses/by-sa/3.0/).
