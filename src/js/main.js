import controls from './controls';
import Handler from './handler';
import toolbars from './toolbars';

/**
 * @namespace olturf
 */
const olturf = {
  controls,
  Handler,
  toolbars,
};

/**
 * ol main namespace
 * @external ol
 * @see {@link http://openlayers.org/en/latest/apidoc/ol.html}
 */

/**
 * ol control namespace
 * @memberof external:ol
 * @namespace control
 * @see {@link http://openlayers.org/en/latest/apidoc/ol.control.html}
 */

/**
 * ol control base class
 * @class Control
 * @memberof external:ol.control
 * @see {@link http://openlayers.org/en/latest/apidoc/ol.control.Control.html}
 */

/**
 * Function that handles processing the output of the olturf controls.
 * @callback Callback
 * @memberOf olturf
 * @param {string} name Name of control to process
 * @param {object} inputs Inputs passed to the control's corresponding turf
 *                        function
 * @param {*} output Output returned by the turf function
 */

/**
 * @description olturf custom callback handler.
 * @typedef {object} Handler
 * @memberOf olturf
 * @property {olturf.Callback} callback Function to handle processing
 *                                       turf commands.
 */

/**
 * @description olturf constructor options.
 * @typedef {object} Options
 * @memberOf olturf
 * @property {string[]} [controls={@link olturf.toolbars.all}] List of names of
 *           control to enable.
 * @property {olturf.Handler} [handler='undefined'] Optional function that
 *           handles processing the output of the olturf controls. This is
 *           useful to bypass the default handler and provide custom processing
 *           of the results. The default handler adds features to the map or
 *           displays a message with any values returned by the turf function.
 * @property {string} [prefix='olturf'] Prefix to apply to control element
 *           IDs. Only needed to make IDs unique if multiple instances of an
 *           olturf toolbar are used on the same page.
 * @property {string} [style='olturf-toolbar'] The name of the class to apply
 *           to the toolbar.
 */

/**
 * OpenLayers Turf Control
 * @constructor
 * @extends {external:ol.control.Control}
 * @param {object} [options] Control options extends ol.control.Control options
 * @param {olturf.Options} [options.olturf] olturf specific options
 * @memberof olturf
 */
const Toolbar = function(options) {
  const self = this;

  // Process options
  const opts = options || {};
  opts.olturf = opts.olturf || {};
  if (opts.olturf.controls === undefined) {
    // Default is to enable all controls and display them in this order.
    opts.olturf.controls = olturf.toolbars.all();
  }

  // Set control handler
  if (opts.olturf.handler === undefined) {
    opts.olturf.handler = new olturf.Handler(self);
  }

  // Define default style
  if (opts.olturf.style === undefined) {
    opts.olturf.style = 'olturf-toolbar';
  }

  // Define default prefix
  if (opts.olturf.prefix === undefined) {
    opts.olturf.prefix = 'olturf';
  }

  // Create turf toolbar DOM if not provided by user
  if (opts.element === undefined) {
    opts.element = document.createElement('div');
  }
  if (opts.element.className === '') {
    opts.element.className = opts.olturf.style + ' ol-unselectable ol-control';
  }

  // Add controls to toolbar
  const olturfcontrols = {};
  opts.olturf.controls.forEach(function(name) {
    if (olturf.controls[name] !== undefined) {
      // Store control in olturf member and add button to div
      const control = olturf.controls[name].create(self, opts.olturf.prefix);
      olturfcontrols[name] = control;
      opts.element.appendChild(control.element);
    }
  });

  // Object to internally store olturf specific attributes
  this.olturf = {
    controls: olturfcontrols,
    element: opts.element,
    handler: opts.olturf.handler,
  };

  ol.control.Control.call(this, opts);
};
ol.inherits(Toolbar, ol.control.Control);

export default {
  toolbars,
  Toolbar,
};
