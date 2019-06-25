import Control from './control';
import utils from './utils';

const name = 'tesselate';

/*
 * Compute tesselation
 */
const action = function(control) {
  const collection = utils.getCollection(control, 1, 1);
  const polygons = utils.getPolygons(collection, 1, 1);
  const polygon = polygons[0];

  const output = turf.tesselate(polygon);
  const inputs = {
    polygon: polygon,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create tesselation';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

