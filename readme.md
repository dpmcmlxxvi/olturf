# OpenLayers Turf

[![build](https://github.com/dpmcmlxxvi/olturf/actions/workflows/build.yml/badge.svg)](https://github.com/dpmcmlxxvi/olturf/actions)
[![coverage](https://img.shields.io/coveralls/dpmcmlxxvi/olturf.svg)](https://coveralls.io/r/dpmcmlxxvi/olturf?branch=master)
[![codacy](https://app.codacy.com/project/badge/Grade/c8c1b0c8b3c842df96a08276fe3cb69a)](https://www.codacy.com/gh/dpmcmlxxvi/olturf/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dpmcmlxxvi/olturf&amp;utm_campaign=Badge_Grade)
[![npm](https://badge.fury.io/js/olturf.svg)](https://badge.fury.io/js/olturf)

[OpenLayers Turf](https://github.com/dpmcmlxxvi/olturf) (olturf) is a
[Turf](http://turfjs.org/) toolbar for [OpenLayers](http://openlayers.org/).
The toolbar provides the following features:

-   **Customizable** commands to display
-   **Forms** to collect command inputs
-   **Popups** to display numerical outputs
-   **Input** features are selected in the map
-   **Output** features are displayed in the map

Instead of displaying all the Turf commands available, individual commands can
be selected or a subset of pre-defined groups can be displayed. The following
groups are available `aggregation`, `classification`, `data`, `grids`,
`interpolation`, `measurement`, `misc`, `joins`, `transformation`.

  ![](docs/web/img/olturf-example-screenshot.png)

## GETTING STARTED

A toolbar can be added to an OpenLayers map by adding its dependencies

```html
<link href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css"
  rel="stylesheet" type="text/css" />
<link href="https://unpkg.com/olturf/dist/olturf.min.css" rel="stylesheet" type="text/css" />

<script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
<script src="https://unpkg.com/@turf/turf@5.1.6/turf.min.js"></script>
<script src="https://unpkg.com/olturf/dist/olturf.min.js"></script>
```

then creating an instance and adding it to the map

```javascript
const toolbar = new olturf.Toolbar();
const map = new ol.Map({...});
map.addControl(toolbar);
```

## DOCUMENTATION

The following help is available at the olturf
[website](http://dpmcmlxxvi.github.io/olturf):

-   [Introduction](http://dpmcmlxxvi.github.io/olturf/web/)
-   [Getting Started](http://dpmcmlxxvi.github.io/olturf/web/start.html)
-   [Examples](http://dpmcmlxxvi.github.io/olturf/web/demos.html)
-   [API](http://dpmcmlxxvi.github.io/olturf/api/)

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
