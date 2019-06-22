import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'union';

/*
 * Compute union of two polygons
 */
const action = function(control) {
  const collection = ol3turf.utils.getCollection(control, 2, 2);
  const polygons = ol3turf.utils.getPolygons(collection, 2, 2);
  const poly1 = polygons[0];
  const poly2 = polygons[1];

  const output = turf.union(poly1, poly2);
  const inputs = {
    poly1: poly1,
    poly2: poly2,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create Union Polygon';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

