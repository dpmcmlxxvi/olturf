
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
