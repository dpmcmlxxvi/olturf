import Control from './control';
import utils from './utils';

const name = 'intersect';

/*
 * Compute intersection of two polygons
 */
const action = function(control) {
  const collection = utils.getCollection(control, 2, 2);
  const polygons = utils.getPolygonsAll(collection, 2, 2);

  const poly1 = polygons[0];
  const poly2 = polygons[1];
  const output = turf.intersect(poly1, poly2);
  const inputs = {
    poly1: poly1,
    poly2: poly2,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create Intersection Polygon';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

