/**
 * ol3-turf v0.6.0
 * A Turf toolbar for OpenLayers.
 *
 * @author [object Object]
 * @license MIT
 * @preserve
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ol3turf = factory());
}(this, function () { 'use strict';

  /*  globals document, ol3turf */

  /*
   * Object to encapsulate all available utility methods
   */
  const ol3turf = {
    utils: {},
  };

  // ==================================================
  // utility methods
  // --------------------------------------------------
  var utils = (function(ol3turf) {

    /**
       * Extend properties from source to target objects recursively.
       * @param {object} source Source object
       * @param {object} target Target object
       * @private
       */
    ol3turf.utils.extend = function(source, target) {
      if ((source === undefined) || target === undefined) {
        return;
      }
      Object.keys(source).forEach(function(property) {
        const src = source[property];
        if ((src !== null) && (typeof src === 'object')) {
          if (target[property] === undefined) {
            target[property] = {};
          }
          ol3turf.utils.extend(src, target[property]);
          return;
        }
        target[property] = src;
      });
    };

    /**
       * Get ol3-turf class selector with given suffices
       * @param {string[]} suffices List of suffices to append to base name
       * @param {string} prefix Selector prefix
       * @private
       * @return Class selector string ".ol3-turf-..."
       */
    ol3turf.utils.getClass = function(suffices, prefix) {
      return '.' + ol3turf.utils.getName(suffices, prefix);
    };

    /**
       * Get selected features collection
       * @param {ol3turf.Control} control Control to extract feature collection
       * @param {number} min Minimum number of expected features in collection
       * @param {number} max Maximum number of expected features in collection
       * @private
       * @return {object} GeoJSON FeatureCollection
       * @throws {Error} Invalid number of features found
       */
    ol3turf.utils.getCollection = function(control, min, max) {
      const collection = control.getFeatures();
      if (collection.features.length < min) {
        throw new Error('Number of features less than ' + min);
      }
      if (collection.features.length > max) {
        throw new Error('Number of features greater than ' + max);
      }
      return collection;
    };

    /**
       * Get control input attributes
       * @param {string} id Control ID
       * @param {string} onclick Callback function
       * @param {string} title Control header title
       * @param {string} value Control value
       * @private
       * @return {object} Control input attributes
       */
    ol3turf.utils.getControlInput = function(id, onclick, title, value) {
      return {
        title: title,
        type: 'input',
        attributes: {
          name: id,
          onclick: onclick,
          type: 'submit',
          value: value,
        },
      };
    };

    /**
       * Get control input attributes
       * @param {string} id Control ID
       * @param {string} onclick Callback function
       * @param {string} title Control header title
       * @param {string} value Control value
       * @private
       * @return {object} Control input attributes
       */
    ol3turf.utils.getControlNumber = function(id, title, text, value, step, min, max) {
      return {
        title: title,
        type: 'input',
        attributes: {
          id: id,
          name: id,
          min: min,
          max: max,
          step: step,
          title: text,
          type: 'number',
          value: value,
        },
      };
    };


    /**
       * Get control select attributes
       * @param {string} id Control ID
       * @param {string} title Control header title
       * @param {string} options Control options.
       * @private
       * @return {object} Control button attributes
       */
    ol3turf.utils.getControlSelect = function(id, title, options) {
      return {
        title: title,
        type: 'select',
        attributes: {
          id: id,
          name: id,
        },
        options: options,
      };
    };

    /**
       * Get control text attributes
       * @param {string} id Control ID
       * @param {string} title Control header title
       * @param {string} text Control text
       * @private
       * @return {object} Control text attributes
       */
    ol3turf.utils.getControlText = function(id, title, text) {
      return {
        title: title,
        type: 'input',
        attributes: {
          id: id,
          name: id,
          title: text,
          type: 'text',
        },
      };
    };

    /**
       * Get element string for a given array of ol3-turf suffices
       * @param {string} name Element name string (e.g., input, select)
       * @param {string[]} suffices List of suffices to append to base name
       * @param {string} prefix Selector prefix
       * @private
       * @return Element string (e.g., "input[name=ol3-turf-...")
       */
    ol3turf.utils.getElement = function(name, suffices, prefix) {
      return name + '[name=\'' + ol3turf.utils.getName(suffices, prefix) + '\']';
    };

    /**
       * Get features in collection
       * @param {string[]} types Feature types allowed (e.g., LineString, Point)
       * @param {object} collection GeoJSON FeatureCollection
       * @param {number} min Minimum number of expected lines in collection
       * @param {number} max Maximum number of expected lines in collection
       * @private
       * @return {object[]} Features found
       * @throws {Error} Invalid number of features found
       */
    ol3turf.utils.getFeatures = function(types, collection, min, max) {
      const features = [];
      collection.features.forEach(function(feature) {
        if (types.indexOf(feature.geometry.type) > -1) {
          features.push(feature);
        }
      });
      if (features.length < min) {
        throw new Error('Number of \'' + types + '\' features less than ' + min);
      }
      if (features.length > max) {
        throw new Error('Number of \'' + types + '\' features greater than ' + max);
      }
      return features;
    };

    /**
       * Get array of numbers delimited by commas from form field
       * @param {string} id Selector ID of form field
       * @param {string} name Name of field
       * @private
       * @return {number[]} Numeric value of form field
       * @throws {Error} Field value is not numeric array
       */
    ol3turf.utils.getFormArray = function(id, name) {
      const input = ol3turf.utils.getFormString(id, name);
      const values = [];
      input.split(',').forEach(function(value) {
        const num = parseFloat(value);
        if (Number(num) !== num) {
          throw new Error('Invalid ' + name);
        }
        values.push(num);
      });
      return values;
    };

    /**
       * Get integer from form field
       * @param {string} id Selector ID of form field
       * @param {string} name Name of field
       * @private
       * @return {number} Integer value of form field
       * @throws {Error} Field value is not integer
       */
    ol3turf.utils.getFormInteger = function(id, name) {
      const value = parseInt(document.getElementById(id).value, 10);
      if (Number(value) !== value) {
        throw new Error('Invalid ' + name);
      }
      return value;
    };

    /**
       * Get number from form field
       * @param {string} id Selector ID of form field
       * @param {string} name Name of field
       * @private
       * @return {number} Numeric value of form field
       * @throws {Error} Field value is not numeric
       */
    ol3turf.utils.getFormNumber = function(id, name) {
      const value = parseFloat(document.getElementById(id).value);
      if (Number(value) !== value) {
        throw new Error('Invalid ' + name);
      }
      return value;
    };

    /**
       * Get string from form field
       * @param {string} id Selector ID of form field
       * @param {string} name Name of field
       * @private
       * @return {string} String value of form field
       * @throws {Error} Field value is not non-empty string
       */
    ol3turf.utils.getFormString = function(id, name) {
      const value = document.getElementById(id).value;
      if (!value || !value.trim()) {
        throw new Error('Invalid ' + name);
      }
      return value;
    };

    /**
       * Get ol3-turf id selector with given suffices
       * @param {string[]} suffices List of suffices to append to base name
       * @param {string} prefix Selector prefix
       * @private
       * @return Id selector string "#ol3-turf-..."
       */
    ol3turf.utils.getId = function(suffices, prefix) {
      return '#' + ol3turf.utils.getName(suffices, prefix);
    };

    /**
       * Get lines in collection
       * @param {object} collection GeoJSON FeatureCollection
       * @param {number} min Minimum number of expected lines in collection
       * @param {number} max Maximum number of expected lines in collection
       * @private
       * @return {object[]} Lines found
       * @throws {Error} Invalid number of lines found
       */
    ol3turf.utils.getLines = function(collection, min, max) {
      return ol3turf.utils.getFeatures(['LineString'], collection, min, max);
    };

    /**
       * Get ol3-turf name with given suffices appended with hyphens
       * @param {string[]} suffices List of suffices to append to base name
       * @param {string} prefix Selector prefix
       * @private
       * @return Control name string "ol3-turf-..."
       */
    ol3turf.utils.getName = function(suffices, prefix) {
      if (prefix === undefined) {
        prefix = 'ol3-turf';
      }
      let name = prefix;
      suffices.forEach(function(suffix) {
        name += '-' + suffix;
      });
      return name;
    };

    /**
       * Get turf geometry options for drop down menu
       * @private
       * @return {object[]} Geometry options
       */
    ol3turf.utils.getOptionsGeometry = function() {
      return [
        {
          text: 'Points',
          attributes: {
            selected: 'selected',
            value: 'points',
          },
        },
        {
          text: 'Polygons',
          attributes: {
            value: 'polygons',
          },
        },
      ];
    };

    /**
       * Get turf grid options for drop down menu
       * @private
       * @return {object[]} Grid options
       */
    ol3turf.utils.getOptionsGrids = function() {
      return [
        {
          text: 'Hexagons',
          attributes: {
            selected: 'selected',
            value: 'hexagons',
          },
        },
        {
          text: 'Triangles',
          attributes: {
            value: 'triangles',
          },
        },
      ];
    };

    /**
       * Get turf quality options for drop down menu
       * @private
       * @return {object[]} Quality options
       */
    ol3turf.utils.getOptionsQuality = function() {
      return [
        {
          text: 'High',
          attributes: {
            value: 'high',
          },
        },
        {
          text: 'Low',
          attributes: {
            selected: 'selected',
            value: 'low',
          },
        },
      ];
    };

    /**
       * Get turf unit options for drop down menu
       * @private
       * @return {object[]} Unit options
       */
    ol3turf.utils.getOptionsUnits = function() {
      return [
        {
          text: 'degrees',
          attributes: {
            value: 'degrees',
          },
        },
        {
          text: 'kilometers',
          attributes: {
            selected: 'selected',
            value: 'kilometers',
          },
        },
        {
          text: 'miles',
          attributes: {
            value: 'miles',
          },
        },
        {
          text: 'radians',
          attributes: {
            value: 'radians',
          },
        },
      ];
    };

    /**
       * Get points in collection
       * @param {object} collection GeoJSON FeatureCollection
       * @param {number} min Minimum number of expected points in collection
       * @param {number} max Maximum number of expected points in collection
       * @private
       * @return {object[]} Points found
       * @throws {Error} Invalid number of points found
       */
    ol3turf.utils.getPoints = function(collection, min, max) {
      return ol3turf.utils.getFeatures(['Point'], collection, min, max);
    };

    /**
       * Get polygons in collection
       * @param {object} collection GeoJSON FeatureCollection
       * @param {number} min Minimum number of expected polygons in collection
       * @param {number} max Maximum number of expected polygons in collection
       * @private
       * @return {object[]} Polygons found
       * @throws {Error} Invalid number of polygons found
       */
    ol3turf.utils.getPolygons = function(collection, min, max) {
      return ol3turf.utils.getFeatures(['Polygon'], collection, min, max);
    };

    /**
       * Get polygons and multipolygons in collection
       * @param {object} collection GeoJSON FeatureCollection
       * @param {number} min Minimum number of expected polygons in collection
       * @param {number} max Maximum number of expected polygons in collection
       * @private
       * @return {object[]} Polygons found
       * @throws {Error} Invalid number of polygons found
       */
    ol3turf.utils.getPolygonsAll = function(collection, min, max) {
      return ol3turf.utils.getFeatures(['Polygon', 'MultiPolygon'], collection, min, max);
    };

    return ol3turf.utils;
  }(ol3turf || {}));

  const ol3turf$1 = {
    utils,
  };

  /* globals document, ol3turf */

  // ==================================================
  // input form
  // --------------------------------------------------
  var form = (function(ol3turf) {

    /**
       * @description Properties of control form
       * @typedef {object} FormProperties
       * @memberOf ol3turf
       * @property {object} [properties] Form properties
       * @property {string} [properties.title] Control display title
       * @property {string} [properties.type] "input" or "select"
       * @property {object} [properties.attributes] Attributes
       * @private
       */

    /**
       * Creates a form as a table with one control per row, the control's title
       * in the first column and the control in the second column.
       * @param {string} parent Element or ID string of parent element
       * @param {string} formId ID of new form element
       * @param {ol3turf.FormProperties[]} controls Array defining form controls.
       * @param attributes Form attributes
       * @private
       */
    return function(parent, formId, controls, attributes) {
      let container = null;
      if (typeof parent === 'string') {
        container = document.getElementById(parent);
      } else {
        container = parent;
      }
      if (container === null) {
        throw new Error('ol3turf.form: Parent element not found.');
      }
      if (formId === undefined) {
        throw new Error('ol3turf.form: Form ID not provided.');
      }
      if (controls === undefined) {
        throw new Error('ol3turf.form: Form controls not provided.');
      }

      // Create a form to add to parent
      const form = document.createElement('form');
      form.id = formId;
      form.className = 'ol3-turf-form ol-unselectable ol-control';
      form.setAttribute('onsubmit', 'return false;');
      ol3turf.utils.extend(attributes, form);

      // Create a table to add to form
      const table = document.createElement('table');
      table.className = 'ol3-turf-form-table';

      // Each form control is a table row with a title in the
      // header column and the control in the data column.
      controls.forEach(function(element) {
        const row = document.createElement('tr');
        row.className = 'ol3-turf-form-row';

        const th = document.createElement('th');
        th.innerHTML = element.title;
        th.className = 'ol3-turf-form-header';
        row.appendChild(th);

        const td = document.createElement('td');
        td.className = 'ol3-turf-form-data';

        // Create control
        const control = document.createElement(element.type);
        control.className = 'ol3-turf-form-input';
        ol3turf.utils.extend(element.attributes, control);

        // Check if this is a selection and add pulldown options
        if (element.type === 'select') {
          control.className = 'ol3-turf-form-select';
          if (element.options !== undefined) {
            element.options.forEach(function(opt) {
              const option = document.createElement('option');
              option.innerHTML = opt.text;
              option.className = 'ol3-turf-form-option';
              ol3turf.utils.extend(opt.attributes, option);
              control.appendChild(option);
            });
          }
        }

        // Add control to table
        td.appendChild(control);
        row.appendChild(td);
        table.appendChild(row);
      });

      // Add table to form and form to container
      form.appendChild(table);
      container.appendChild(form);
      return form;
    };
  }(ol3turf$1 || {}));

  /* globals document, ol3turf */

  const ol3turf$2 = {
    utils,
  };

  // ==================================================
  // popup form
  // --------------------------------------------------
  var popup = (function(ol3turf) {

    /**
       * Displays a message in a popup window.
       * @param {string} message Message to display
       * @param {function} callback Callback function when user closes popup.
       * @param {object} parent Popup parent element
       * @param {object} attributes Popup div attributes
       * @return Popup DOM element
       * @private
       */
    return function display(message, callback, parent, attributes) {
      // Popup id
      const id = 'ol3-turf-popup';

      // Remove existing popup
      const currentPopup = document.getElementById(id);
      let currentParent = null;
      if (currentPopup !== null) {
        currentParent = currentPopup.parentNode;
        if (currentParent !== null) {
          currentParent.removeChild(currentPopup);
        }
      }

      // If no message then we are just closing the popup
      if (message === undefined || message === null) {
        return;
      }

      // onclose callback wrapper
      function onClick() {
        if (callback !== undefined && callback !== null) {
          callback();
        }
        display();
      }

      // If no parent then add to body
      let container = document.body;
      if (parent !== undefined && parent !== null) {
        container = parent;
      }

      // Create a div to contain popup
      const popup = document.createElement('div');
      popup.className = id;
      popup.id = id;
      ol3turf.utils.extend(attributes, popup);

      // Create a div to contain message
      const divMessage = document.createElement('div');
      divMessage.className = 'ol3-turf-popup-message';
      divMessage.innerHTML = message;

      // Create a button
      const button = document.createElement('button');
      button.className = 'ol3-turf-popup-button';
      button.innerHTML = 'OK';
      button.onclick = onClick;
      button.type = 'button';

      const divButton = document.createElement('div');
      divButton.className = 'ol3-turf-popup-button-container';
      divButton.appendChild(button);

      // Create popup
      popup.appendChild(divMessage);
      popup.appendChild(divButton);
      container.appendChild(popup);

      return popup;
    };
  }(ol3turf$2 || {}));

  const ol3turf$3 = {
    Control,
    form,
    popup,
    utils,
  };

  /* globals document, ol, ol3turf, turf, window */

  // ==================================================
  // toolbar control
  // --------------------------------------------------
  var Control = (function(ol3turf) {

    /**
       * Fit left position of form within map
       * @param {object} Form's absolute form position and size
       * @param {object} Map's absolute form position and size
       * @param {object} Button's absolute form position and size
       * @private
       */
    function fitFormLeft(sizeForm, sizeMap, sizeButton) {
      // Check if form is out-of-viewport to the right
      // Adjust by moving left if space is available
      const distanceToRight = sizeMap.right - (sizeForm.left + sizeForm.width);
      const distanceToLeft = sizeForm.left + distanceToRight;
      if ((distanceToRight < 0) && (distanceToLeft > 0)) {
        sizeForm.left += distanceToRight - (sizeButton.width / 2);
      }
    }

    /**
       * Fit top position of form within map
       * @param {object} Form's absolute form position and size
       * @param {object} Map's absolute form position and size
       * @param {object} Button's absolute form position and size
       * @private
       */
    function fitFormTop(sizeForm, sizeMap, sizeButton) {
      // Check if form is out-of-viewport to the bottom
      // Adjust by moving up if space is available
      const distanceToBottom = sizeMap.bottom - (sizeForm.top + sizeForm.height);
      const distanceToTop = sizeForm.top + distanceToBottom;
      if ((distanceToBottom < 0) && (distanceToTop > 0)) {
        sizeForm.top += distanceToBottom - (sizeButton.height / 2);
      }
    }

    /**
       * Get absolute position and size object of element
       * @param {object} element Element of form to position
       * @return {object} Form's absolute form position and size
       * @private
       */
    function getAbsoluteRect(element) {
      const rect = element.getBoundingClientRect();

      // Compute absolute position of element
      let left = 0;
      let top = 0;
      do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);

      // Compute absolute size object
      const size = {
        bottom: top + rect.height,
        height: rect.height,
        left: left,
        right: left + rect.width,
        top: top,
        width: rect.width,
      };

      return size;
    }

    /**
       * Get absolute left position of form
       * @param {object} Form's absolute form position and size
       * @param {object} Map's absolute form position and size
       * @param {object} Toolbar's absolute form position and size
       * @param {object} Button's absolute form position and size
       * @return {number} Form's new left position
       * @private
       */
    function getFormLeft(sizeForm, sizeMap, sizeToolbar, sizeButton) {
      // Delta is amount to displace horizontally
      let delta = 0;

      // Toolbar is vertical so start by setting form at toolbar right
      let left = sizeToolbar.left + sizeToolbar.width;
      if ((sizeButton.left - sizeMap.left) > (0.5 * sizeMap.width)) {
        // Toolbar is near the right so move form left of the toolbar
        delta = -sizeToolbar.width +
                      -sizeForm.width +
                      -sizeButton.width / 2;
      } else {
        // Toolbar is near the left so move it right a bit
        delta = sizeButton.width / 2;
      }
      left += delta;

      return left;
    }

    /**
       * Get absolute top position of form
       * @param {object} Form's absolute form position and size
       * @param {object} Map's absolute form position and size
       * @param {object} Toolbar's absolute form position and size
       * @param {object} Button's absolute form position and size
       * @return {number} Form's new top position
       * @private
       */
    function getFormTop(sizeForm, sizeMap, sizeToolbar, sizeButton) {
      // Delta is amount to displace vertically
      let delta = 0;

      // Start by setting form at toolbar bottom
      let top = sizeToolbar.bottom;
      if ((sizeButton.top - sizeMap.top) > (0.5 * sizeMap.height)) {
        // Toolbar is near the bottom so move form above the toolbar
        delta = -sizeToolbar.height +
                      -sizeForm.height +
                      -sizeButton.height / 2;
      } else {
        // Toolbar is near the top so move it down a bit
        delta = sizeButton.height / 2;
      }
      top += delta;

      return top;
    }

    /**
       * Set absolute position of form
       * @param {object} Form's absolute form position and size
       * @param {object} Map's absolute form position and size
       * @param {object} Toolbar's absolute form position and size
       * @param {object} Button's absolute form position and size
       * @private
       */
    function setFormPosition(sizeForm, sizeMap, sizeToolbar, sizeButton) {
      if (sizeToolbar.width > sizeToolbar.height) {
        sizeForm.top = getFormTop(sizeForm, sizeMap, sizeToolbar, sizeButton);
      } else {
        sizeForm.left = getFormLeft(sizeForm, sizeMap, sizeToolbar, sizeButton);
      }
    }

    /**
       * Toolbar control base class
       * @constructor
       * @param {object} options Control button properties
       * @private
       */
    const Control = function(options) {
      const opt_options = options || {};

      // Define control button
      const self = this;
      this.button = document.createElement('button');
      this.button.addEventListener('click', this.run.bind(this), false);
      this.button.addEventListener('touchstart', this.run.bind(this), false);
      Object.keys(opt_options).forEach(function(key) {
        self.button[key] = opt_options[key];
      });
      this.element = document.createElement('div');
      this.element.className = 'ol3-turf-control';
      this.element.appendChild(this.button);

      // Initialize ol.control.Turf which needs to be set during creation
      this.toolbar = null;

      // Initialize form which needs to be set during creation
      this.form = null;

      // Initialize form which needs to be set during creation
      this.prefix = 'ol3-turf';
    };

    /**
       * Action performed by control.
       * @private
       * @warning This method should be implemented by derived controls.
       */
    Control.prototype.action = function() {
      throw new Error('Control action not implemented!');
    };

    /**
       * Add turf features to map
       * @param {object} features GeoJSON features to add.
       * @private
       */
    Control.prototype.addFeatures = function(features) {
      const projectionMap = this.getProjectionMap();
      const projectionTurf = this.getProjectionTurf();

      const format = new ol.format.GeoJSON();
      const layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: format.readFeatures(features, {
            dataProjection: projectionTurf,
            featureProjection: projectionMap,
          }),
        }),
      });
      this.getMap().addLayer(layer);
    };

    /**
       * Get all features selected
       * @return {object} GeoJSON FeatureCollection
       * @private
       */
    Control.prototype.getFeatures = function() {
      const projectionMap = this.getProjectionMap();
      const projectionTurf = this.getProjectionTurf();

      const format = new ol.format.GeoJSON();

      const collection = [];
      const selectors = this.getSelectors();
      selectors.forEach(function(selector) {
        const features = selector.getFeatures();
        features.forEach(function(feature) {
          collection.push(format.writeFeatureObject(feature, {
            dataProjection: projectionTurf,
            featureProjection: projectionMap,
          }));
        });
      });
      return turf.featureCollection(collection);
    };

    /**
       * @description ol3-turf custom callback handler.
       * @typedef {object} ControlPosition
       * @memberOf ol3turf
       * @property {object} [position] Form position relative to parent map
       * @property {object} [position.top] Top position of form
       * @property {object} [position.left] Left position of form
       * @private
       */

    /**
       * Get control's form position
       * @param {object} form Element of form to position
       * @return {ol3turf.ControlPosition} Current form's form position.
       * @private
       */
    Control.prototype.getFormPosition = function(form) {
      // Get absolute position and size of elements
      const sizeButton = getAbsoluteRect(this.button);
      const sizeForm = getAbsoluteRect(form);
      const sizeMap = getAbsoluteRect(this.getMap().getTargetElement());
      const sizeToolbar = getAbsoluteRect(this.toolbar.ol3turf.element);

      // Initialize form to be at the parent button's position
      sizeForm.top = sizeButton.top;
      sizeForm.left = sizeButton.left;

      // Position the form based on whether it is horizontal or vertical
      setFormPosition(sizeForm, sizeMap, sizeToolbar, sizeButton);

      // Fit form in map viewport horizontally
      fitFormLeft(sizeForm, sizeMap, sizeButton);

      // Fit form in map viewport vertically
      fitFormTop(sizeForm, sizeMap, sizeButton);

      // Set form coordinates relative to map
      sizeForm.top -= sizeMap.top;
      sizeForm.left -= sizeMap.left;

      return {
        top: sizeForm.top,
        left: sizeForm.left,
      };
    };

    /**
       * Get parent map
       * @return {ol.Map|null} Current ol3 map
       * @private
       */
    Control.prototype.getMap = function() {
      if (this.toolbar === null) {
        return null;
      }
      const map = this.toolbar.getMap();
      return map;
    };

    /**
       * Get the projection of the ol.Map
       * @return {string} Projection code string
       * @private
       */
    Control.prototype.getProjectionMap = function() {
      let projectionMap = 'EPSG:3857';
      const projection = this.getMap().getView().getProjection();
      if (projection !== undefined) {
        projectionMap = projection.getCode();
      }
      return projectionMap;
    };

    /**
       * Get the projection of turf.js
       * @return {string} Projection code string
       * @private
       */
    Control.prototype.getProjectionTurf = function() {
      return 'EPSG:4326';
    };

    /**
       * Get all selection interactions of current map
       * @return {ol.interaction.Interaction[]} Array of map interactions
       * @private
       */
    Control.prototype.getSelectors = function() {
      const selectors = [];

      const map = this.getMap();
      if (map === null) {
        return selectors;
      }

      map.getInteractions().forEach(function(interaction) {
        if (interaction instanceof ol.interaction.Select) {
          selectors.push(interaction);
        }
      });
      return selectors;
    };

    /**
       * Run computation
       * @private
       */
    Control.prototype.run = function() {
      try {
        this.action();
      } catch (e) {
        this.showMessage(e.message);
      }
    };

    /**
       * Show form with given controls.
       * @param {object} controls Controls to display in form
       * @param {string} id Form ID
       * @private
       */
    Control.prototype.showForm = function(controls, id) {
      // Remove any existing form
      const oldiv = this.toolbar.element.parentNode;
      if (this.form !== null) {
        oldiv.removeChild(this.form);
        this.form = null;
      }

      // If no controls then we are just removing the form so return.
      if (controls === undefined) {
        return;
      }

      // Render the form but initially hide the it, then compute its size to
      // determine its position relative to toolbar
      const attributes = {
        style: {
          visibility: 'hidden',
        },
      };

      // Create new form
      if (id === undefined) {
        id = 'ol3-turf-form';
      }
      this.form = ol3turf.form(oldiv, id, controls, attributes);

      // Update form position and display
      const position = this.getFormPosition(this.form);
      this.form.style.left = position.left + 'px';
      this.form.style.top = position.top + 'px';
      this.form.style.visibility = 'visible';
    };

    /**
       * Show message.
       * @param {string} message Text message to display
       * @private
       */
    Control.prototype.showMessage = function(message) {
      // Create popup message and hide
      const callback = null;
      const parent = this.toolbar.ol3turf.element.parentNode;
      const attributes = {
        style: {
          visibility: 'hidden',
        },
      };
      const popup = ol3turf.popup(message, callback, parent, attributes);

      // Get placement and display
      const position = this.getFormPosition(popup);
      popup.style.left = position.left + 'px';
      popup.style.top = position.top + 'px';
      popup.style.visibility = 'visible';
    };

    /**
       * Create control then attach custom action and it's parent toolbar
       * @param {object} toolbar Parent toolbar
       * @param {string} prefix Selector prefix.
       * @param {string} name Name of control to create.
       * @param {string} title Tooltip text to display on control hover.
       * @param {function} action Event handler to call when control is clicked.
       *                   Will take newly created control as argument.
       * @private
       */
    Control.create = function(toolbar, prefix, name, title, action) {
      // Create control options
      const clsControl = ol3turf.utils.getName([name]);
      const clsButton = ol3turf.utils.getName(['control', 'button']);
      const idControl = ol3turf.utils.getName([name], prefix);
      const options = {
        className: clsControl + ' ' + clsButton,
        id: idControl,
        title: title,
      };

      // Create control
      const control = new Control(options);
      control.prefix = prefix;
      control.toolbar = toolbar;
      control.action = function() {
        return action(control);
      };
      return control;
    };

    /**
       * Base control class constructor
       * @private
       */
    return Control;
  }(ol3turf$3 || {}));

  const ol3turf$4 = {
    Control,
    utils,
  };

  // ==================================================
  // along control
  // --------------------------------------------------
  var along = (function(ol3turf) {

    // Control name
    const name = 'along';

    /**
       * Find point along line at given distance
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idDistance = ol3turf.utils.getName([name, 'distance'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather line seleted
          const collection = ol3turf.utils.getCollection(control, 1, 1);
          const lines = ol3turf.utils.getLines(collection, 1, 1);
          const line = lines[0];

          // Gather form inputs
          const distance = ol3turf.utils.getFormNumber(idDistance, 'distance');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const output = turf.along(line, distance, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            line: line,
            distance: distance,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idDistance, 'Distance', 'Distance along the line', '0', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Find point along line at given distance';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$4 || {}));

  const ol3turf$5 = {
    Control,
    utils,
  };

  // ==================================================
  // area control
  // --------------------------------------------------
  var area = (function(ol3turf) {

    // Control name
    const name = 'area';

    /**
       * Compute area
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      const output = turf.area(collection);
      const inputs = {
        input: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Area';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$5 || {}));

  const ol3turf$6 = {
    Control,
    utils,
  };

  // ==================================================
  // bearing control
  // --------------------------------------------------
  var bearing = (function(ol3turf) {

    // Control name
    const name = 'bearing';

    /**
       * Compute bearing between two points
       * @private
       */
    const action = function(control) {
      // Gather points seleted
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const points = ol3turf.utils.getPoints(collection, 2, 2);
      const start = points[0];
      const end = points[1];
      const output = turf.bearing(start, end);
      const inputs = {
        start: start,
        end: end,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Bearing';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$6 || {}));

  const ol3turf$7 = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // bezier control
  // --------------------------------------------------
  var bezier = (function(ol3turf) {

    // Control name
    const name = 'bezier';

    /**
       * Create bezier curve of line
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idResolution = ol3turf.utils.getName([name, 'resolution'], control.prefix);
      const idSharpness = ol3turf.utils.getName([name, 'sharpness'], control.prefix);

      function onOK() {
        try {
          // Gather line seleted
          const collection = ol3turf.utils.getCollection(control, 1, 1);
          const lines = ol3turf.utils.getLines(collection, 1, 1);
          const line = lines[0];

          // Gather form inputs
          const resolution = ol3turf.utils.getFormNumber(idResolution, 'resolution');
          const sharpness = ol3turf.utils.getFormNumber(idSharpness, 'sharpness');

          // Create bezier curve
          const output = turf.bezier(line, resolution, sharpness);

          // Remove form and display results
          control.showForm();
          const inputs = {
            line: line,
            resolution: resolution,
            sharpness: sharpness,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idResolution, 'Resolution', 'Time between points (milliseconds)', '10000', 'any', '0'),
        ol3turf.utils.getControlNumber(idSharpness, 'Sharpness', 'Measure of how curvy the path should be between splines', '0.85', '0.01', '0', '1'),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create bezier curve of line';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$7 || {}));

  const ol3turf$8 = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // buffer control
  // --------------------------------------------------
  var buffer = (function(ol3turf) {

    // Control name
    const name = 'buffer';

    /**
       * Buffer feature by given radius
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idDistance = ol3turf.utils.getName([name, 'distance'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Gather form inputs
          const distance = ol3turf.utils.getFormNumber(idDistance, 'distance');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const output = turf.buffer(collection, distance, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            feature: collection,
            distance: distance,
            unit: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idDistance, 'Distance', 'Distance to draw the buffer', '0', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Buffer feature by given radius';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$8 || {}));

  const ol3turf$9 = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // center control
  // --------------------------------------------------
  var center = (function(ol3turf) {

    // Control name
    const name = 'center';

    /**
       * Compute center
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);
      const output = turf.center(collection);
      const inputs = {
        features: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Center';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$9 || {}));

  const ol3turf$a = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // center-of-mass control
  // --------------------------------------------------
  var centerOfMass = (function(ol3turf) {

    // Control name
    const name = 'center-of-mass';

    /**
       * Compute center-of-mass
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);
      const output = turf.centerOfMass(collection);
      const inputs = {
        features: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure center of mass';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$a || {}));

  const ol3turf$b = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // centroid control
  // --------------------------------------------------
  var centroid = (function(ol3turf) {

    // Control name
    const name = 'centroid';

    /**
       * Compute centroid
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);
      const output = turf.centroid(collection);
      const inputs = {
        features: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Centroid';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$b || {}));

  const ol3turf$c = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // circle control
  // --------------------------------------------------
  var circle = (function(ol3turf) {

    // Control name
    const name = 'circle';

    /**
       * Create circle
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idRadius = ol3turf.utils.getName([name, 'radius'], control.prefix);
      const idSteps = ol3turf.utils.getName([name, 'steps'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather center point
          const collection = ol3turf.utils.getCollection(control, 1, 1);
          const points = ol3turf.utils.getPoints(collection, 1, 1);
          const center = points[0];

          // Gather form inputs
          const radius = ol3turf.utils.getFormNumber(idRadius, 'radius');
          const steps = ol3turf.utils.getFormNumber(idSteps, 'steps');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const output = turf.circle(center, radius, steps, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            center: center,
            radius: radius,
            steps: steps,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idRadius, 'Radius', 'Radius of the circle', '0', 'any', '0'),
        ol3turf.utils.getControlNumber(idSteps, 'Steps', 'Number of steps around circle', '3', '1', '3'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create circle';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$c || {}));

  const ol3turf$d = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // collect control
  // --------------------------------------------------
  var collect = (function(ol3turf) {

    // Control name
    const name = 'collect';

    /**
       * Collect point attributes within polygon
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idIn = ol3turf.utils.getName([name, 'in', 'property'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idOut = ol3turf.utils.getName([name, 'out', 'property'], control.prefix);

      function onOK() {
        try {
          // Gather selected points and polygons
          const collection = ol3turf.utils.getCollection(control, 2, Infinity);
          const points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
          const numPolygons = collection.features.length - points.length;
          const polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

          // Gather form inputs
          const inProperty = ol3turf.utils.getFormString(idIn, 'In-Property');
          const outProperty = ol3turf.utils.getFormString(idOut, 'Out-Property');

          // Collect polygons
          const inPolygons = turf.featureCollection(polygons);
          const inPoints = turf.featureCollection(points);
          const output = turf.collect(inPolygons,
              inPoints,
              inProperty,
              outProperty);

          // Remove form and display results
          control.showForm();
          const inputs = {
            polygons: inPolygons,
            points: inPoints,
            inProperty: inProperty,
            outProperty: outProperty,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlText(idIn, 'In Property', 'Property to be nested from'),
        ol3turf.utils.getControlText(idOut, 'Out Property', 'Property to be nested into'),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Collect points within polygons';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$d || {}));

  const ol3turf$e = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // combine control
  // --------------------------------------------------
  var combine = (function(ol3turf) {

    // Control name
    const name = 'combine';

    /**
       * Compute combine of feature collection
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      const output = turf.combine(collection);
      const inputs = {
        fc: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Combine feature collection';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$e || {}));

  const ol3turf$f = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // concave control
  // --------------------------------------------------
  var concave = (function(ol3turf) {

    // Control name
    const name = 'concave';

    /**
       * Buffer feature by given radius
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idMaxEdge = ol3turf.utils.getName([name, 'max', 'edge'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 3, Infinity);
          const numPoints = collection.features.length;
          const pts = ol3turf.utils.getPoints(collection, numPoints, numPoints);

          // Gather form inputs
          const maxEdge = ol3turf.utils.getFormNumber(idMaxEdge, 'Max Edge');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const points = turf.featureCollection(pts);
          const output = turf.concave(points, maxEdge, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            points: points,
            maxEdge: maxEdge,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idMaxEdge, 'Max Edge Size', 'Maximum size of an edge necessary for part of the hull to become concave', '0', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create Concave Hull';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$f || {}));

  const ol3turf$g = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // convex control
  // --------------------------------------------------
  var convex = (function(ol3turf) {

    // Control name
    const name = 'convex';

    /**
       * Compute convex hull
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      const output = turf.convex(collection);
      const inputs = {
        featurecollection: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create Convex Hull';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$g || {}));

  const ol3turf$h = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // destination control
  // --------------------------------------------------
  var destination = (function(ol3turf) {

    // Control name
    const name = 'destination';

    /**
       * Find destination point from given point
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idBearing = ol3turf.utils.getName([name, 'bearing'], control.prefix);
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idDistance = ol3turf.utils.getName([name, 'distance'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather point seleted
          const collection = ol3turf.utils.getCollection(control, 1, 1);
          const points = ol3turf.utils.getPoints(collection, 1, 1);
          const point = points[0];

          // Gather form inputs
          const distance = ol3turf.utils.getFormNumber(idDistance, 'distance');
          const bearing = ol3turf.utils.getFormNumber(idBearing, 'bearing');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const output = turf.destination(point,
              distance,
              bearing,
              units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            from: point,
            distance: distance,
            bearing: bearing,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idBearing, 'Bearing', 'Bearing angle (degrees)', '0', 'any', '-180', '180'),
        ol3turf.utils.getControlNumber(idDistance, 'Distance', 'Distance from the starting point', '0', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Find destination point from given point';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$h || {}));

  const ol3turf$i = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // difference control
  // --------------------------------------------------
  var difference = (function(ol3turf) {

    // Control name
    const name = 'difference';

    /**
       * Compute difference between two polygons
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const polygons = ol3turf.utils.getPolygons(collection, 2, 2);
      const poly1 = polygons[0];
      const poly2 = polygons[1];
      const output = turf.difference(poly1, poly2);
      const inputs = {
        poly1: poly1,
        poly2: poly2,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create Difference Polygon';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$i || {}));

  const ol3turf$j = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // distance control
  // --------------------------------------------------
  var distance = (function(ol3turf) {

    // Control name
    const name = 'distance';

    /**
       * Find distance between points
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather points seleted
          const collection = ol3turf.utils.getCollection(control, 2, 2);
          const points = ol3turf.utils.getPoints(collection, 2, 2);
          const from = points[0];
          const to = points[1];

          // Gather form inputs
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const output = turf.distance(from, to, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            from: from,
            to: to,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Find distance between points';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$j || {}));

  const ol3turf$k = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // envelope control
  // --------------------------------------------------
  var envelope = (function(ol3turf) {

    // Control name
    const name = 'envelope';

    /**
       * Compute envelope
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      const output = turf.envelope(collection);
      const inputs = {
        fc: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Envelope';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$k || {}));

  const ol3turf$l = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // explode control
  // --------------------------------------------------
  var explode = (function(ol3turf) {

    // Control name
    const name = 'explode';

    /**
       * Compute explode of feature collection
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      const output = turf.explode(collection);
      const inputs = {
        geojson: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Explode feature collection';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$l || {}));

  const ol3turf$m = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // flip control
  // --------------------------------------------------
  var flip = (function(ol3turf) {

    // Control name
    const name = 'flip';

    /**
       * Compute feature coordinate flip
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      const output = turf.flip(collection);
      const inputs = {
        input: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Flip features coordinates';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$m || {}));

  const ol3turf$n = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // hexGrid control
  // --------------------------------------------------
  var hexGrid = (function(ol3turf) {

    // Control name
    const name = 'hex-grid';

    /**
       * Generate Hex Grid
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idCellSize = ol3turf.utils.getName([name, 'cell-size'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idType = ol3turf.utils.getName([name, 'type'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Gather form inputs
          const cellSize = ol3turf.utils.getFormNumber(idCellSize, 'cell size');
          const type = ol3turf.utils.getFormString(idType, 'grid type');
          const units = ol3turf.utils.getFormString(idUnits, 'units');
          const isTriangles = (type === 'triangles');

          // Collect polygons
          const bbox = turf.bbox(collection);
          const output = turf.hexGrid(bbox, cellSize, units, isTriangles);

          // Remove form and display results
          control.showForm();
          const inputs = {
            bbox: bbox,
            cellSize: cellSize,
            units: units,
            triangles: isTriangles,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlSelect(idType, 'Type', ol3turf.utils.getOptionsGrids()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Generate Hex Grid';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$n || {}));

  const ol3turf$o = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // inside control
  // --------------------------------------------------
  var inside = (function(ol3turf) {

    // Control name
    const name = 'inside';

    /**
       * Compute if point is inside polygon
       * @private
       */
    const action = function(control) {
      // Gather point and polygon selected
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const points = ol3turf.utils.getPoints(collection, 1, 1);
      const polygons = ol3turf.utils.getPolygonsAll(collection, 1, 1);
      const point = points[0];
      const polygon = polygons[0];

      const output = turf.inside(point, polygon);
      const inputs = {
        point: point,
        polygon: polygon,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Point inside polygon?';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$o || {}));

  const ol3turf$p = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // intersect control
  // --------------------------------------------------
  var intersect = (function(ol3turf) {

    // Control name
    const name = 'intersect';

    /**
       * Compute intersection of two polygons
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const polygons = ol3turf.utils.getPolygonsAll(collection, 2, 2);

      const poly1 = polygons[0];
      const poly2 = polygons[1];
      const output = turf.intersect(poly1, poly2);
      const inputs = {
        poly1: poly1,
        poly2: poly2,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create Intersection Polygon';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$p || {}));

  const ol3turf$q = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // isolines control
  // --------------------------------------------------
  var isolines = (function(ol3turf) {

    // Control name
    const name = 'isolines';

    /**
       * Create isolines
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idBreaks = ol3turf.utils.getName([name, 'breaks'], control.prefix);
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idResolution = ol3turf.utils.getName([name, 'resolution'], control.prefix);
      const idZ = ol3turf.utils.getName([name, 'z'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Gather form inputs
          const breaks = ol3turf.utils.getFormArray(idBreaks, 'breaks');
          const resolution = ol3turf.utils.getFormNumber(idResolution, 'resolution');
          const z = ol3turf.utils.getFormString(idZ, 'z');

          // Generate isolines features
          const output = turf.isolines(collection, z, resolution, breaks);

          // Remove form and display results
          control.showForm();
          const inputs = {
            points: collection,
            z: z,
            resolution: resolution,
            breaks: breaks,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idResolution, 'Resolution', 'Resolution of the underlying grid', '1', 'any', '0.01'),
        ol3turf.utils.getControlText(idZ, 'Z Property', 'Property name in points from which z-values will be pulled'),
        ol3turf.utils.getControlText(idBreaks, 'Breaks', 'Comma separated list of where to draw contours'),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create isolines';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$q || {}));

  const ol3turf$r = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // kinks control
  // --------------------------------------------------
  var kinks = (function(ol3turf) {

    // Control name
    const name = 'kinks';

    /**
       * Compute polygon kinks
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, 1);
      const polygons = ol3turf.utils.getPolygons(collection, 1, 1);
      const polygon = polygons[0];
      const output = turf.kinks(polygon);
      if (output.features.length === 0) {
        throw new Error('No kinks found.');
      }
      const inputs = {
        polygon: polygon,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create polygon self-intersections';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$r || {}));

  const ol3turf$s = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // lineDistance control
  // --------------------------------------------------
  var lineDistance = (function(ol3turf) {

    // Control name
    const name = 'line-distance';

    /**
       * Compute length of feature
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Gather form inputs
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Compute length
          const output = turf.lineDistance(collection, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            line: collection,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Length';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$s || {}));

  const ol3turf$t = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // lineSlice control
  // --------------------------------------------------
  var lineSliceAlong = (function(ol3turf) {

    // Control name
    const name = 'line-slice-along';

    /**
       * Compute line slice
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idStart = ol3turf.utils.getName([name, 'start'], control.prefix);
      const idStop = ol3turf.utils.getName([name, 'stop'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather line seleted
          const collection = ol3turf.utils.getCollection(control, 1, 1);
          const lines = ol3turf.utils.getLines(collection, 1, 1);
          const line = lines[0];

          // Gather form inputs
          const start = ol3turf.utils.getFormNumber(idStart, 'start');
          const stop = ol3turf.utils.getFormNumber(idStop, 'stop');

          const isOrdered = (start < stop);
          if (isOrdered !== true) {
            throw new Error('Start must be less than stop');
          }

          // Truncate at line length otherwise lineSliceAlong fails
          const units = ol3turf.utils.getFormString(idUnits, 'units');
          const length = turf.lineDistance(line, units);
          if (start > length) {
            throw new Error('Start must be less than line length');
          }
          if (stop > length) {
            throw new Error('Stop must be less than line length');
          }

          // Collect polygons
          const output = turf.lineSliceAlong(line, start, stop, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            line: line,
            start: start,
            stop: stop,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idStart, 'Start', 'Starting distance along the line', '0', 'any', '0'),
        ol3turf.utils.getControlNumber(idStop, 'Stop', 'Stoping distance along the line', '0', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create line slice';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$t || {}));

  const ol3turf$u = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // midpoint control
  // --------------------------------------------------
  var midpoint = (function(ol3turf) {

    // Control name
    const name = 'midpoint';

    /**
       * Compute midpoint
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const points = ol3turf.utils.getPoints(collection, 2, 2);
      const from = points[0];
      const to = points[1];
      const output = turf.midpoint(from, to);
      const inputs = {
        from: from,
        to: to,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Midpoint';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$u || {}));

  const ol3turf$v = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // nearest control
  // --------------------------------------------------
  var nearest = (function(ol3turf) {

    // Control name
    const name = 'nearest';

    /**
       * Compute nearest point
       * @private
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

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Find set point nearest to first point';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$v || {}));

  const ol3turf$w = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // planepoint control
  // --------------------------------------------------
  var planepoint = (function(ol3turf) {

    // Control name
    const name = 'planepoint';

    /**
       * Triangulate a point in a plane
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const pt = ol3turf.utils.getPoints(collection, 1, 1);
      const tr = ol3turf.utils.getPolygons(collection, 1, 1);
      const point = pt[0];
      const triangle = tr[0];

      const output = turf.planepoint(point, triangle);
      const inputs = {
        point: point,
        triangle: triangle,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Triangulate a point in a plane';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$w || {}));

  const ol3turf$x = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // pointGrid control
  // --------------------------------------------------
  var pointGrid = (function(ol3turf) {

    // Control name
    const name = 'point-grid';

    /**
       * Generate Point Grid
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idCellSize = ol3turf.utils.getName([name, 'cell-size'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Gather form inputs
          const cellSize = ol3turf.utils.getFormNumber(idCellSize, 'cell size');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const bbox = turf.bbox(collection);
          const output = turf.pointGrid(bbox, cellSize, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            bbox: bbox,
            cellSize: cellSize,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Generate Point Grid';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$x || {}));

  const ol3turf$y = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // pointOnLine control
  // --------------------------------------------------
  var pointOnLine = (function(ol3turf) {

    // Control name
    const name = 'point-on-line';

    /**
       * Compute point on line
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const points = ol3turf.utils.getPoints(collection, 1, 1);
      const lines = ol3turf.utils.getLines(collection, 1, 1);
      const line = lines[0];
      const point = points[0];

      const output = turf.pointOnLine(line, point);
      const inputs = {
        line: line,
        point: point,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Project point on line';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$y || {}));

  const ol3turf$z = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // pointOnSurface control
  // --------------------------------------------------
  var pointOnSurface = (function(ol3turf) {

    // Control name
    const name = 'point-on-surface';

    /**
       * Compute pointOnSurface
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      const output = turf.pointOnSurface(collection);
      const inputs = {
        fc: collection,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Measure Point on Surface';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$z || {}));

  const ol3turf$A = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // random control
  // --------------------------------------------------
  var random = (function(ol3turf) {

    // Control name
    const name = 'random';

    /**
       * Create random data
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idCount = ol3turf.utils.getName([name, 'count'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idMaxRadialLength = ol3turf.utils.getName([name, 'max-radial-length'], control.prefix);
      const idNumVertices = ol3turf.utils.getName([name, 'num-vertices'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idType = ol3turf.utils.getName([name, 'type'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          let bbox = null;
          const collection = ol3turf.utils.getCollection(control, 0, Infinity);
          if (collection.features.length !== 0) {
            bbox = turf.bbox(collection);
          }

          // Get form inputs
          const count = ol3turf.utils.getFormInteger(idCount, 'count');
          const maxRadialLength = ol3turf.utils.getFormInteger(idMaxRadialLength, 'maximum radial length');
          const numVertices = ol3turf.utils.getFormInteger(idNumVertices, 'number of vertices');
          const type = ol3turf.utils.getFormString(idType, 'type');

          // Generate random polygons
          const options = {
            max_radial_length: maxRadialLength,
            num_vertices: numVertices,
          };
          if (bbox !== null) {
            options.bbox = bbox;
          }
          const output = turf.random(type, count, options);

          // Remove form and display results
          control.showForm();
          const inputs = {
            type: type,
            count: count,
            options: options,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlSelect(idType, 'Type', ol3turf.utils.getOptionsGeometry()),
        ol3turf.utils.getControlNumber(idCount, 'Count', 'How many geometries should be generated', '1', '1', '1'),
        ol3turf.utils.getControlNumber(idNumVertices, '# Vertices', 'Used only for polygon type', '10', '1', '3'),
        ol3turf.utils.getControlNumber(idMaxRadialLength, 'Max Length', 'Maximum degrees a polygon can extent outwards from its center (degrees)', '10', '0.01', '0', '180'),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create random data';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$A || {}));

  const ol3turf$B = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // sample control
  // --------------------------------------------------
  var sample = (function(ol3turf) {

    // Control name
    const name = 'sample';

    /**
       * Randomly sample features
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idCount = ol3turf.utils.getName([name, 'count'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Get form inputs
          const count = ol3turf.utils.getFormInteger(idCount, 'count');
          if (count > collection.features.length) {
            throw new Error('Feature count must be greater than sampling count.');
          }

          // Generate sample features
          const output = turf.sample(collection, count);

          // Remove form and display results
          control.showForm();
          const inputs = {
            featurecollection: collection,
            num: count,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idCount, 'Count', 'Number of random features to sample', '1', '1', '1'),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Randomly sample features';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$B || {}));

  const ol3turf$C = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // simplify control
  // --------------------------------------------------
  var simplify = (function(ol3turf) {

    // Control name
    const name = 'simplify';

    /**
       * Simplify shape
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idQuality = ol3turf.utils.getName([name, 'quality'], control.prefix);
      const idTolerance = ol3turf.utils.getName([name, 'tolerance'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Get form inputs
          const tolerance = ol3turf.utils.getFormNumber(idTolerance, 'tolerance');
          const quality = ol3turf.utils.getFormString(idQuality, 'quality');
          const highQuality = (quality === 'high');

          // Collect polygons
          const output = turf.simplify(collection, tolerance, highQuality);

          // Remove form and display results
          control.showForm();
          const inputs = {
            feature: collection,
            tolerance: tolerance,
            highQuality: highQuality,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idTolerance, 'Tolerance', 'Simplification tolerance', '1', '0.01', '0'),
        ol3turf.utils.getControlSelect(idQuality, 'Quality', ol3turf.utils.getOptionsQuality()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Simplify shape';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$C || {}));

  const ol3turf$D = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // squareGrid control
  // --------------------------------------------------
  var squareGrid = (function(ol3turf) {

    // Control name
    const name = 'square-grid';

    /**
       * Generate Square Grid
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idCellSize = ol3turf.utils.getName([name, 'cell-size'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Get form inputs
          const cellSize = ol3turf.utils.getFormNumber(idCellSize, 'cell size');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const bbox = turf.bbox(collection);
          const output = turf.squareGrid(bbox, cellSize, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            bbox: bbox,
            cellSize: cellSize,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Generate Square Grid';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$D || {}));

  const ol3turf$E = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // square control
  // --------------------------------------------------
  var square = (function(ol3turf) {

    // Control name
    const name = 'square';

    /**
       * Compute square
       * @private
       */
    const action = function(control) {
      // Gather selected features
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);
      const bbox = turf.bbox(collection);
      const square = turf.square(bbox);

      const output = turf.bboxPolygon(square);
      const inputs = {
        bbox: bbox,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create Square';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$E || {}));

  const ol3turf$F = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // tag control
  // --------------------------------------------------
  var tag = (function(ol3turf) {

    // Control name
    const name = 'tag';

    /**
       * Collect point attributes within polygon
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idField = ol3turf.utils.getName([name, 'field-property'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idOutField = ol3turf.utils.getName([name, 'out-field-property'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 2, Infinity);
          const points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
          const numPolygons = collection.features.length - points.length;
          const polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

          // Get form inputs
          const field = ol3turf.utils.getFormString(idField, 'field');
          const outField = ol3turf.utils.getFormString(idOutField, 'out field');

          // Collect polygons
          const inPolygons = turf.featureCollection(polygons);
          const inPoints = turf.featureCollection(points);
          const output = turf.tag(inPoints, inPolygons, field, outField);

          // Remove form and display results
          control.showForm();
          const inputs = {
            points: inPoints,
            polygons: inPolygons,
            field: field,
            outField: outField,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlText(idField, 'Field', 'Property in polygons to add to joined point features'),
        ol3turf.utils.getControlText(idOutField, 'Out Field', 'Property in points in which to store joined property from polygons'),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Perform spatial join of points and polygons';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$F || {}));

  const ol3turf$G = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // tesselate control
  // --------------------------------------------------
  var tesselate = (function(ol3turf) {

    // Control name
    const name = 'tesselate';

    /**
       * Compute tesselation
       * @private
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

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create tesselation';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$G || {}));

  const ol3turf$H = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // tin control
  // --------------------------------------------------
  var tin = (function(ol3turf) {

    // Control name
    const name = 'tin';

    /**
       * Compute tin mesh
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idZ = ol3turf.utils.getName([name, 'z'], control.prefix);

      function onOK() {
        try {
          let collection = ol3turf.utils.getCollection(control, 3, Infinity);
          const numPoints = collection.features.length;
          const points = ol3turf.utils.getPoints(collection, numPoints, numPoints);
          collection = turf.featureCollection(points);

          // Get form inputs
          const z = ol3turf.utils.getFormString(idZ, 'z');

          const output = turf.tin(collection, z);
          const inputs = {
            points: collection,
            z: z,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlText(idZ, 'Z', '(Optional) Property from which to pull z values'),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create TIN';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$H || {}));

  /* globals ol3turf */

  // ==================================================
  // standard toolbars
  // --------------------------------------------------
  var toolbars = (function(ol3turf) {

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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
      all.push.apply(all, measurement());
      all.push.apply(all, transformation());
      all.push.apply(all, misc());
      all.push.apply(all, joins());
      all.push.apply(all, classification());
      all.push.apply(all, aggregation());
      all.push.apply(all, data());
      all.push.apply(all, interpolation());
      all.push.apply(all, grids());
      return all;
    }
    return {
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
  }());

  const ol3turf$I = {
    Control,
    utils,
  };

  /* globals document, ol3turf, turf */

  // ==================================================
  // triangleGrid control
  // --------------------------------------------------
  var triangleGrid = (function(ol3turf) {

    // Control name
    const name = 'triangle-grid';

    /**
       * Generate Triangle Grid
       * @private
       */
    const action = function(control) {
      // Define control ids
      const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
      const idCellSize = ol3turf.utils.getName([name, 'cell-size'], control.prefix);
      const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
      const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
      const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

      function onOK() {
        try {
          // Gather selected features
          const collection = ol3turf.utils.getCollection(control, 1, Infinity);

          // Get form inputs
          const cellSize = ol3turf.utils.getFormNumber(idCellSize, 'cell size');
          const units = ol3turf.utils.getFormString(idUnits, 'units');

          // Collect polygons
          const bbox = turf.bbox(collection);
          const output = turf.triangleGrid(bbox, cellSize, units);

          // Remove form and display results
          control.showForm();
          const inputs = {
            bbox: bbox,
            cellSize: cellSize,
            units: units,
          };
          control.toolbar.ol3turf.handler.callback(name, output, inputs);
        } catch (e) {
          control.showMessage(e);
        }
      }

      function onCancel() {
        control.showForm();
      }

      const controls = [
        ol3turf.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
        ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
        ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
        ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
      ];

      control.showForm(controls, idForm);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Generate Triangle Grid';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$I || {}));

  const ol3turf$J = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // union control
  // --------------------------------------------------
  var union = (function(ol3turf) {

    // Control name
    const name = 'union';

    /**
       * Compute union of two polygons
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const polygons = ol3turf.utils.getPolygons(collection, 2, 2);
      const poly1 = polygons[0];
      const poly2 = polygons[1];

      const output = turf.union(poly1, poly2);
      const inputs = {
        poly1: poly1,
        poly2: poly2,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Create Union Polygon';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$J || {}));

  const ol3turf$K = {
    Control,
    utils,
  };

  /* globals ol3turf, turf */

  // ==================================================
  // within control
  // --------------------------------------------------
  var within = (function(ol3turf) {

    // Control name
    const name = 'within';

    /**
       * Compute points within polygons
       * @private
       */
    const action = function(control) {
      const collection = ol3turf.utils.getCollection(control, 2, Infinity);
      const pts = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
      const numPolygons = collection.features.length - pts.length;
      const polys = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

      const points = turf.featureCollection(pts);
      const polygons = turf.featureCollection(polys);

      const output = turf.within(points, polygons);
      if (output.features.length === 0) {
        throw new Error('No points found within.');
      }
      const inputs = {
        points: points,
        polygons: polygons,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    };

    return {
      /*
           * Create control then attach custom action and it's parent toolbar
           * @param toolbar Parent toolbar
           * @param prefix Selector prefix.
           */
      create: function(toolbar, prefix) {
        const title = 'Find points within polygons';
        const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
        return control;
      },
    };
  }(ol3turf$K || {}));

  var controls = {
    along,
    area,
    bearing,
    bezier,
    buffer,
    center,
    'center-of-mass': centerOfMass,
    centroid,
    circle,
    collect,
    combine,
    concave,
    convex,
    destination,
    difference,
    distance,
    envelope,
    explode,
    flip,
    'hex-grid': hexGrid,
    inside,
    intersect,
    isolines,
    kinks,
    'line-distance': lineDistance,
    'line-slice-along': lineSliceAlong,
    midpoint,
    nearest,
    planepoint,
    'point-grid': pointGrid,
    'point-on-line': pointOnLine,
    'point-on-surface': pointOnSurface,
    popup,
    random,
    sample,
    simplify,
    'square-grid': squareGrid,
    square,
    tag,
    tesselate,
    tin,
    toolbars,
    'triangle-grid': triangleGrid,
    union,
    utils,
    within,
  };

  /* globals document, ol, ol3turf, turf */

  // ==================================================
  // default callback handler
  // --------------------------------------------------
  var Handler = (function(ol3turf) {

    /**
       * Callback handler
       * @constructor
       * @param toolbar ol3-turf toolbar
       * @private
       */
    const Handler = function(toolbar) {
      this.toolbar = toolbar;
    };

    /**
       * Default function called by each control when turf function is completed.
       * @param name Name of ol3-turf control being handled
       * @param output Output of turf function
       * @param inputs Object with inputs provided to turf function as properties
       * @private
       */
    Handler.prototype.callback = function(name, output, inputs) {
      const control = this.toolbar.ol3turf.controls[name];

      // First handle controls with custom messages
      // then handle controls that add output features to map
      if (name === 'area') {
        control.showMessage('area = ' + output + ' msq');
      } else if (name === 'bearing') {
        control.showMessage('bearing = ' + output + ' degrees');
      } else if (name === 'distance') {
        control.showMessage('distance = ' + output + ' ' + inputs.units);
      } else if (name === 'inside') {
        let message = 'Point is';
        if (output === false) {
          message += ' not';
        }
        message += ' inside polygon.';
        control.showMessage(message);
      } else if (name === 'line-distance') {
        control.showMessage('length = ' + output + ' ' + inputs.units);
      } else if (name === 'planepoint') {
        control.showMessage('z = ' + output);
      } else {
        control.addFeatures(output);
      }
    };

    return Handler;
  }());

  /* globals document, ol, ol3turf, window */

  /**
   * @namespace ol3turf
   */
  const ol3turf$L = {
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
   * @callback ToolbarCallback
   * @memberOf ol3turf
   * @param {string} name Name of control to process
   * @param {object} inputs Inputs passed to the control's corresponding turf function
   * @param {*} output Output returned by the turf function
   */

  /**
   * @description ol3-turf custom callback handler.
   * @typedef {object} ToolbarHandler
   * @memberOf ol3turf
   * @property {ol3turf.ToolbarCallback} callback Function to handle processing turf commands.
   */

  /**
   * @description ol3-turf constructor options.
   * @typedef {object} ToolbarOptions
   * @memberOf ol3turf
   * @property {string[]} [controls={@link ol3turf.toolbars.ToolbarAll}] Controls to enable
   * @property {ol3turf.ToolbarHandler} [handler=ol3turf.Handler] Optional function that handles
   *                                                              processing the output of the
   *                                                              ol3-turf controls. This is
   *                                                              useful to bypass the default
   *                                                              handler and provide custom
   *                                                              processing of the results. The
   *                                                              default handler adds features
   *                                                              to the map or displays a message
   *                                                              with any values returned by the
   *                                                              turf function.
   * @property {string} [prefix=ol3-turf] Prefix to apply to control element IDs.
   *                                      Only needed to make IDs unique if
   *                                      multiple instances of an ol3-turf
   *                                      toolbar are used on the same page.
   * @property {string} [style=ol3-turf-toolbar] The name of the class to apply
   *                                             to the toolbar.
   */

  /**
   * OpenLayers 3 Turf Control
   * @constructor
   * @extends {external:ol.control.Control}
   * @param {object} [options] Control options extends ol.control.Control options
   * @param {ol3turf.ToolbarOptions} [options.ol3turf] ol3-turf specific options
   */
  const Toolbar = function(opt_options) {

    const self = this;

    // Process options
    const options = opt_options || {};
    options.ol3turf = options.ol3turf || {};
    if (options.ol3turf.controls === undefined) {
      // Default is to enable all controls and display them in this order.
      options.ol3turf.controls = ol3turf$L.toolbars.all();
    }

    // Set control handler
    if (options.ol3turf.handler === undefined) {
      options.ol3turf.handler = new ol3turf$L.Handler(self);
    }

    // Define default style
    if (options.ol3turf.style === undefined) {
      options.ol3turf.style = 'ol3-turf-toolbar';
    }

    // Define default prefix
    if (options.ol3turf.prefix === undefined) {
      options.ol3turf.prefix = 'ol3-turf';
    }

    // Create turf toolbar DOM if not provided by user
    if (options.element === undefined) {
      options.element = document.createElement('div');
    }
    if (options.element.className === '') {
      options.element.className = options.ol3turf.style + ' ol-unselectable ol-control';
    }

    // Add controls to toolbar
    const ol3turfcontrols = {};
    options.ol3turf.controls.forEach(function(name) {
      if (ol3turf$L.controls[name] !== undefined) {
        // Store control in ol3turf member and add button to div
        const control = ol3turf$L.controls[name].create(self, options.ol3turf.prefix);
        ol3turfcontrols[name] = control;
        options.element.appendChild(control.element);
      }
    });

    // Object to internally store ol3-turf specific attributes
    this.ol3turf = {
      controls: ol3turfcontrols,
      element: options.element,
      handler: options.ol3turf.handler,
    };

    ol.control.Control.call(this, options);
  };
  ol.inherits(Toolbar, ol.control.Control);

  var main = {
    toolbars,
    Toolbar,
  };

  return main;

}));
