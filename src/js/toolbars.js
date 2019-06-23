/**
 * @namespace toolbars
 * @memberof olturf
 */

/**
 * Aggregation toolbar: 'collect'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the aggregation toolbar
 */
function aggregation() {
  return ['collect'];
};

/**
 * Classification toolbar: 'nearest'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the classification toolbar
 */
function classification() {
  return ['nearest'];
};

/**
 * Data toolbar: 'random', 'sample'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the data toolbar
 */
function data() {
  return [
    'random',
    'sample',
  ];
};

/**
 * Grids toolbar: 'hex-grid', 'point-grid', 'square-grid', 'triangle-grid',
 *                'tesselate'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the grids toolbar
 */
function grids() {
  return [
    'hex-grid',
    'point-grid',
    'square-grid',
    'triangle-grid',
    'tesselate',
  ];
};

/**
 * Interpolation toolbar: 'isolines', 'planepoint', 'tin'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the interpolation toolbar
 */
function interpolation() {
  return [
    'isolines',
    'planepoint',
    'tin',
  ];
};

/**
 * Joins toolbar: 'inside', 'tag', 'within'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the joins toolbar
 */
function joins() {
  return [
    'inside',
    'tag',
    'within',
  ];
};

/**
 * Measurement toolbar: 'distance', 'line-distance', 'area', 'bearing',
 *                      'center-of-mass', 'center', 'centroid', 'midpoint',
 *                      'point-on-surface', 'envelope', 'square', 'circle',
 *                      'along', 'destination'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the measurement toolbar
 */
function measurement() {
  return [
    'distance',
    'line-distance',
    'area',
    'bearing',
    'center-of-mass',
    'center',
    'centroid',
    'midpoint',
    'point-on-surface',
    'envelope',
    'square',
    'circle',
    'along',
    'destination',
  ];
};

/**
 * Miscellaneous toolbar: 'combine', 'explode', 'flip', 'kinks',
 *                        'line-slice-along', 'point-on-line'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the miscellaneous toolbar
 */
function misc() {
  return [
    'combine',
    'explode',
    'flip',
    'kinks',
    'line-slice-along',
    'point-on-line',
  ];
};

/**
 * Transformation toolbar: 'bezier', 'buffer', 'concave', 'convex',
 *                         'difference', 'intersect', 'simplify', 'union'
 * @memberof olturf.toolbars
 * @return {string[]} Control names for the transformation toolbar
 */
function transformation() {
  return [
    'bezier',
    'buffer',
    'concave',
    'convex',
    'difference',
    'intersect',
    'simplify',
    'union',
  ];
};

/**
 * Toolbar with all controls
 * @memberof olturf.toolbars
 * @return {string[]} Control names for all the controls
 */
function all() {
  const all = [];
  all.push(...measurement());
  all.push(...transformation());
  all.push(...misc());
  all.push(...joins());
  all.push(...classification());
  all.push(...aggregation());
  all.push(...data());
  all.push(...interpolation());
  all.push(...grids());
  return all;
};

export default {
  aggregation,
  all,
  classification,
  data,
  grids,
  interpolation,
  joins,
  measurement,
  misc,
  transformation,
};
