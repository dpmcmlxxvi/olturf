import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'inside';

/*
 * Compute if point is inside polygon
 */
const action = function(control) {
  // Gather point and polygon selected
  const collection = ol3turf.utils.getCollection(control, 2, 2);
  const points = ol3turf.utils.getPoints(collection, 1, 1);
  const polygons = ol3turf.utils.getPolygonsAll(collection, 1, 1);
  const point = points[0];
  const polygon = polygons[0];

  const output = turf.inside(point, polygon);
  const inputs = {
    point: point,
    polygon: polygon,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Point inside polygon?';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

