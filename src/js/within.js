import Control from './control';
import utils from './utils';

const name = 'within';

/*
 * Compute points within polygons
 */
const action = function(control) {
  const collection = utils.getCollection(control, 2, Infinity);
  const pts = utils.getPoints(collection, 1, collection.features.length - 1);
  const numPolygons = collection.features.length - pts.length;
  const polys = utils.getPolygons(collection, numPolygons, numPolygons);

  const points = turf.featureCollection(pts);
  const polygons = turf.featureCollection(polys);

  const output = turf.pointsWithinPolygon(points, polygons);
  if (output.features.length === 0) {
    throw new Error('No points found within.');
  }
  const inputs = {
    points: points,
    polygons: polygons,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Find points within polygons';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

