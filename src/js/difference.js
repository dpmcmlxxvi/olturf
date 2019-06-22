import Control from './control';
import utils from './utils';

const name = 'difference';

/*
 * Compute difference between two polygons
 */
const action = function(control) {
  const collection = utils.getCollection(control, 2, 2);
  const polygons = utils.getPolygons(collection, 2, 2);
  const poly1 = polygons[0];
  const poly2 = polygons[1];
  const output = turf.difference(poly1, poly2);
  const inputs = {
    poly1: poly1,
    poly2: poly2,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create Difference Polygon';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

