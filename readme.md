# OpenLayers Turf

[![build](https://travis-ci.org/dpmcmlxxvi/ol3-turf.svg?branch=master)](https://travis-ci.org/dpmcmlxxvi/ol3-turf)
[![coverage](https://img.shields.io/coveralls/dpmcmlxxvi/ol3-turf.svg)](https://coveralls.io/r/dpmcmlxxvi/ol3-turf?branch=master)
[![codacy](https://img.shields.io/codacy/grade/44810a70e6a34122818dfa31e4304c50.svg)](https://www.codacy.com/app/dpmcmlxxvi/ol3-turf?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dpmcmlxxvi/ol3-turf&amp;utm_campaign=Badge_Grade)
[![npm](https://badge.fury.io/js/ol3-turf.svg)](https://badge.fury.io/js/ol3-turf)
[![Greenkeeper](https://badges.greenkeeper.io/dpmcmlxxvi/ol3-turf.svg)](https://greenkeeper.io/)

[OpenLayers Turf](https://github.com/dpmcmlxxvi/ol3-turf) (olturf) is a
[Turf](http://turfjs.org/) toolbar for [OpenLayers](http://openlayers.org/).
The toolbar provides the following features:

- **Customizable** commands to display
- **Forms** to collect command inputs
- **Popups** to display numerical outputs
- **Input** features are selected in the map
- **Output** features are displayed in the map

Instead of displaying all the Turf commands available, individual commands can
be selected or a subset of pre-defined groups can be displayed. The following
groups are available `aggregation`, `classification`, `data`, `grids`,
`interpolation`, `measurement`, `misc`, `joins`, `transformation`. A toolbar can
be added to an OpenLayers map easily by adding its dependency scripts and style
sheets (see [documentation](http://dpmcmlxxvi.github.io/ol3-turf/web/start.html)
), creating an instance, and adding it to the map:

```javascript
const toolbar = new olturf.Toolbar();
const map = new ol.Map({...});
map.addControl(toolbar);
```

  ![](docs/web/img/olturf-example-screenshot.png)

## DOCUMENTATION

The following help is available at the olturf
[website](http://dpmcmlxxvi.github.io/ol3-turf):

- [Inroduction](http://dpmcmlxxvi.github.io/ol3-turf/web/)
- [Getting Started](http://dpmcmlxxvi.github.io/ol3-turf/web/start.html)
- [Examples](http://dpmcmlxxvi.github.io/ol3-turf/web/demos.html)
- [API](http://dpmcmlxxvi.github.io/ol3-turf/api/)

## BUILD

To build and test the library locally:

```shell
npm install
npm test
```

The bundled library and stylesheet are at `dist/olturf.min.js` and
`dist/olturf.min.css`.

## LICENSE

Copyright (c) 2016 Daniel Pulido <mailto:dpmcmlxxvi@gmail.com>

Source code is released under the [MIT License](http://opensource.org/licenses/MIT).
Documentation is released under the [CC BY 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
Icons are from [OSGeo](http://trac.osgeo.org/osgeo/wiki) and released under the
[CC BY 3.0](http://creativecommons.org/licenses/by-sa/3.0/).
