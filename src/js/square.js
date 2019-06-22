import Control from './control';
import utils from './utils';

// Control name
const name = 'square';

/*
 * Compute square
 */
const action = function(control) {
  // Gather selected features
  const collection = utils.getCollection(control, 1, Infinity);
  const bbox = turf.bbox(collection);
  const square = turf.square(bbox);

  const output = turf.bboxPolygon(square);
  const inputs = {
    bbox: bbox,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create Square';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

