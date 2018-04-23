/* ol3-turf 0.5.1 (c) Daniel Pulido <dpmcmlxxvi@gmail.com> */

/*globals document, ol, ol3turf, window */

/**
 * @namespace ol3turf
 */
window.ol3turf = window.ol3turf || {};

/*
 * Default ol3-turf selector prefix
 */
window.ol3turf.PREFIX = "ol3-turf";

/*
 * Default turf projection
 */
window.ol3turf.PROJECTION_TURF = "EPSG:4326";

/*
 * Default ol3 projection
 */
window.ol3turf.PROJECTION_OL3 = "EPSG:3857";

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
ol.control.Turf = function (opt_options) {

    "use strict";

    var self = this;

    // Process options
    var options = opt_options || {};
    options.ol3turf = options.ol3turf || {};
    if (options.ol3turf.controls === undefined) {
        // Default is to enable all controls and display them in this order.
        options.ol3turf.controls = ol3turf.toolbars.all();
    }

    // Set control handler
    if (options.ol3turf.handler === undefined) {
        options.ol3turf.handler = new ol3turf.Handler(self);
    }

    // Define default style
    if (options.ol3turf.style === undefined) {
        options.ol3turf.style = "ol3-turf-toolbar";
    }

    // Define default prefix
    if (options.ol3turf.prefix === undefined) {
        options.ol3turf.prefix = ol3turf.PREFIX;
    }

    // Create turf toolbar DOM if not provided by user
    if (options.element === undefined) {
        options.element = document.createElement("div");
    }
    if (options.element.className === "") {
        options.element.className = options.ol3turf.style + " ol-unselectable ol-control";
    }

    // Add controls to toolbar
    var ol3turfcontrols = {};
    options.ol3turf.controls.forEach(function (name) {
        if (ol3turf.controls[name] !== undefined) {
            // Store control in ol3turf member and add button to div
            var control = ol3turf.controls[name].create(self, options.ol3turf.prefix);
            ol3turfcontrols[name] = control;
            options.element.appendChild(control.element);
        }
    });

    // Object to internally store ol3-turf specific attributes
    this.ol3turf = {
        controls: ol3turfcontrols,
        element: options.element,
        handler: options.ol3turf.handler
    };

    ol.control.Control.call(this, options);

};
ol.inherits(ol.control.Turf, ol.control.Control);


/*globals document, ol3turf */

//==================================================
// utility methods
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    /*
     * Object to encapsulate all available utility methods
     */
    ol3turf.utils = ol3turf.utils || {};

    /**
     * Extend properties from source to target objects recursively.
     * @param {object} source Source object
     * @param {object} target Target object
     * @private
     */
    ol3turf.utils.extend = function (source, target) {
        if ((source === undefined) || target === undefined) {
            return;
        }
        Object.keys(source).forEach(function (property) {
            var src = source[property];
            if ((src !== null) && (typeof src === "object")) {
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
     * @returns Class selector string ".ol3-turf-..."
     */
    ol3turf.utils.getClass = function (suffices, prefix) {

        return "." + ol3turf.utils.getName(suffices, prefix);

    };

    /**
     * Get selected features collection
     * @param {ol3turf.Control} control Control to extract feature collection
     * @param {number} min Minimum number of expected features in collection
     * @param {number} max Maximum number of expected features in collection
     * @private
     * @returns {object} GeoJSON FeatureCollection
     * @throws {Error} Invalid number of features found
     */
    ol3turf.utils.getCollection = function (control, min, max) {

        var collection = control.getFeatures();
        if (collection.features.length < min) {
            throw new Error("Number of features less than " + min);
        }
        if (collection.features.length > max) {
            throw new Error("Number of features greater than " + max);
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
     * @returns {object} Control input attributes
     */
    ol3turf.utils.getControlInput = function (id, onclick, title, value) {

        return {
            title: title,
            type: "input",
            attributes: {
                name: id,
                onclick: onclick,
                type: "submit",
                value: value
            }
        };

    };

    /**
     * Get control input attributes
     * @param {string} id Control ID
     * @param {string} onclick Callback function
     * @param {string} title Control header title
     * @param {string} value Control value
     * @private
     * @returns {object} Control input attributes
     */
    ol3turf.utils.getControlNumber = function (id, title, text, value, step, min, max) {

        return {
            title: title,
            type: "input",
            attributes: {
                id: id,
                name: id,
                min: min,
                max: max,
                step: step,
                title: text,
                type: "number",
                value: value
            }
        };

    };


    /**
     * Get control select attributes
     * @param {string} id Control ID
     * @param {string} title Control header title
     * @param {string} options Control options.
     * @private
     * @returns {object} Control button attributes
     */
    ol3turf.utils.getControlSelect = function (id, title, options) {

        return {
            title: title,
            type: "select",
            attributes: {
                id: id,
                name: id
            },
            options: options
        };

    };

    /**
     * Get control text attributes
     * @param {string} id Control ID
     * @param {string} title Control header title
     * @param {string} text Control text
     * @private
     * @returns {object} Control text attributes
     */
    ol3turf.utils.getControlText = function (id, title, text) {

        return {
            title: title,
            type: "input",
            attributes: {
                id: id,
                name: id,
                title: text,
                type: "text"
            }
        };

    };

    /**
     * Get element string for a given array of ol3-turf suffices
     * @param {string} name Element name string (e.g., input, select)
     * @param {string[]} suffices List of suffices to append to base name
     * @param {string} prefix Selector prefix
     * @private
     * @returns Element string (e.g., "input[name=ol3-turf-...")
     */
    ol3turf.utils.getElement = function (name, suffices, prefix) {

        return name + "[name='" + ol3turf.utils.getName(suffices, prefix) + "']";

    };

    /**
     * Get features in collection
     * @param {string[]} types Feature types allowed (e.g., LineString, Point)
     * @param {object} collection GeoJSON FeatureCollection
     * @param {number} min Minimum number of expected lines in collection
     * @param {number} max Maximum number of expected lines in collection
     * @private
     * @returns {object[]} Features found
     * @throws {Error} Invalid number of features found
     */
    ol3turf.utils.getFeatures = function (types, collection, min, max) {

        var features = [];
        collection.features.forEach(function (feature) {
            if (types.indexOf(feature.geometry.type) > -1) {
                features.push(feature);
            }
        });
        if (features.length < min) {
            throw new Error("Number of '" + types + "' features less than " + min);
        }
        if (features.length > max) {
            throw new Error("Number of '" + types + "' features greater than " + max);
        }
        return features;

    };

    /**
     * Get array of numbers delimited by commas from form field
     * @param {string} id Selector ID of form field
     * @param {string} name Name of field
     * @private
     * @returns {number[]} Numeric value of form field
     * @throws {Error} Field value is not numeric array
     */
    ol3turf.utils.getFormArray = function (id, name) {

        var input = ol3turf.utils.getFormString(id, name);
        var values = [];
        input.split(",").forEach(function (value) {
            var num = parseFloat(value);
            if (Number(num) !== num) {
                throw new Error("Invalid " + name);
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
     * @returns {number} Integer value of form field
     * @throws {Error} Field value is not integer
     */
    ol3turf.utils.getFormInteger = function (id, name) {

        var value = parseInt(document.getElementById(id).value, 10);
        if (Number(value) !== value) {
            throw new Error("Invalid " + name);
        }
        return value;

    };

    /**
     * Get number from form field
     * @param {string} id Selector ID of form field
     * @param {string} name Name of field
     * @private
     * @returns {number} Numeric value of form field
     * @throws {Error} Field value is not numeric
     */
    ol3turf.utils.getFormNumber = function (id, name) {

        var value = parseFloat(document.getElementById(id).value);
        if (Number(value) !== value) {
            throw new Error("Invalid " + name);
        }
        return value;

    };

    /**
     * Get string from form field
     * @param {string} id Selector ID of form field
     * @param {string} name Name of field
     * @private
     * @returns {string} String value of form field
     * @throws {Error} Field value is not non-empty string
     */
    ol3turf.utils.getFormString = function (id, name) {

        var value = document.getElementById(id).value;
        if (!value || !value.trim()) {
            throw new Error("Invalid " + name);
        }
        return value;

    };

    /**
     * Get ol3-turf id selector with given suffices
     * @param {string[]} suffices List of suffices to append to base name
     * @param {string} prefix Selector prefix
     * @private
     * @returns Id selector string "#ol3-turf-..."
     */
    ol3turf.utils.getId = function (suffices, prefix) {

        return "#" + ol3turf.utils.getName(suffices, prefix);

    };

    /**
     * Get lines in collection
     * @param {object} collection GeoJSON FeatureCollection
     * @param {number} min Minimum number of expected lines in collection
     * @param {number} max Maximum number of expected lines in collection
     * @private
     * @returns {object[]} Lines found
     * @throws {Error} Invalid number of lines found
     */
    ol3turf.utils.getLines = function (collection, min, max) {

        return ol3turf.utils.getFeatures(["LineString"], collection, min, max);

    };

    /**
     * Get ol3-turf name with given suffices appended with hyphens
     * @param {string[]} suffices List of suffices to append to base name
     * @param {string} prefix Selector prefix
     * @private
     * @returns Control name string "ol3-turf-..."
     */
    ol3turf.utils.getName = function (suffices, prefix) {

        if (prefix === undefined) {
            prefix = ol3turf.PREFIX;
        }
        var name = prefix;
        suffices.forEach(function (suffix) {
            name += "-" + suffix;
        });
        return name;

    };

    /**
     * Get turf geometry options for drop down menu
     * @private
     * @returns {object[]} Geometry options
     */
    ol3turf.utils.getOptionsGeometry = function () {

        return [
            {
                text: "Points",
                attributes: {
                    selected: "selected",
                    value: "points"
                }
            },
            {
                text: "Polygons",
                attributes: {
                    value: "polygons"
                }
            }
        ];

    };

    /**
     * Get turf grid options for drop down menu
     * @private
     * @returns {object[]} Grid options
     */
    ol3turf.utils.getOptionsGrids = function () {

        return [
            {
                text: "Hexagons",
                attributes: {
                    selected: "selected",
                    value: "hexagons"
                }
            },
            {
                text: "Triangles",
                attributes: {
                    value: "triangles"
                }
            }
        ];

    };

    /**
     * Get turf quality options for drop down menu
     * @private
     * @returns {object[]} Quality options
     */
    ol3turf.utils.getOptionsQuality = function () {

        return [
            {
                text: "High",
                attributes: {
                    value: "high"
                }
            },
            {
                text: "Low",
                attributes: {
                    selected: "selected",
                    value: "low"
                }
            }
        ];

    };

    /**
     * Get turf unit options for drop down menu
     * @private
     * @returns {object[]} Unit options
     */
    ol3turf.utils.getOptionsUnits = function () {

        return [
            {
                text: "degrees",
                attributes: {
                    value: "degrees"
                }
            },
            {
                text: "kilometers",
                attributes: {
                    selected: "selected",
                    value: "kilometers"
                }
            },
            {
                text: "miles",
                attributes: {
                    value: "miles"
                }
            },
            {
                text: "radians",
                attributes: {
                    value: "radians"
                }
            }
        ];

    };

    /**
     * Get points in collection
     * @param {object} collection GeoJSON FeatureCollection
     * @param {number} min Minimum number of expected points in collection
     * @param {number} max Maximum number of expected points in collection
     * @private
     * @returns {object[]} Points found
     * @throws {Error} Invalid number of points found
     */
    ol3turf.utils.getPoints = function (collection, min, max) {

        return ol3turf.utils.getFeatures(["Point"], collection, min, max);

    };

    /**
     * Get polygons in collection
     * @param {object} collection GeoJSON FeatureCollection
     * @param {number} min Minimum number of expected polygons in collection
     * @param {number} max Maximum number of expected polygons in collection
     * @private
     * @returns {object[]} Polygons found
     * @throws {Error} Invalid number of polygons found
     */
    ol3turf.utils.getPolygons = function (collection, min, max) {

        return ol3turf.utils.getFeatures(["Polygon"], collection, min, max);

    };

    /**
     * Get polygons and multipolygons in collection
     * @param {object} collection GeoJSON FeatureCollection
     * @param {number} min Minimum number of expected polygons in collection
     * @param {number} max Maximum number of expected polygons in collection
     * @private
     * @returns {object[]} Polygons found
     * @throws {Error} Invalid number of polygons found
     */
    ol3turf.utils.getPolygonsAll = function (collection, min, max) {

        return ol3turf.utils.getFeatures(["Polygon", "MultiPolygon"], collection, min, max);

    };

}(ol3turf || {}));


/*globals document, ol, ol3turf, turf, window */

//==================================================
// toolbar control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    /*
     * Object to encapsulate all available controls
     */
    ol3turf.controls = ol3turf.controls || {};

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
        var distanceToRight = sizeMap.right - (sizeForm.left + sizeForm.width);
        var distanceToLeft = sizeForm.left + distanceToRight;
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
        var distanceToBottom = sizeMap.bottom - (sizeForm.top + sizeForm.height);
        var distanceToTop = sizeForm.top + distanceToBottom;
        if ((distanceToBottom < 0) && (distanceToTop > 0)) {
            sizeForm.top += distanceToBottom - (sizeButton.height / 2);
        }
    }

    /**
     * Get absolute position and size object of element
     * @param {object} element Element of form to position
     * @returns {object} Form's absolute form position and size
     * @private
     */
    function getAbsoluteRect(element) {

        var rect = element.getBoundingClientRect();

        // Compute absolute position of element
        var left = 0;
        var top = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        // Compute absolute size object
        var size = {
            bottom: top + rect.height,
            height: rect.height,
            left: left,
            right: left + rect.width,
            top: top,
            width: rect.width
        };

        return size;
    }

    /**
     * Get absolute left position of form
     * @param {object} Form's absolute form position and size
     * @param {object} Map's absolute form position and size
     * @param {object} Toolbar's absolute form position and size
     * @param {object} Button's absolute form position and size
     * @returns {number} Form's new left position
     * @private
     */
    function getFormLeft(sizeForm, sizeMap, sizeToolbar, sizeButton) {

        // Delta is amount to displace horizontally
        var delta = 0;

        // Toolbar is vertical so start by setting form at toolbar right
        var left = sizeToolbar.left + sizeToolbar.width;
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
     * @returns {number} Form's new top position
     * @private
     */
    function getFormTop(sizeForm, sizeMap, sizeToolbar, sizeButton) {

        // Delta is amount to displace vertically
        var delta = 0;

        // Start by setting form at toolbar bottom
        var top = sizeToolbar.bottom;
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
    var Control = function (options) {

        var opt_options = options || {};

        // Define control button
        var self = this;
        this.button = document.createElement("button");
        this.button.addEventListener("click", this.run.bind(this), false);
        this.button.addEventListener("touchstart", this.run.bind(this), false);
        Object.keys(opt_options).forEach(function (key) {
            self.button[key] = opt_options[key];
        });
        this.element = document.createElement("div");
        this.element.className = "ol3-turf-control";
        this.element.appendChild(this.button);

        // Initialize ol.control.Turf which needs to be set during creation
        this.toolbar = null;

        // Initialize form which needs to be set during creation
        this.form = null;

        // Initialize form which needs to be set during creation
        this.prefix = ol3turf.PREFIX;

    };

    /**
     * Action performed by control.
     * @private
     * @warning This method should be implemented by derived controls.
     */
    Control.prototype.action = function () {

        throw new Error("Control action not implemented!");

    };

    /**
     * Add turf features to map
     * @param {object} features GeoJSON features to add.
     * @private
     */
    Control.prototype.addFeatures = function (features) {

        var projectionMap = this.getProjectionMap();
        var projectionTurf = this.getProjectionTurf();

        var format = new ol.format.GeoJSON();
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: format.readFeatures(features, {
                    dataProjection: projectionTurf,
                    featureProjection: projectionMap
                })
            })
        });
        this.getMap().addLayer(layer);

    };

    /**
     * Get all features selected
     * @returns {object} GeoJSON FeatureCollection
     * @private
     */
    Control.prototype.getFeatures = function () {

        var projectionMap = this.getProjectionMap();
        var projectionTurf = this.getProjectionTurf();

        var format = new ol.format.GeoJSON();

        var collection = [];
        var selectors = this.getSelectors();
        selectors.forEach(function (selector) {
            var features = selector.getFeatures();
            features.forEach(function (feature) {
                collection.push(format.writeFeatureObject(feature, {
                    dataProjection: projectionTurf,
                    featureProjection: projectionMap
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
     * @returns {ol3turf.ControlPosition} Current form's form position.
     * @private
     */
    Control.prototype.getFormPosition = function (form) {

        // Get absolute position and size of elements
        var sizeButton = getAbsoluteRect(this.button);
        var sizeForm = getAbsoluteRect(form);
        var sizeMap = getAbsoluteRect(this.getMap().getTargetElement());
        var sizeToolbar = getAbsoluteRect(this.toolbar.ol3turf.element);

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
            left: sizeForm.left
        };

    };

    /**
     * Get parent map
     * @returns {ol.Map|null} Current ol3 map
     * @private
     */
    Control.prototype.getMap = function () {

        if (this.toolbar === null) {
            return null;
        }
        var map = this.toolbar.getMap();
        return map;

    };

    /**
     * Get the projection of the ol.Map
     * @returns {string} Projection code string
     * @private
     */
    Control.prototype.getProjectionMap = function () {

        var projectionMap = ol3turf.PROJECTION_OL3;
        var projection = this.getMap().getView().getProjection();
        if (projection !== undefined) {
            projectionMap = projection.getCode();
        }
        return projectionMap;

    };

    /**
     * Get the projection of turf.js
     * @returns {string} Projection code string
     * @private
     */
    Control.prototype.getProjectionTurf = function () {

        return ol3turf.PROJECTION_TURF;

    };

    /**
     * Get all selection interactions of current map
     * @returns {ol.interaction.Interaction[]} Array of map interactions
     * @private
     */
    Control.prototype.getSelectors = function () {

        var selectors = [];

        var map = this.getMap();
        if (map === null) {
            return selectors;
        }

        map.getInteractions().forEach(function (interaction) {

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
    Control.prototype.run = function () {

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
    Control.prototype.showForm = function (controls, id) {

        // Remove any existing form
        var oldiv = this.toolbar.element.parentNode;
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
        var attributes = {
            style: {
                visibility: "hidden"
            }
        };

        // Create new form
        if (id === undefined) {
            id = "ol3-turf-form";
        }
        this.form = ol3turf.form(oldiv, id, controls, attributes);

        // Update form position and display
        var position = this.getFormPosition(this.form);
        this.form.style.left = position.left + "px";
        this.form.style.top = position.top + "px";
        this.form.style.visibility = "visible";

    };

    /**
     * Show message.
     * @param {string} message Text message to display
     * @private
     */
    Control.prototype.showMessage = function (message) {

        // Create popup message and hide
        var callback = null;
        var parent = this.toolbar.ol3turf.element.parentNode;
        var attributes = {
            style: {
                visibility: "hidden"
            }
        };
        var popup = ol3turf.popup(message, callback, parent, attributes);

        // Get placement and display
        var position = this.getFormPosition(popup);
        popup.style.left = position.left + "px";
        popup.style.top = position.top + "px";
        popup.style.visibility = "visible";

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
    Control.create = function (toolbar, prefix, name, title, action) {

        // Create control options
        var clsControl = ol3turf.utils.getName([name]);
        var clsButton = ol3turf.utils.getName(["control", "button"]);
        var idControl = ol3turf.utils.getName([name], prefix);
        var options = {
            className: clsControl + " " + clsButton,
            id: idControl,
            title: title
        };

        // Create control
        var control = new ol3turf.Control(options);
        control.prefix = prefix;
        control.toolbar = toolbar;
        control.action = function () {
            return action(control);
        };
        return control;

    };

    /**
     * Base control class constructor
     * @private
     */
    ol3turf.Control = Control;

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf */

//==================================================
// input form
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

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
    ol3turf.form = function (parent, formId, controls, attributes) {

        var container = null;
        if (typeof parent === "string") {
            container = document.getElementById(parent);
        } else {
            container = parent;
        }
        if (container === null) {
            throw new Error("ol3turf.form: Parent element not found.");
        }
        if (formId === undefined) {
            throw new Error("ol3turf.form: Form ID not provided.");
        }
        if (controls === undefined) {
            throw new Error("ol3turf.form: Form controls not provided.");
        }

        // Create a form to add to parent
        var form = document.createElement("form");
        form.id = formId;
        form.className = "ol3-turf-form ol-unselectable ol-control";
        form.setAttribute("onsubmit", "return false;");
        ol3turf.utils.extend(attributes, form);

        // Create a table to add to form
        var table = document.createElement("table");
        table.className = "ol3-turf-form-table";

        // Each form control is a table row with a title in the
        // header column and the control in the data column.
        controls.forEach(function (element) {

            var row = document.createElement("tr");
            row.className = "ol3-turf-form-row";

            var th = document.createElement("th");
            th.innerHTML = element.title;
            th.className = "ol3-turf-form-header";
            row.appendChild(th);

            var td = document.createElement("td");
            td.className = "ol3-turf-form-data";

            // Create control
            var control = document.createElement(element.type);
            control.className = "ol3-turf-form-input";
            ol3turf.utils.extend(element.attributes, control);

            // Check if this is a selection and add pulldown options
            if (element.type === "select") {
                control.className = "ol3-turf-form-select";
                if (element.options !== undefined) {
                    element.options.forEach(function (opt) {
                        var option = document.createElement("option");
                        option.innerHTML = opt.text;
                        option.className = "ol3-turf-form-option";
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

}(ol3turf || {}));


/*globals document, ol, ol3turf, turf */

//==================================================
// default callback handler
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    /**
     * Callback handler
     * @constructor
     * @param toolbar ol3-turf toolbar
     * @private
     */
    var Handler = function (toolbar) {

        this.toolbar = toolbar;

    };

    /**
     * Default function called by each control when turf function is completed.
     * @param name Name of ol3-turf control being handled
     * @param output Output of turf function
     * @param inputs Object with inputs provided to turf function as properties
     * @private
     */
    Handler.prototype.callback = function (name, output, inputs) {

        var control = this.toolbar.ol3turf.controls[name];

        // First handle controls with custom messages
        // then handle controls that add output features to map
        if (name === "area") {
            control.showMessage("area = " + output + " msq");
        } else if (name === "bearing") {
            control.showMessage("bearing = " + output + " degrees");
        } else if (name === "distance") {
            control.showMessage("distance = " + output + " " + inputs.units);
        } else if (name === "inside") {
            var message = "Point is";
            if (output === false) {
                message += " not";
            }
            message += " inside polygon.";
            control.showMessage(message);
        } else if (name === "line-distance") {
            control.showMessage("length = " + output + " " + inputs.units);
        } else if (name === "planepoint") {
            control.showMessage("z = " + output);
        } else {
            control.addFeatures(output);
        }

    };

    ol3turf.Handler = Handler;

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf */

//==================================================
// popup form
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    /**
     * Displays a message in a popup window.
     * @param {string} message Message to display
     * @param {function} callback Callback function when user closes popup.
     * @param {object} parent Popup parent element
     * @param {object} attributes Popup div attributes
     * @return Popup DOM element
     * @private
     */
    ol3turf.popup = function (message, callback, parent, attributes) {

        // Popup id
        var id = "ol3-turf-popup";

        // Remove existing popup
        var currentPopup = document.getElementById(id);
        var currentParent = null;
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
            ol3turf.popup();
        }

        // If no parent then add to body
        var container = document.body;
        if (parent !== undefined && parent !== null) {
            container = parent;
        }

        // Create a div to contain popup
        var popup = document.createElement("div");
        popup.className = id;
        popup.id = id;
        ol3turf.utils.extend(attributes, popup);

        // Create a div to contain message
        var divMessage = document.createElement("div");
        divMessage.className = "ol3-turf-popup-message";
        divMessage.innerHTML = message;

        // Create a button
        var button = document.createElement("button");
        button.className = "ol3-turf-popup-button";
        button.innerHTML = "OK";
        button.onclick = onClick;
        button.type = "button";

        var divButton = document.createElement("div");
        divButton.className = "ol3-turf-popup-button-container";
        divButton.appendChild(button);

        // Create popup
        popup.appendChild(divMessage);
        popup.appendChild(divButton);
        container.appendChild(popup);

        return popup;

    };

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// along control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "along";

    /**
     * Find point along line at given distance
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idDistance = ol3turf.utils.getName([name, "distance"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather line seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var lines = ol3turf.utils.getLines(collection, 1, 1);
                var line = lines[0];

                // Gather form inputs
                var distance = ol3turf.utils.getFormNumber(idDistance, "distance");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.along(line, distance, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    line: line,
                    distance: distance,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idDistance, "Distance", "Distance along the line", "0", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Find point along line at given distance";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// area control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "area";

    /**
     * Compute area
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.area(collection);
        var inputs = {
            input: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Area";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// bearing control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "bearing";

    /**
     * Compute bearing between two points
     * @private
     */
    var action = function (control) {

        // Gather points seleted
        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 2, 2);
        var start = points[0];
        var end = points[1];
        var output = turf.bearing(start, end);
        var inputs = {
            start: start,
            end: end
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Bearing";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// bezier control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "bezier";

    /**
     * Create bezier curve of line
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idResolution = ol3turf.utils.getName([name, "resolution"], control.prefix);
        var idSharpness = ol3turf.utils.getName([name, "sharpness"], control.prefix);

        function onOK() {
            try {

                // Gather line seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var lines = ol3turf.utils.getLines(collection, 1, 1);
                var line = lines[0];

                // Gather form inputs
                var resolution = ol3turf.utils.getFormNumber(idResolution, "resolution");
                var sharpness = ol3turf.utils.getFormNumber(idSharpness, "sharpness");

                // Create bezier curve
                var output = turf.bezier(line, resolution, sharpness);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    line: line,
                    resolution: resolution,
                    sharpness: sharpness
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idResolution, "Resolution", "Time between points (milliseconds)", "10000", "any", "0"),
            ol3turf.utils.getControlNumber(idSharpness, "Sharpness", "Measure of how curvy the path should be between splines", "0.85", "0.01", "0", "1"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create bezier curve of line";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// buffer control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "buffer";

    /**
     * Buffer feature by given radius
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idDistance = ol3turf.utils.getName([name, "distance"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Gather form inputs
                var distance = ol3turf.utils.getFormNumber(idDistance, "distance");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.buffer(collection, distance, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    feature: collection,
                    distance: distance,
                    unit: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idDistance, "Distance", "Distance to draw the buffer", "0", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Buffer feature by given radius";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// center control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "center";

    /**
     * Compute center
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);
        var output = turf.center(collection);
        var inputs = {
            features: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Center";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// center-of-mass control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "center-of-mass";

    /**
     * Compute center-of-mass
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);
        var output = turf.centerOfMass(collection);
        var inputs = {
            features: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure center of mass";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// centroid control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "centroid";

    /**
     * Compute centroid
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);
        var output = turf.centroid(collection);
        var inputs = {
            features: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Centroid";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// circle control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "circle";

    /**
     * Create circle
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idRadius = ol3turf.utils.getName([name, "radius"], control.prefix);
        var idSteps = ol3turf.utils.getName([name, "steps"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather center point
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var points = ol3turf.utils.getPoints(collection, 1, 1);
                var center = points[0];

                // Gather form inputs
                var radius = ol3turf.utils.getFormNumber(idRadius, "radius");
                var steps = ol3turf.utils.getFormNumber(idSteps, "steps");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.circle(center, radius, steps, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    center: center,
                    radius: radius,
                    steps: steps,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idRadius, "Radius", "Radius of the circle", "0", "any", "0"),
            ol3turf.utils.getControlNumber(idSteps, "Steps", "Number of steps around circle", "3", "1", "3"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create circle";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// collect control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "collect";

    /**
     * Collect point attributes within polygon
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idIn = ol3turf.utils.getName([name, "in", "property"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idOut = ol3turf.utils.getName([name, "out", "property"], control.prefix);

        function onOK() {
            try {

                // Gather selected points and polygons
                var collection = ol3turf.utils.getCollection(control, 2, Infinity);
                var points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
                var numPolygons = collection.features.length - points.length;
                var polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

                // Gather form inputs
                var inProperty = ol3turf.utils.getFormString(idIn, "In-Property");
                var outProperty = ol3turf.utils.getFormString(idOut, "Out-Property");

                // Collect polygons
                var inPolygons = turf.featureCollection(polygons);
                var inPoints = turf.featureCollection(points);
                var output = turf.collect(inPolygons,
                        inPoints,
                        inProperty,
                        outProperty);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    polygons: inPolygons,
                    points: inPoints,
                    inProperty: inProperty,
                    outProperty: outProperty
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);


            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlText(idIn, "In Property", "Property to be nested from"),
            ol3turf.utils.getControlText(idOut, "Out Property", "Property to be nested into"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Collect points within polygons";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// combine control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "combine";

    /**
     * Compute combine of feature collection
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.combine(collection);
        var inputs = {
            fc: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Combine feature collection";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// concave control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "concave";

    /**
     * Buffer feature by given radius
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idMaxEdge = ol3turf.utils.getName([name, "max", "edge"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 3, Infinity);
                var numPoints = collection.features.length;
                var pts = ol3turf.utils.getPoints(collection, numPoints, numPoints);

                // Gather form inputs
                var maxEdge = ol3turf.utils.getFormNumber(idMaxEdge, "Max Edge");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var points = turf.featureCollection(pts);
                var output = turf.concave(points, maxEdge, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    points: points,
                    maxEdge: maxEdge,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);


            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idMaxEdge, "Max Edge Size", "Maximum size of an edge necessary for part of the hull to become concave", "0", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create Concave Hull";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// convex control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "convex";

    /**
     * Compute convex hull
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.convex(collection);
        var inputs = {
            featurecollection: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create Convex Hull";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// destination control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "destination";

    /**
     * Find destination point from given point
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idBearing = ol3turf.utils.getName([name, "bearing"], control.prefix);
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idDistance = ol3turf.utils.getName([name, "distance"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather point seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var points = ol3turf.utils.getPoints(collection, 1, 1);
                var point = points[0];

                // Gather form inputs
                var distance = ol3turf.utils.getFormNumber(idDistance, "distance");
                var bearing = ol3turf.utils.getFormNumber(idBearing, "bearing");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.destination(point,
                        distance,
                        bearing,
                        units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    from: point,
                    distance: distance,
                    bearing: bearing,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);


            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idBearing, "Bearing", "Bearing angle (degrees)", "0", "any", "-180", "180"),
            ol3turf.utils.getControlNumber(idDistance, "Distance", "Distance from the starting point", "0", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Find destination point from given point";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// difference control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "difference";

    /**
     * Compute difference between two polygons
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var polygons = ol3turf.utils.getPolygons(collection, 2, 2);
        var poly1 = polygons[0];
        var poly2 = polygons[1];
        var output = turf.difference(poly1, poly2);
        var inputs = {
            poly1: poly1,
            poly2: poly2
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create Difference Polygon";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// distance control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "distance";

    /**
     * Find distance between points
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather points seleted
                var collection = ol3turf.utils.getCollection(control, 2, 2);
                var points = ol3turf.utils.getPoints(collection, 2, 2);
                var from = points[0];
                var to = points[1];

                // Gather form inputs
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.distance(from, to, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    from: from,
                    to: to,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Find distance between points";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// envelope control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "envelope";

    /**
     * Compute envelope
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.envelope(collection);
        var inputs = {
            fc: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Envelope";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// explode control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "explode";

    /**
     * Compute explode of feature collection
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.explode(collection);
        var inputs = {
            geojson: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Explode feature collection";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// flip control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "flip";

    /**
     * Compute feature coordinate flip
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.flip(collection);
        var inputs = {
            input: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Flip features coordinates";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// hexGrid control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "hex-grid";

    /**
     * Generate Hex Grid
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idCellSize = ol3turf.utils.getName([name, "cell-size"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idType = ol3turf.utils.getName([name, "type"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Gather form inputs
                var cellSize = ol3turf.utils.getFormNumber(idCellSize, "cell size");
                var type = ol3turf.utils.getFormString(idType, "grid type");
                var units = ol3turf.utils.getFormString(idUnits, "units");
                var isTriangles = (type === "triangles");

                // Collect polygons
                var bbox = turf.bbox(collection);
                var output = turf.hexGrid(bbox, cellSize, units, isTriangles);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    bbox: bbox,
                    cellSize: cellSize,
                    units: units,
                    triangles: isTriangles
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idCellSize, "Cell Size", "Dimension of cell", "1", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlSelect(idType, "Type", ol3turf.utils.getOptionsGrids()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Generate Hex Grid";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// inside control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "inside";

    /**
     * Compute if point is inside polygon
     * @private
     */
    var action = function (control) {

        // Gather point and polygon selected
        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 1, 1);
        var polygons = ol3turf.utils.getPolygonsAll(collection, 1, 1);
        var point = points[0];
        var polygon = polygons[0];

        var output = turf.inside(point, polygon);
        var inputs = {
            point: point,
            polygon: polygon
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Point inside polygon?";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// intersect control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "intersect";

    /**
     * Compute intersection of two polygons
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var polygons = ol3turf.utils.getPolygonsAll(collection, 2, 2);

        var poly1 = polygons[0];
        var poly2 = polygons[1];
        var output = turf.intersect(poly1, poly2);
        var inputs = {
            poly1: poly1,
            poly2: poly2
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);


    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create Intersection Polygon";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// isolines control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "isolines";

    /**
     * Create isolines
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idBreaks = ol3turf.utils.getName([name, "breaks"], control.prefix);
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idResolution = ol3turf.utils.getName([name, "resolution"], control.prefix);
        var idZ = ol3turf.utils.getName([name, "z"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Gather form inputs
                var breaks = ol3turf.utils.getFormArray(idBreaks, "breaks");
                var resolution = ol3turf.utils.getFormNumber(idResolution, "resolution");
                var z = ol3turf.utils.getFormString(idZ, "z");

                // Generate isolines features
                var output = turf.isolines(collection, z, resolution, breaks);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    points: collection,
                    z: z,
                    resolution: resolution,
                    breaks: breaks
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idResolution, "Resolution", "Resolution of the underlying grid", "1", "any", "0.01"),
            ol3turf.utils.getControlText(idZ, "Z Property", "Property name in points from which z-values will be pulled"),
            ol3turf.utils.getControlText(idBreaks, "Breaks", "Comma separated list of where to draw contours"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create isolines";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// kinks control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "kinks";

    /**
     * Compute polygon kinks
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, 1);
        var polygons = ol3turf.utils.getPolygons(collection, 1, 1);
        var polygon = polygons[0];
        var output = turf.kinks(polygon);
        if (output.features.length === 0) {
            throw new Error("No kinks found.");
        }
        var inputs = {
            polygon: polygon
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create polygon self-intersections";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// lineDistance control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "line-distance";

    /**
     * Compute length of feature
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Gather form inputs
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Compute length
                var output = turf.lineDistance(collection, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    line: collection,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Length";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// lineSlice control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "line-slice-along";

    /**
     * Compute line slice
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idStart = ol3turf.utils.getName([name, "start"], control.prefix);
        var idStop = ol3turf.utils.getName([name, "stop"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather line seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var lines = ol3turf.utils.getLines(collection, 1, 1);
                var line = lines[0];

                // Gather form inputs
                var start = ol3turf.utils.getFormNumber(idStart, "start");
                var stop = ol3turf.utils.getFormNumber(idStop, "stop");

                var isOrdered = (start < stop);
                if (isOrdered !== true) {
                    throw new Error("Start must be less than stop");
                }

                // Truncate at line length otherwise lineSliceAlong fails
                var units = ol3turf.utils.getFormString(idUnits, "units");
                var length = turf.lineDistance(line, units);
                if (start > length) {
                    throw new Error("Start must be less than line length");
                }
                if (stop > length) {
                    throw new Error("Stop must be less than line length");
                }

                // Collect polygons
                var output = turf.lineSliceAlong(line, start, stop, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    line: line,
                    start: start,
                    stop: stop,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idStart, "Start", "Starting distance along the line", "0", "any", "0"),
            ol3turf.utils.getControlNumber(idStop, "Stop", "Stoping distance along the line", "0", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create line slice";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// midpoint control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "midpoint";

    /**
     * Compute midpoint
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 2, 2);
        var from = points[0];
        var to = points[1];
        var output = turf.midpoint(from, to);
        var inputs = {
            from: from,
            to: to
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Midpoint";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// nearest control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "nearest";

    /**
     * Compute nearest point
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, Infinity);
        var numPoints = collection.features.length;
        var pts = ol3turf.utils.getPoints(collection, numPoints, numPoints);
        var targetPoint = pts[0];
        var points = turf.featureCollection(pts.slice(1));

        var output = turf.nearest(targetPoint, points);
        var inputs = {
            targetPoint: targetPoint,
            points: points
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Find set point nearest to first point";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// planepoint control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "planepoint";

    /**
     * Triangulate a point in a plane
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var pt = ol3turf.utils.getPoints(collection, 1, 1);
        var tr = ol3turf.utils.getPolygons(collection, 1, 1);
        var point = pt[0];
        var triangle = tr[0];

        var output = turf.planepoint(point, triangle);
        var inputs = {
            point: point,
            triangle: triangle
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Triangulate a point in a plane";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// pointGrid control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "point-grid";

    /**
     * Generate Point Grid
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idCellSize = ol3turf.utils.getName([name, "cell-size"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Gather form inputs
                var cellSize = ol3turf.utils.getFormNumber(idCellSize, "cell size");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var bbox = turf.bbox(collection);
                var output = turf.pointGrid(bbox, cellSize, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    bbox: bbox,
                    cellSize: cellSize,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idCellSize, "Cell Size", "Dimension of cell", "1", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Generate Point Grid";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// pointOnLine control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "point-on-line";

    /**
     * Compute point on line
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 1, 1);
        var lines = ol3turf.utils.getLines(collection, 1, 1);
        var line = lines[0];
        var point = points[0];

        var output = turf.pointOnLine(line, point);
        var inputs = {
            line: line,
            point: point
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Project point on line";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// pointOnSurface control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "point-on-surface";

    /**
     * Compute pointOnSurface
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.pointOnSurface(collection);
        var inputs = {
            fc: collection
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Point on Surface";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// random control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "random";

    /**
     * Create random data
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idCount = ol3turf.utils.getName([name, "count"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idMaxRadialLength = ol3turf.utils.getName([name, "max-radial-length"], control.prefix);
        var idNumVertices = ol3turf.utils.getName([name, "num-vertices"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idType = ol3turf.utils.getName([name, "type"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var bbox = null;
                var collection = ol3turf.utils.getCollection(control, 0, Infinity);
                if (collection.features.length !== 0) {
                    bbox = turf.bbox(collection);
                }

                // Get form inputs
                var count = ol3turf.utils.getFormInteger(idCount, "count");
                var maxRadialLength = ol3turf.utils.getFormInteger(idMaxRadialLength, "maximum radial length");
                var numVertices = ol3turf.utils.getFormInteger(idNumVertices, "number of vertices");
                var type = ol3turf.utils.getFormString(idType, "type");

                // Generate random polygons
                var options = {
                    max_radial_length: maxRadialLength,
                    num_vertices: numVertices
                };
                if (bbox !== null) {
                    options.bbox = bbox;
                }
                var output = turf.random(type, count, options);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    type: type,
                    count: count,
                    options: options
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlSelect(idType, "Type", ol3turf.utils.getOptionsGeometry()),
            ol3turf.utils.getControlNumber(idCount, "Count", "How many geometries should be generated", "1", "1", "1"),
            ol3turf.utils.getControlNumber(idNumVertices, "# Vertices", "Used only for polygon type", "10", "1", "3"),
            ol3turf.utils.getControlNumber(idMaxRadialLength, "Max Length", "Maximum degrees a polygon can extent outwards from its center (degrees)", "10", "0.01", "0", "180"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create random data";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// sample control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "sample";

    /**
     * Randomly sample features
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idCount = ol3turf.utils.getName([name, "count"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Get form inputs
                var count = ol3turf.utils.getFormInteger(idCount, "count");
                if (count > collection.features.length) {
                    throw new Error("Feature count must be greater than sampling count.");
                }

                // Generate sample features
                var output = turf.sample(collection, count);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    featurecollection: collection,
                    num: count
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idCount, "Count", "Number of random features to sample", "1", "1", "1"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Randomly sample features";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// simplify control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "simplify";

    /**
     * Simplify shape
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idQuality = ol3turf.utils.getName([name, "quality"], control.prefix);
        var idTolerance = ol3turf.utils.getName([name, "tolerance"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Get form inputs
                var tolerance = ol3turf.utils.getFormNumber(idTolerance, "tolerance");
                var quality = ol3turf.utils.getFormString(idQuality, "quality");
                var highQuality = (quality === "high");

                // Collect polygons
                var output = turf.simplify(collection, tolerance, highQuality);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    feature: collection,
                    tolerance: tolerance,
                    highQuality: highQuality
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idTolerance, "Tolerance", "Simplification tolerance", "1", "0.01", "0"),
            ol3turf.utils.getControlSelect(idQuality, "Quality", ol3turf.utils.getOptionsQuality()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Simplify shape";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// square control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "square";

    /**
     * Compute square
     * @private
     */
    var action = function (control) {

        // Gather selected features
        var collection = ol3turf.utils.getCollection(control, 1, Infinity);
        var bbox = turf.bbox(collection);
        var square = turf.square(bbox);

        var output = turf.bboxPolygon(square);
        var inputs = {
            bbox: bbox
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create Square";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// squareGrid control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "square-grid";

    /**
     * Generate Square Grid
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idCellSize = ol3turf.utils.getName([name, "cell-size"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Get form inputs
                var cellSize = ol3turf.utils.getFormNumber(idCellSize, "cell size");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var bbox = turf.bbox(collection);
                var output = turf.squareGrid(bbox, cellSize, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    bbox: bbox,
                    cellSize: cellSize,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idCellSize, "Cell Size", "Dimension of cell", "1", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Generate Square Grid";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// tag control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "tag";

    /**
     * Collect point attributes within polygon
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idField = ol3turf.utils.getName([name, "field-property"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idOutField = ol3turf.utils.getName([name, "out-field-property"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 2, Infinity);
                var points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
                var numPolygons = collection.features.length - points.length;
                var polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

                // Get form inputs
                var field = ol3turf.utils.getFormString(idField, "field");
                var outField = ol3turf.utils.getFormString(idOutField, "out field");

                // Collect polygons
                var inPolygons = turf.featureCollection(polygons);
                var inPoints = turf.featureCollection(points);
                var output = turf.tag(inPoints, inPolygons, field, outField);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    points: inPoints,
                    polygons: inPolygons,
                    field: field,
                    outField: outField
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlText(idField, "Field", "Property in polygons to add to joined point features"),
            ol3turf.utils.getControlText(idOutField, "Out Field", "Property in points in which to store joined property from polygons"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Perform spatial join of points and polygons";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// tin control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "tin";

    /**
     * Compute tin mesh
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idZ = ol3turf.utils.getName([name, "z"], control.prefix);

        function onOK() {
            try {

                var collection = ol3turf.utils.getCollection(control, 3, Infinity);
                var numPoints = collection.features.length;
                var points = ol3turf.utils.getPoints(collection, numPoints, numPoints);
                collection = turf.featureCollection(points);

                // Get form inputs
                var z = ol3turf.utils.getFormString(idZ, "z");

                var output = turf.tin(collection, z);
                var inputs = {
                    points: collection,
                    z: z
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlText(idZ, "Z", "(Optional) Property from which to pull z values"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create TIN";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// tesselate control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "tesselate";

    /**
     * Compute tesselation
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, 1);
        var polygons = ol3turf.utils.getPolygons(collection, 1, 1);
        var polygon = polygons[0];

        var output = turf.tesselate(polygon);
        var inputs = {
            polygon: polygon
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create tesselation";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf */

//==================================================
// standard toolbars
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    /**
     * @namespace toolbars
     * @brief Standard toolbars
     * @memberof ol3turf
     */
    ol3turf.toolbars = ol3turf.toolbars || {};

    /**
     * @description Aggregation toolbar controls
     * @typedef {string[]} ToolbarAggregation
     * @memberOf ol3turf.toolbars
     * @property {string} collect collect control
     */

    /**
     * Aggregation toolbar
     * @memberof ol3turf.toolbars
     * @returns {ol3turf.toolbars.ToolbarAggregation} Control names for the aggregation toolbar
     */
    ol3turf.toolbars.aggregation = function () {
        return ["collect"];
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
     * @returns {ol3turf.toolbars.ToolbarClassification} Control names for the classification toolbar
     */
    ol3turf.toolbars.classification = function () {
        return ["nearest"];
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
     * @returns {ol3turf.toolbars.ToolbarData} Control names for the data toolbar
     */
    ol3turf.toolbars.data = function () {
        return [
            "random",
            "sample"
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
     * @returns {ol3turf.toolbars.ToolbarGrids} Control names for the grids toolbar
     */
    ol3turf.toolbars.grids = function () {
        return [
            "hex-grid",
            "point-grid",
            "square-grid",
            "triangle-grid",
            "tesselate"
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
     * @returns {ol3turf.toolbars.ToolbarInterpolation} Control names for the interpolation toolbar
     */
    ol3turf.toolbars.interpolation = function () {
        return [
            "isolines",
            "planepoint",
            "tin"
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
     * @returns {ol3turf.toolbars.ToolbarJoins} Control names for the joins toolbar
     */
    ol3turf.toolbars.joins = function () {
        return [
            "inside",
            "tag",
            "within"
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
     * @returns {ol3turf.toolbars.ToolbarMeasurement} Control names for the measurement toolbar
     */
    ol3turf.toolbars.measurement = function () {
        return [
            "distance",
            "line-distance",
            "area",
            "bearing",
            "center-of-mass",
            "center",
            "centroid",
            "midpoint",
            "point-on-surface",
            "envelope",
            "square",
            "circle",
            "along",
            "destination"
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
     * @returns {ol3turf.toolbars.ToolbarMisc} Control names for the miscellaneous toolbar
     */
    ol3turf.toolbars.misc = function () {
        return [
            "combine",
            "explode",
            "flip",
            "kinks",
            "line-slice-along",
            "point-on-line"
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
     * @returns {ol3turf.toolbars.ToolbarTransformation} Control names for the transformation toolbar
     */
    ol3turf.toolbars.transformation = function () {
        return [
            "bezier",
            "buffer",
            "concave",
            "convex",
            "difference",
            "intersect",
            "simplify",
            "union"
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
     * @returns {ol3turf.toolbars.ToolbarAll} Control names for all the controls
     */
    ol3turf.toolbars.all = function () {
        var all = [];
        all.push.apply(all, ol3turf.toolbars.measurement());
        all.push.apply(all, ol3turf.toolbars.transformation());
        all.push.apply(all, ol3turf.toolbars.misc());
        all.push.apply(all, ol3turf.toolbars.joins());
        all.push.apply(all, ol3turf.toolbars.classification());
        all.push.apply(all, ol3turf.toolbars.aggregation());
        all.push.apply(all, ol3turf.toolbars.data());
        all.push.apply(all, ol3turf.toolbars.interpolation());
        all.push.apply(all, ol3turf.toolbars.grids());
        return all;
    };

}(ol3turf || {}));


/*globals document, ol3turf, turf */

//==================================================
// triangleGrid control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "triangle-grid";

    /**
     * Generate Triangle Grid
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idCellSize = ol3turf.utils.getName([name, "cell-size"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Get form inputs
                var cellSize = ol3turf.utils.getFormNumber(idCellSize, "cell size");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var bbox = turf.bbox(collection);
                var output = turf.triangleGrid(bbox, cellSize, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    bbox: bbox,
                    cellSize: cellSize,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);

            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idCellSize, "Cell Size", "Dimension of cell", "1", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Generate Triangle Grid";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// union control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "union";

    /**
     * Compute union of two polygons
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var polygons = ol3turf.utils.getPolygons(collection, 2, 2);
        var poly1 = polygons[0];
        var poly2 = polygons[1];

        var output = turf.union(poly1, poly2);
        var inputs = {
            poly1: poly1,
            poly2: poly2
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create Union Polygon";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));


/*globals ol3turf, turf */

//==================================================
// within control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "within";

    /**
     * Compute points within polygons
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, Infinity);
        var pts = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
        var numPolygons = collection.features.length - pts.length;
        var polys = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

        var points = turf.featureCollection(pts);
        var polygons = turf.featureCollection(polys);

        var output = turf.within(points, polygons);
        if (output.features.length === 0) {
            throw new Error("No points found within.");
        }
        var inputs = {
            points: points,
            polygons: polygons
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Find points within polygons";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
