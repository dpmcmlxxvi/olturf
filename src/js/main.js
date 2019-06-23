import controls from './controls';
import Handler from './handler';
import toolbars from './toolbars';

/**
 * @namespace ol3turf
 */
const ol3turf = {
  controls,
  Handler,
  toolbars,
};

/**
 * ol3 main namespace
 * @external ol
 * @see {@link http://openlayers.org/en/latest/apidoc/ol.html}
 */

/**
 * ol3 control namespace
 * @memberof external:ol
 * @namespace control
 * @see {@link http://openlayers.org/en/latest/apidoc/ol.control.html}
 */

/**
 * ol3 control base class
 * @class Control
 * @memberof external:ol.control
 * @see {@link http://openlayers.org/en/latest/apidoc/ol.control.Control.html}
 */

/**
 * Function that handles processing the output of the ol3-turf controls.
 * @callback Callback
 * @memberOf ol3turf
 * @param {string} name Name of control to process
 * @param {object} inputs Inputs passed to the control's corresponding turf
 *                        function
 * @param {*} output Output returned by the turf function
 */

/**
 * @description ol3-turf custom callback handler.
 * @typedef {object} Handler
 * @memberOf ol3turf
 * @property {ol3turf.Callback} callback Function to handle processing
 *                                       turf commands.
 */

/**
 * @description ol3-turf constructor options.
 * @typedef {object} Options
 * @memberOf ol3turf
 * @property {string[]} [controls={@link ol3turf.toolbars.all}] Controls
 *           to enable
 * @property {ol3turf.Handler} [handler='undefined'] Optional function that
 *           handles processing the output of the ol3-turf controls. This is
 *           useful to bypass the default handler and provide custom processing
 *           of the results. The default handler adds features to the map or
 *           displays a message with any values returned by the turf function.
 * @property {string} [prefix='ol3-turf'] Prefix to apply to control element
 *           IDs. Only needed to make IDs unique if multiple instances of an
 *           ol3-turf toolbar are used on the same page.
 * @property {string} [style='ol3-turf-toolbar'] The name of the class to apply
 *           to the toolbar.
 */

/**
 * OpenLayers 3 Turf Control
 * @constructor
 * @extends {external:ol.control.Control}
 * @param {object} [options] Control options extends ol.control.Control options
 * @param {ol3turf.Options} [options.ol3turf] ol3-turf specific options
 * @memberof ol3turf
 */
const Toolbar = function(options) {
  const self = this;

  // Process options
  const opts = options || {};
  opts.ol3turf = opts.ol3turf || {};
  if (opts.ol3turf.controls === undefined) {
    // Default is to enable all controls and display them in this order.
    opts.ol3turf.controls = ol3turf.toolbars.all();
  }

  // Set control handler
  if (opts.ol3turf.handler === undefined) {
    opts.ol3turf.handler = new ol3turf.Handler(self);
  }

  // Define default style
  if (opts.ol3turf.style === undefined) {
    opts.ol3turf.style = 'ol3-turf-toolbar';
  }

  // Define default prefix
  if (opts.ol3turf.prefix === undefined) {
    opts.ol3turf.prefix = 'ol3-turf';
  }

  // Create turf toolbar DOM if not provided by user
  if (opts.element === undefined) {
    opts.element = document.createElement('div');
  }
  if (opts.element.className === '') {
    opts.element.className = opts.ol3turf.style + ' ol-unselectable ol-control';
  }

  // Add controls to toolbar
  const ol3turfcontrols = {};
  opts.ol3turf.controls.forEach(function(name) {
    if (ol3turf.controls[name] !== undefined) {
      // Store control in ol3turf member and add button to div
      const control = ol3turf.controls[name].create(self, opts.ol3turf.prefix);
      ol3turfcontrols[name] = control;
      opts.element.appendChild(control.element);
    }
  });

  // Object to internally store ol3-turf specific attributes
  this.ol3turf = {
    controls: ol3turfcontrols,
    element: opts.element,
    handler: opts.ol3turf.handler,
  };

  ol.control.Control.call(this, opts);
};
ol.inherits(Toolbar, ol.control.Control);

export default {
  toolbars,
  Toolbar,
};
