import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'nearest';

/*
 * Compute nearest point
 */
const action = function(control) {
  const collection = ol3turf.utils.getCollection(control, 2, Infinity);
  const numPoints = collection.features.length;
  const pts = ol3turf.utils.getPoints(collection, numPoints, numPoints);
  const targetPoint = pts[0];
  const points = turf.featureCollection(pts.slice(1));

  const output = turf.nearest(targetPoint, points);
  const inputs = {
    targetPoint: targetPoint,
    points: points,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Find set point nearest to first point';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

