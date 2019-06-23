import Control from './control';
import utils from './utils';

const name = 'inside';

/*
 * Compute if point is inside polygon
 */
const action = function(control) {
  // Gather point and polygon selected
  const collection = utils.getCollection(control, 2, 2);
  const points = utils.getPoints(collection, 1, 1);
  const polygons = utils.getPolygonsAll(collection, 1, 1);
  const point = points[0];
  const polygon = polygons[0];

  const output = turf.inside(point, polygon);
  const inputs = {
    point: point,
    polygon: polygon,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Point inside polygon?';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

