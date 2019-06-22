

/**
 * @description Aggregation toolbar controls
 * @typedef {string[]} ToolbarAggregation
 * @memberOf ol3turf.toolbars
 * @property {string} collect collect control
 */

/**
 * Aggregation toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarAggregation} Control names for the aggregation toolbar
 */
function aggregation() {
  return ['collect'];
};

/**
 * @description Classification toolbar controls
 * @typedef {string[]} ToolbarClassification
 * @memberOf ol3turf.toolbars
 * @property {string} nearest nearest control
 */

/**
 * Classification toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarClassification} Control names for the classification toolbar
 */
function classification() {
  return ['nearest'];
};

/**
 * @description Data toolbar controls
 * @typedef {string[]} ToolbarData
 * @memberOf ol3turf.toolbars
 * @property {string} random random control
 * @property {string} sample sample control
 */

/**
 * Data toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarData} Control names for the data toolbar
 */
function data() {
  return [
    'random',
    'sample',
  ];
};

/**
 * @description Grids toolbar controls
 * @typedef {string[]} ToolbarGrids
 * @memberOf ol3turf.toolbars
 * @property {string} hex-grid hex-grid control
 * @property {string} point-grid point-grid control
 * @property {string} square-grid square-grid control
 * @property {string} tesselate tesselate control
 * @property {string} triangle-grid triangle-grid control
 */

/**
 * Grids toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarGrids} Control names for the grids toolbar
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
 * @description Interpolation toolbar controls
 * @typedef {string[]} ToolbarInterpolation
 * @memberOf ol3turf.toolbars
 * @property {string} isolines isolines control
 * @property {string} planepoint planepoint control
 * @property {string} tin tin control
 */

/**
 * Interpolation toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarInterpolation} Control names for the interpolation toolbar
 */
function interpolation() {
  return [
    'isolines',
    'planepoint',
    'tin',
  ];
};

/**
 * @description Joins toolbar controls
 * @typedef {string[]} ToolbarJoins
 * @memberOf ol3turf.toolbars
 * @property {string} inside inside control
 * @property {string} tag tag control
 * @property {string} within within control
 */

/**
 * Joins toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarJoins} Control names for the joins toolbar
 */
function joins() {
  return [
    'inside',
    'tag',
    'within',
  ];
};

/**
 * @description Measurement toolbar controls
 * @typedef {string[]} ToolbarMeasurement
 * @memberOf ol3turf.toolbars
 * @property {string} along along control
 * @property {string} area area control
 * @property {string} bearing bearing control
 * @property {string} center center control
 * @property {string} center-of-mass center-of-mass control
 * @property {string} centroid centroid control
 * @property {string} circle circle control
 * @property {string} destination destination control
 * @property {string} distance distance control
 * @property {string} envelope envelope control
 * @property {string} line-distance line-distance control
 * @property {string} midpoint midpoint control
 * @property {string} point-on-surface point-on-surface control
 * @property {string} square square control
 */

/**
 * Measurement toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarMeasurement} Control names for the measurement toolbar
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
 * @description Miscellaneous toolbar controls
 * @typedef {string[]} ToolbarMisc
 * @memberOf ol3turf.toolbars
 * @property {string} combine combine control
 * @property {string} explode explode control
 * @property {string} flip flip control
 * @property {string} kinks kinks control
 * @property {string} line-slice-along line-slice-along control
 * @property {string} point-on-line point-on-line control
 */

/**
 * Miscellaneous toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarMisc} Control names for the miscellaneous toolbar
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
 * @description Transformation toolbar controls
 * @typedef {string[]} ToolbarTransformation
 * @memberOf ol3turf.toolbars
 * @property {string} bezier bezier control
 * @property {string} buffer buffer control
 * @property {string} concave concave control
 * @property {string} convex convex control
 * @property {string} difference difference control
 * @property {string} intersect intersect control
 * @property {string} simplify simplify control
 * @property {string} union union control
 */

/**
 * Transformation toolbar
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarTransformation} Control names for the transformation toolbar
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
 * @description Concatenation of all the toolbars
 * @typedef {string[]} ToolbarAll
 * @memberOf ol3turf.toolbars
 * @property {ol3turf.toolbars.ToolbarAggregation} aggregation Aggregation toolbar
 * @property {ol3turf.toolbars.ToolbarClassification} classification Classification toolbar
 * @property {ol3turf.toolbars.ToolbarData} data Data toolbar
 * @property {ol3turf.toolbars.ToolbarGrids} grids Grids toolbar
 * @property {ol3turf.toolbars.ToolbarInterpolation} interpolation Interpolation toolbar
 * @property {ol3turf.toolbars.ToolbarJoins} joins Joins toolbar
 * @property {ol3turf.toolbars.ToolbarMeasurement} measurement Measurement toolbar
 * @property {ol3turf.toolbars.ToolbarMisc} miscellaneous Miscellaneous toolbar
 * @property {ol3turf.toolbars.ToolbarTransformation} transformation Transformation toolbar
 */

/**
 * Toolbar with all controls
 * @memberof ol3turf.toolbars
 * @return {ol3turf.toolbars.ToolbarAll} Control names for all the controls
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

