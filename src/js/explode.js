import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'explode';

/*
 * Compute explode of feature collection
 */
const action = function(control) {
  const collection = ol3turf.utils.getCollection(control, 1, Infinity);

  const output = turf.explode(collection);
  const inputs = {
    geojson: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Explode feature collection';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

