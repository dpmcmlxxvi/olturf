import Control from './control';
import utils from './utils';

const name = 'planepoint';

/*
 * Triangulate a point in a plane
 */
const action = function(control) {
  const collection = utils.getCollection(control, 2, 2);
  const pt = utils.getPoints(collection, 1, 1);
  const tr = utils.getPolygons(collection, 1, 1);
  const point = pt[0];
  const triangle = tr[0];

  const output = turf.planepoint(point, triangle);
  const inputs = {
    point: point,
    triangle: triangle,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Triangulate a point in a plane';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

