import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'tesselate';

/*
 * Compute tesselation
 */
const action = function(control) {
  const collection = ol3turf.utils.getCollection(control, 1, 1);
  const polygons = ol3turf.utils.getPolygons(collection, 1, 1);
  const polygon = polygons[0];

  const output = turf.tesselate(polygon);
  const inputs = {
    polygon: polygon,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create tesselation';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

