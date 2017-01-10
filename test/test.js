
/*globals afterEach, beforeEach, describe, document, expect, it, jQuery, ol,
    ol3turf, turf */

describe("ol.control.Turf", function () {

    "use strict";

    var map, selection, target, toolbar;
    var selector = "ol3-turf-test";

    /* Add test data */

    var fcArea = turf.featureCollection([
        turf.polygon([[[-67.031021, 10.458102],
                       [-67.031021, 10.533720],
                       [-66.929397, 10.533720],
                       [-66.929397, 10.458102],
                       [-67.031021, 10.458102]
                    ]]),
        turf.polygon([[[-66.919784, 10.397325],
                       [-66.919784, 10.513467],
                       [-66.805114, 10.513467],
                       [-66.805114, 10.397325],
                       [-66.919784, 10.397325]
                    ]])
    ]);

    var fcCenter = turf.featureCollection([
        turf.point([-97.522259, 35.469100]),
        turf.point([-97.502754, 35.463455]),
        turf.point([-97.508269, 35.463245]),
        turf.point([-97.516809, 35.465779]),
        turf.point([-97.515372, 35.467072]),
        turf.point([-97.509363, 35.463053]),
        turf.point([-97.511123, 35.466601]),
        turf.point([-97.518547, 35.469327]),
        turf.point([-97.519706, 35.469659]),
        turf.point([-97.517839, 35.466998]),
        turf.point([-97.508678, 35.464942]),
        turf.point([-97.514914, 35.463453])
    ]);

    var fcCenterOfMass = turf.featureCollection([
        turf.polygon([[
            [4.8542404174804690, 45.772582003744330],
            [4.8445844650268555, 45.777431068484894],
            [4.8454427719116210, 45.778658234059755],
            [4.8459148406982420, 45.779376562352425],
            [4.8466444015502920, 45.780214600331080],
            [4.8472452163696290, 45.780783261785930],
            [4.8480606079101560, 45.781381846525230],
            [4.8487043380737305, 45.781860709689640],
            [4.8495626449584950, 45.782489211351240],
            [4.8508930206298830, 45.783027921421970],
            [4.8520088195800770, 45.783746193418950],
            [4.8529958724975590, 45.784075398324866],
            [4.8538541793823240, 45.784434528732360],
            [4.8549699783325195, 45.784703875019750],
            [4.8556995391845700, 45.784793656826345],
            [4.8573303222656240, 45.784853511283764],
            [4.8582315444946290, 45.784943292849380],
            [4.8593044281005850, 45.784883438488365],
            [4.8583602905273440, 45.772941208184740],
            [4.8542404174804690, 45.772582003744330]
        ]])
    ]);

    var fcCollectPoints = turf.featureCollection([
        turf.point([5, 5], {population: 200}),
        turf.point([1, 3], {population: 600}),
        turf.point([14, 2], {population: 100}),
        turf.point([13, 1], {population: 200}),
        turf.point([19, 7], {population: 300})
    ]);

    var fcCollectPolygons = turf.featureCollection([
        turf.polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]),
        turf.polygon([[[10, 0], [20, 10], [20, 20], [20, 0], [10, 0]]])
    ]);

    var fcCombine = turf.featureCollection([
        turf.point([19.026432, 47.49134]),
        turf.point([19.074497, 47.509548])
    ]);

    var fcConcave = turf.featureCollection([
        turf.point([-63.601226, 44.642643]),
        turf.point([-63.591442, 44.651436]),
        turf.point([-63.580799, 44.648749]),
        turf.point([-63.573589, 44.641788]),
        turf.point([-63.587665, 44.645330]),
        turf.point([-63.595218, 44.647650])
    ]);

    var fcConvex = turf.featureCollection([
        turf.point([10.195312, 43.7552250]),
        turf.point([10.404052, 43.8424511]),
        turf.point([10.579833, 43.6599240]),
        turf.point([10.360107, 43.5166880]),
        turf.point([10.140380, 43.5883480]),
        turf.point([10.195312, 43.7552250])
    ]);

    var fcEnvelope = turf.featureCollection([
        turf.point([-75.343, 39.984], {name: "Location A"}),
        turf.point([-75.833, 39.284], {name: "Location B"}),
        turf.point([-75.534, 39.123], {name: "Location C"})
    ]);

    var fcIsolines = turf.random('point', 100, {bbox: [0, 30, 20, 50]});
    fcIsolines.features.forEach(function (feature) {
        feature.properties.z = Math.random() * 10;
    });

    var fcNearest = turf.featureCollection([
        turf.point([28.973865, 41.011122]),
        turf.point([28.948459, 41.024204]),
        turf.point([28.938674, 41.013324])
    ]);

    var fcPointOnSurface = turf.random('polygon');

    var fcSample = turf.random("points", 1000);

    var fcTagPoints = turf.featureCollection([
        turf.point([-77, 44]),
        turf.point([-77, 38])
    ]);

    var fcTagPolygons = turf.featureCollection([
        turf.polygon([[
            [-81, 41],
            [-81, 47],
            [-72, 47],
            [-72, 41],
            [-81, 41]
        ]], {pop: 3000}),
        turf.polygon([[
            [-81, 35],
            [-81, 41],
            [-72, 41],
            [-72, 35],
            [-81, 35]
        ]], {pop: 1000})
    ]);

    var fcTesselate = turf.featureCollection([
        turf.polygon([[
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0]
        ]])
    ]);

    var fcTin = turf.random('points', 30, {bbox: [50, 30, 70, 50]});
    fcTin.features.forEach(function (feature) {
        feature.properties.z = Math.floor(Math.random() * 9);
    });

    var fcWithinPoints = turf.featureCollection([
        turf.point([-46.6318, -23.5523]),
        turf.point([-46.6246, -23.5325]),
        turf.point([-46.6062, -23.5513]),
        turf.point([-46.6630, -23.5540]),
        turf.point([-46.6430, -23.5570])
    ]);

    var fcWithinPointsNotWithin = turf.featureCollection([
        turf.point([0, 0])
    ]);

    var fcWithinPolygon = turf.featureCollection([
        turf.polygon([[
            [-46.653, -23.543],
            [-46.634, -23.5346],
            [-46.613, -23.543],
            [-46.614, -23.559],
            [-46.631, -23.567],
            [-46.653, -23.560],
            [-46.653, -23.543]
        ]])
    ]);

    var line = turf.lineString([
        [0, 0],
        [0, 1]
    ]);

    var lineAlong = turf.lineString([
        [-77.031669, 38.878605],
        [-77.029609, 38.881946],
        [-77.020339, 38.884084],
        [-77.025661, 38.885821],
        [-77.021884, 38.889563],
        [-77.019824, 38.892368]
    ]);

    var lineBezier = turf.lineString([
        [-76.091308, 18.427501],
        [-76.695556, 18.729501],
        [-76.552734, 19.40443],
        [-74.61914, 19.134789],
        [-73.652343, 20.07657],
        [-73.157958, 20.210656]
    ], {"stroke": "#f00"});

    var lineLineDistance = turf.lineString([
        [-77.031669, 38.878605],
        [-77.029609, 38.881946],
        [-77.020339, 38.884084],
        [-77.025661, 38.885821],
        [-77.021884, 38.889563],
        [-77.019824, 38.892368]
    ]);

    var lineLineSliceAlong = turf.lineString([
        [ 7.6684570312500, 45.058001435398296],
        [ 9.2065429687500, 45.460130637921004],
        [11.3488769531250, 44.488668331394670],
        [12.1728515625000, 45.437008288673890],
        [12.5354003906250, 43.984910114046920],
        [12.4255371093750, 41.869560826994550],
        [14.2437744140625, 40.838749137964590],
        [14.7656250000000, 40.681679458715635]
    ]);

    var linePointOnLine = turf.lineString([
        [-77.031669, 38.878605],
        [-77.029609, 38.881946],
        [-77.020339, 38.884084],
        [-77.025661, 38.885821],
        [-77.021884, 38.889563],
        [-77.019824, 38.892368]
    ]);

    var multiPolygonInside = turf.multiPolygon([[[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]]]);

    var point = turf.point([0, 0]);

    var pointBearing1 = turf.point([-75.343, 39.984], {"marker-color": '#f00'});

    var pointBearing2 = turf.point([-75.534, 39.123], {"marker-color": '#0f0'});

    var pointBuffer = turf.point([-90.548630, 14.616599]);

    var pointCircle = turf.point([-75.343, 39.984], {"marker-color": "#0f0"});

    var pointDestination = turf.point([-75.343, 39.984], {"marker-color": "#0f0"});

    var pointFlip = turf.point([20.566406, 43.421008]);

    var pointFrom = turf.point([-75.343, 39.984]);

    var pointInside = turf.point([-111.467285, 40.75766], {"marker-color": "#f00"});

    var pointMidPoint1 = turf.point([144.834823, -37.771257]);

    var pointMidPoint2 = turf.point([145.14244, -37.830937]);

    var pointNearest = turf.point([28.965797, 41.010086], {"marker-color": "#0f0"});

    var pointPointOnLine = turf.point([-77.037076, 38.884017]);

    var pointPlanepoint = turf.point([-75.3221, 39.529]);

    var pointTo = turf.point([-75.534, 39.123]);

    var polygon = turf.polygon([[
        [0, 0],
        [0, 1],
        [1, 0],
        [0, 0]
    ]]);

    var polygonCentroid = turf.polygon([[
        [105.818939, 21.004714],
        [105.818939, 21.061754],
        [105.890007, 21.061754],
        [105.890007, 21.004714],
        [105.818939, 21.004714]
    ]]);

    var polygonDifference1 = turf.polygon([[
        [-46.738586, -23.596711],
        [-46.738586, -23.458207],
        [-46.560058, -23.458207],
        [-46.560058, -23.596711],
        [-46.738586, -23.596711]
    ]], {"fill": "#0f0"});

    var polygonDifference2 = turf.polygon([[
        [-46.650009, -23.631314],
        [-46.650009, -23.5237],
        [-46.509246, -23.5237],
        [-46.509246, -23.631314],
        [-46.650009, -23.631314]
    ]], {"fill": "#00f"});

    var polygonExplode = turf.polygon([[
        [177.434692, -17.77517],
        [177.402076, -17.779093],
        [177.38079, -17.803937],
        [177.40242, -17.826164],
        [177.438468, -17.824857],
        [177.454948, -17.796746],
        [177.434692, -17.77517]
    ]]);

    var polygonHexGrid = turf.polygon([[
        [-96, 31],
        [-84, 31],
        [-84, 40],
        [-96, 40],
        [-96, 31]
    ]]);

    var polygonInside = turf.polygon([[
        [-112.074279, 40.52215],
        [-112.074279, 40.853293],
        [-111.610107, 40.853293],
        [-111.610107, 40.52215],
        [-112.074279, 40.52215]
    ]]);

    var polygonIntersect1 = turf.polygon([[
        [-122.801742, 45.48565],
        [-122.801742, 45.60491],
        [-122.584762, 45.60491],
        [-122.584762, 45.48565],
        [-122.801742, 45.48565]
    ]], {"fill": "#0f0"});

    var polygonIntersect2 = turf.polygon([[
        [-122.520217, 45.535693],
        [-122.64038, 45.553967],
        [-122.720031, 45.526554],
        [-122.669906, 45.507309],
        [-122.723464, 45.446643],
        [-122.532577, 45.408574],
        [-122.487258, 45.477466],
        [-122.520217, 45.535693]
    ]], {"fill": "#00f"});

    var polygonKinks = turf.polygon([[
        [-12.034835, 8.901183],
        [-12.060413, 8.899826],
        [-12.03638, 8.873199],
        [-12.059383, 8.871418],
        [-12.034835, 8.901183]
    ]]);

    var polygonPlanepoint = turf.polygon([[
        [-75.1221, 39.57],
        [-75.58, 39.18],
        [-75.97, 39.86],
        [-75.1221, 39.57]
    ]], {"a": 11, "b": 122, "c": 44});

    var polygonPointGrid = turf.polygon([[
        [-70.823364, -33.553984],
        [-70.473175, -33.553984],
        [-70.473175, -33.302986],
        [-70.823364, -33.302986],
        [-70.823364, -33.553984]
    ]]);

    var polygonRandom = turf.polygon([[
        [-70, 40],
        [-60, 40],
        [-60, 60],
        [-70, 60],
        [-70, 40]
    ]]);

    var polygonSimplify = turf.polygon([[
        [-70.603637, -33.399918],
        [-70.614624, -33.395332],
        [-70.639343, -33.392466],
        [-70.659942, -33.394759],
        [-70.683975, -33.404504],
        [-70.697021, -33.419406],
        [-70.701141, -33.434306],
        [-70.700454, -33.446339],
        [-70.694274, -33.458369],
        [-70.682601, -33.465816],
        [-70.668869, -33.472117],
        [-70.646209, -33.473835],
        [-70.624923, -33.472117],
        [-70.609817, -33.468107],
        [-70.595397, -33.458369],
        [-70.587158, -33.442901],
        [-70.587158, -33.426283],
        [-70.590591, -33.414248],
        [-70.594711, -33.406224],
        [-70.603637, -33.399918]
    ]]);

    var polygonSquare = turf.polygon([[
        [-20, -20],
        [-15, -20],
        [-15, 0],
        [-20, 0],
        [-20, -20]
    ]]);

    var polygonSquareGrid = turf.polygon([[
        [-96, 31],
        [-84, 31],
        [-84, 40],
        [-96, 40],
        [-96, 31]
    ]]);

    var polygonTriangleGrid = turf.polygon([[
        [-96, 31],
        [-84, 31],
        [-84, 40],
        [-96, 40],
        [-96, 31]
    ]]);

    var polygonUnion1 = turf.polygon([[
        [-82.574787, 35.594087],
        [-82.574787, 35.615581],
        [-82.545261, 35.615581],
        [-82.545261, 35.594087],
        [-82.574787, 35.594087]
    ]], {"fill": "#0f0"});

    var polygonUnion2 = turf.polygon([[
        [-82.560024, 35.585153],
        [-82.560024, 35.602602],
        [-82.52964, 35.602602],
        [-82.52964, 35.585153],
        [-82.560024, 35.585153]
    ]], {"fill": "#00f"});

    /*
     * Add turf features to ol.Map
     * @param features Features to addControl
     * @returns ol.layer.Vector of added features
     */
    function addFeatures(features) {

        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(features, {
                    dataProjection: ol3turf.PROJECTION_TURF,
                    featureProjection: ol3turf.PROJECTION_OL3
                })
            })
        });
        map.addLayer(layer);
        return layer;

    }

    /*
     * Copy attribute array of objects
     * @param attributes Attribute object to copy
     * @returns Copy of attributes array
     */
    function copyAttributes(attributes) {
        return jQuery.extend(true, [], attributes);
    }

    /*
     * Check popup message is valid
     */
    function testCheckMessage() {
        expect(jQuery(ol3turf.utils.getClass(["popup"])).length).to.be(1);
        expect(jQuery(ol3turf.utils.getClass([
            "popup", "message"
        ]))[0].innerHTML.length).to.be.greaterThan(0);
        jQuery(ol3turf.utils.getClass(["popup", "button"])).click();
    }

    /*
     * Click on a control
     * @param name Control name
     */
    function testOpen(name) {
        // Control exists
        expect(jQuery(ol3turf.utils.getClass([name])).length).to.be(1);
        // Open form
        jQuery(ol3turf.utils.getClass([name])).click();
    }

    /*
     * Open a control form and check it exists
     * @param name Control name
     * @param prefix Form ID prefix
     * @returns Opened form
     */
    function testOpenAndCheckForm(name, prefix) {
        testOpen(name);
        var form = jQuery(ol3turf.utils.getId([name, "form"], prefix));
        expect(form.length).to.be(1);
        return form;
    }

    /*
     * Check cancel is selected
     * @param name Control name
     * @param prefix Form ID prefix
     */
    function testCancel(name, prefix) {
        var form = testOpenAndCheckForm(name, prefix);
        var id = form.selector;
        form.find(ol3turf.utils.getElement("input", [name, "cancel"], prefix)).click();
        expect(jQuery(id).length).to.be(0);
    }

    /*
     * Select features, select control, and check it returns popup message
     * @param name Control name
     * @param features Array of features to select
     * @param numLayers Number of layers expected
     * @param check True if error message expected otherwise false
     */
    function testControl(name, features, numLayers, check) {
        features.forEach(function (feature) {
            var layer = addFeatures(feature);
            selection.getFeatures().extend(layer.getSource().getFeatures());
        });
        testOpen(name);
        expect(map.getLayers().getLength()).to.be(numLayers);
        if (check) {
            testCheckMessage();
        }
    }

    /*
     * Select features, open the form, then select OK
     * @param name Control name
     * @param features Array of features to select
     * @param attributes Array of attributes to set in form
     * @param numLayers Number of layers expected
     * @param check True if error message expected otherwise false
     */
    function testForm(name, features, attributes, numLayers, check) {
        features.forEach(function (feature) {
            var layer = addFeatures(feature);
            selection.getFeatures().extend(layer.getSource().getFeatures());
        });
        var form = testOpenAndCheckForm(name, selector);
        attributes.forEach(function (attribute) {
            form.find(ol3turf.utils.getElement(attribute.type, [name, attribute.key], selector)).val(attribute.value);
        });
        form.find(ol3turf.utils.getElement("input", [name, "ok"], selector)).click();
        expect(map.getLayers().getLength()).to.be(numLayers);
        if (check) {
            testCheckMessage();
        }
    }

    beforeEach(function () {
        target = document.createElement("div");
        document.body.appendChild(target);
        toolbar = new ol.control.Turf({ol3turf: {prefix: selector}});
        selection = new ol.interaction.Select();
        map = new ol.Map({
            target: target,
            layers: [],
            controls: [toolbar],
            interactions: [selection]
        });
    });

    afterEach(function () {
        document.body.removeChild(target);
        map = null;
        selection = null;
        target = null;
        toolbar = null;
    });

    describe("Creation", function () {
        it("Toolbar created on map", function () {
            expect(jQuery(ol3turf.utils.getClass(["toolbar"])).length).to.be(1);
        });
    });

    describe("Removal", function () {
        it("Toolbar removed from map", function () {
            map.removeControl(toolbar);
            expect(jQuery(ol3turf.utils.getClass(["toolbar"])).length).to.be(0);
        });
    });

    describe("Controls", function () {
        it("Toolbar contains the expected number of controls", function () {
            expect(jQuery(ol3turf.utils.getClass(["toolbar"])).children().length).to.be(43);
        });
    });

    describe("Options", function () {
        it("Multiple toolbars created on map", function () {
            map.addControl(new ol.control.Turf());
            expect(jQuery(ol3turf.utils.getClass(["toolbar"])).length).to.be(2);
        });
    });

    describe("along", function () {
        var name = this.title;
        var features = [lineAlong];
        var attributes = [
            {
                type: "input",
                key: "distance",
                value: "1"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid feature selected", function () {
            testForm(name, [point], attributes, 1, true);
        });
        it("Control detects too many features selected", function () {
            testForm(name, [point, lineAlong], attributes, 2, true);
        });
        it("Control detects invalid distance", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("area", function () {
        var name = this.title;
        var features = [fcArea];
        it("Control displays feature area", function () {
            testControl(name, features, 1, true);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("bearing", function () {
        var name = this.title;
        var features = [pointBearing1, pointBearing2];
        it("Control displays features bearing", function () {
            testControl(name, features, 2, true);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [point, pointBearing1, pointBearing2], 3, true);
        });
    });

    describe("bezier", function () {
        var name = this.title;
        var features = [lineBezier];
        var attributes = [
            {
                type: "input",
                key: "resolution",
                value: "10000"
            },
            {
                type: "input",
                key: "sharpness",
                value: "0.85"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid feature selected", function () {
            testForm(name, [point], attributes, 1, true);
        });
        it("Control detects too many features selected", function () {
            testForm(name, [line, lineBezier], attributes, 2, true);
        });
        it("Control detects invalid resolution", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid sharpness", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("buffer", function () {
        var name = this.title;
        var features = [pointBuffer];
        var attributes = [
            {
                type: "input",
                key: "distance",
                value: "500"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid distance", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("center", function () {
        var name = this.title;
        var features = [fcCenter];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("center-of-mass", function () {
        var name = this.title;
        var features = [fcCenterOfMass];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("centroid", function () {
        var name = this.title;
        var features = [polygonCentroid];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("circle", function () {
        var name = this.title;
        var features = [pointCircle];
        var attributes = [
            {
                type: "input",
                key: "radius",
                value: "5"
            },
            {
                type: "input",
                key: "steps",
                value: "10"
            },
            {
                type: "select",
                key: "units",
                value: "kilometers"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects too many features selected", function () {
            testForm(name, [point, pointCircle], attributes, 2, true);
        });
        it("Control detects invalid radius", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid steps", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("collect", function () {
        var name = this.title;
        var features = [fcCollectPoints, fcCollectPolygons];
        var attributes = [
            {
                type: "input",
                key: "in-property",
                value: "population"
            },
            {
                type: "input",
                key: "out-property",
                value: "values"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 3, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects no point selected", function () {
            testForm(name, [fcCollectPolygons], attributes, 1, true);
        });
        it("Control detects no polygon selected", function () {
            testForm(name, [fcCollectPoints], attributes, 1, true);
        });
        it("Control detects invalid in-property", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "";
            testForm(name, features, attrs, 2, true);
        });
        it("Control detects invalid out-property", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "";
            testForm(name, features, attrs, 2, true);
        });
    });

    describe("combine", function () {
        var name = this.title;
        var features = [fcCombine];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("concave", function () {
        var name = this.title;
        var features = [fcConcave];
        var attributes = [
            {
                type: "input",
                key: "max-edge",
                value: "1"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid feature selected", function () {
            testForm(name, [polygon], attributes, 1, true);
        });
        it("Control detects invalid max-edge", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("control", function () {
        // Control to test generic toolbar events
        var name = "along";
        var features = [lineAlong];
        var attributes = [
            {
                type: "input",
                key: "distance",
                value: "1"
            }
        ];
        it("Base class is not a valid control", function () {
            var control = new ol3turf.Control();
            control.toolbar = toolbar;
            control.run();
            testCheckMessage();
        });
        it("Control without an action is not a valid control", function () {
            var control = ol3turf.Control.create(toolbar, selector, "test-control", "test control");
            control.run();
            testCheckMessage();
        });
        it("Control without toolbar does not have a valid map associated", function () {
            var control = new ol3turf.Control();
            expect(control.getMap()).to.be(null);
        });
        it("Control with toolbar not added to map does not have a valid map", function () {
            var control = new ol3turf.Control();
            control.toolbar = new ol.control.Turf();
            expect(control.getMap()).to.be(null);
        });
        it("Control with invalid map has no selectors associated with it", function () {
            var control = new ol3turf.Control();
            control.toolbar = new ol.control.Turf();
            var selectors = control.getSelectors();
            expect(selectors).to.be.an('array');
            expect(selectors).to.be.empty();
        });
        it("Control showing form without specifying form id creates a new form", function () {
            var control = ol3turf.Control.create(toolbar, selector, "test-control", "test control");
            control.showForm([]);
            testOpen("form");
        });
        it("Element with default prefix used if no prefix provided", function () {
            var element = ol3turf.utils.getElement("input", ["test"]);
            expect(element).to.be("input[name='ol3-turf-test']");
        });
        it("ID with default prefix used if no prefix provided", function () {
            var id = ol3turf.utils.getId(["test"]);
            expect(id).to.be("#ol3-turf-test");
        });
        it("Sets a form position based on a left vertical toolbar", function () {
            var height = jQuery(ol3turf.utils.getClass(["toolbar"])).css("height");
            jQuery(map.getTargetElement()).css("height", (10 * parseInt(height, 10)).toString() + "px");
            jQuery(ol3turf.utils.getClass(["control"])).css("float", "none");
            testForm(name, features, attributes, 2, false);
        });
        it("Sets a form position based on a right vertical toolbar", function () {
            var height = jQuery(ol3turf.utils.getClass(["toolbar"])).css("height");
            jQuery(map.getTargetElement()).css("height", (10 * parseInt(height, 10)).toString() + "px");
            var right = map.getTargetElement().getBoundingClientRect().right;
            jQuery(ol3turf.utils.getClass(["control"])).css("float", "none");
            jQuery(ol3turf.utils.getClass(["toolbar"])).css("left", right.toString() + "px");
            testForm(name, features, attributes, 2, false);
        });
        it("Sets a form position based on a right vertical toolbar out of viewport", function () {
            var height = jQuery(ol3turf.utils.getClass(["toolbar"])).css("height");
            jQuery(map.getTargetElement()).css("height", (10 * parseInt(height, 10)).toString() + "px");
            var right = 10 * map.getTargetElement().getBoundingClientRect().right;
            jQuery(ol3turf.utils.getClass(["control"])).css("float", "none");
            jQuery(ol3turf.utils.getClass(["toolbar"])).css("left", right.toString() + "px");
            testForm(name, features, attributes, 2, false);
        });
        it("Sets a form position based on toolbar being near top of map", function () {
            var height = jQuery(ol3turf.utils.getClass(["toolbar"])).css("height");
            jQuery(map.getTargetElement()).css("height", (10 * parseInt(height, 10)).toString() + "px");
            jQuery(ol3turf.utils.getClass(["toolbar"])).css("top", "0px");
            testForm(name, features, attributes, 2, false);
        });
        it("Sets a form position based on toolbar being near bottom of map", function () {
            var height = jQuery(ol3turf.utils.getClass(["toolbar"])).css("height");
            jQuery(map.getTargetElement()).css("height", (10 * parseInt(height, 10)).toString() + "px");
            var bottom = map.getTargetElement().getBoundingClientRect().bottom;
            jQuery(ol3turf.utils.getClass(["toolbar"])).css("top", bottom.toString() + "px");
            testForm(name, features, attributes, 2, false);
        });
        it("Sets a form position of a bottom toolbar and map out of viewport", function () {
            var height = jQuery(ol3turf.utils.getClass(["toolbar"])).css("height");
            jQuery(map.getTargetElement()).css("height", (10 * parseInt(height, 10)).toString() + "px");
            var bottom = 10 * map.getTargetElement().getBoundingClientRect().bottom;
            jQuery(ol3turf.utils.getClass(["toolbar"])).css("top", bottom.toString() + "px");
            testForm(name, features, attributes, 2, false);
        });
    });

    describe("convex", function () {
        var name = this.title;
        var features = [fcConvex];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("destination", function () {
        var name = this.title;
        var features = [pointDestination];
        var attributes = [
            {
                type: "input",
                key: "bearing",
                value: "90"
            },
            {
                type: "input",
                key: "distance",
                value: "50"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid feature selected", function () {
            testForm(name, [polygon], attributes, 1, true);
        });
        it("Control detects too many features selected", function () {
            testForm(name, [point, pointDestination], attributes, 2, true);
        });
        it("Control detects invalid bearing", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid distance", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("difference", function () {
        var name = this.title;
        var features = [polygonDifference1, polygonDifference2];
        it("Control creates a feature", function () {
            testControl(name, features, 3, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [polygon, polygonDifference1, polygonDifference2], 3, true);
        });
    });

    describe("distance", function () {
        var name = this.title;
        var features = [pointFrom, pointTo];
        var attributes = [
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control displays features distance", function () {
            testForm(name, features, attributes, 2, true);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects too many features selected", function () {
            testForm(name, [point, pointFrom, pointTo], attributes, 3, true);
        });
    });

    describe("envelope", function () {
        var name = this.title;
        var features = [fcEnvelope];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("explode", function () {
        var name = this.title;
        var features = [polygonExplode];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("flip", function () {
        var name = this.title;
        var features = [pointFlip];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("form", function () {
        it("Invalid parent not found", function () {
            expect(ol3turf.form).withArgs("ol3-turf-invalid").to.throwException();
        });
        it("Invalid form id", function () {
            expect(ol3turf.form).withArgs({}).to.throwException();
        });
        it("Invalid controls", function () {
            expect(ol3turf.form).withArgs({}, "ol3-turf-invalid").to.throwException();
        });
    });

    describe("hex-grid", function () {
        var name = this.title;
        var features = [polygonHexGrid];
        var attributes = [
            {
                type: "input",
                key: "cell-size",
                value: "50"
            },
            {
                type: "select",
                key: "type",
                value: "hexagons"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, false);
        });
        it("Control detects invalid cell size", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("inside", function () {
        var name = this.title;
        var features = [pointInside, polygonInside];
        it("Control displays if point is inside polygon", function () {
            testControl(name, features, 2, true);
        });
        it("Control displays if point is inside multipolygon", function () {
            testControl(name, [pointInside, multiPolygonInside], 2, true);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects no point selected", function () {
            testControl(name, [line, polygonInside], 2, true);
        });
        it("Control detects no polygon selected", function () {
            testControl(name, [pointInside, line], 2, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [point, pointInside, polygonInside], 3, true);
        });
    });

    describe("intersect", function () {
        var name = this.title;
        var features = [polygonIntersect1, polygonIntersect2];
        it("Control creates a feature", function () {
            testControl(name, features, 3, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, false);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [polygon, polygonIntersect1, polygonIntersect2], 3, true);
        });
    });

    describe("isolines", function () {
        var name = this.title;
        var features = [fcIsolines];
        var attributes = [
            {
                type: "input",
                key: "breaks",
                value: "0,1,2,3,4,5,6,7,8,9,10"
            },
            {
                type: "input",
                key: "resolution",
                value: "15"
            },
            {
                type: "input",
                key: "z",
                value: "z"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid breaks", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid breaks numbers", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "1,a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid resolution", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid z", function () {
            var attrs = copyAttributes(attributes);
            attrs[2].value = "";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("kinks", function () {
        var name = this.title;
        var features = [polygonKinks];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects invalid feature selected", function () {
            testControl(name, [point], 1, true);
        });
        it("Control detects no kinks found", function () {
            testControl(name, [polygon], 1, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [polygon, polygonKinks], 2, true);
        });
    });

    describe("line-distance", function () {
        var name = this.title;
        var features = [lineLineDistance];
        var attributes = [
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control displays line distance", function () {
            testForm(name, features, attributes, 1, true);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
    });

    describe("line-slice-along", function () {
        var name = this.title;
        var features = [lineLineSliceAlong];
        var attributes = [
            {
                type: "input",
                key: "start",
                value: "12.5"
            },
            {
                type: "input",
                key: "stop",
                value: "25"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects line not selected", function () {
            testForm(name, [polygon], attributes, 1, true);
        });
        it("Control detects too many features selected", function () {
            testForm(name, [line, lineLineSliceAlong], attributes, 2, true);
        });
        it("Control detects invalid start", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid stop", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects start > stop", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "1";
            attrs[1].value = "0";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects start >= length", function () {
            var length = turf.lineDistance(lineLineSliceAlong);
            var attrs = copyAttributes(attributes);
            attrs[0].value = length.toString();
            attrs[1].value = (2 * length).toString();
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects stop >= length", function () {
            var length = turf.lineDistance(lineLineSliceAlong);
            var attrs = copyAttributes(attributes);
            attrs[0].value = "0";
            attrs[1].value = length.toString();
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("midpoint", function () {
        var name = this.title;
        var features = [pointMidPoint1, pointMidPoint2];
        it("Control creates a feature", function () {
            testControl(name, features, 3, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [point, pointMidPoint1, pointMidPoint2], 3, true);
        });
    });

    describe("nearest", function () {
        var name = this.title;
        var features = [pointNearest, fcNearest];
        it("Control creates a feature", function () {
            testControl(name, features, 3, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects non-point selected", function () {
            testControl(name, [line, polygon], 2, true);
        });
    });

    describe("planepoint", function () {
        var name = this.title;
        var features = [pointPlanepoint, polygonPlanepoint];
        it("Control interpolates point", function () {
            testControl(name, features, 2, true);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects single point not selected", function () {
            testControl(name, [line, polygonPlanepoint], 2, true);
        });
        it("Control detects single polygon not selected", function () {
            testControl(name, [pointPlanepoint, line], 2, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [point, pointPlanepoint, polygonPlanepoint], 3, true);
        });
    });

    describe("point-grid", function () {
        var name = this.title;
        var features = [polygonPointGrid];
        var attributes = [
            {
                type: "input",
                key: "cell-size",
                value: "3"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid cell size", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("point-on-line", function () {
        var name = this.title;
        var features = [pointPointOnLine, linePointOnLine];
        it("Control creates a feature", function () {
            testControl(name, features, 3, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects no point selected", function () {
            testControl(name, [polygon, linePointOnLine], 2, true);
        });
        it("Control detects no line selected", function () {
            testControl(name, [pointPointOnLine, polygon], 2, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [point, pointPointOnLine, linePointOnLine], 3, true);
        });
    });

    describe("point-on-surface", function () {
        var name = this.title;
        var features = [fcPointOnSurface];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("popup", function () {
        it("Custom callback invoked.", function () {
            var count = 0;
            var callback = function () {
                count = count + 1;
            };
            var parent = toolbar.ol3turf.element.parentNode;
            var attributes = {
                style: {
                    visibility: "hidden"
                }
            };
            ol3turf.popup("test popup", callback, parent, attributes);
            testCheckMessage();
            expect(count).to.be(1);
        });
    });

    describe("random", function () {
        var name = this.title;
        var features = [polygonRandom];
        var attributes = [
            {
                type: "input",
                key: "count",
                value: "100"
            },
            {
                type: "input",
                key: "num-vertices",
                value: "10"
            },
            {
                type: "input",
                key: "max-radial-length",
                value: "10"
            },
            {
                type: "select",
                key: "type",
                value: "points"
            }
        ];
        it("Control creates a set of points", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control creates a polygon", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "4";
            attrs[3].value = "polygons";
            testForm(name, features, attrs, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects invalid count", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid number of vertices", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects invalid maximum radial length", function () {
            var attrs = copyAttributes(attributes);
            attrs[2].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("sample", function () {
        var name = this.title;
        var features = [fcSample];
        var attributes = [
            {
                type: "input",
                key: "count",
                value: "100"
            }
        ];
        it("Control creates a set of sampled points", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detect no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid count", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
        it("Control detects sampling count is larger than feature count", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = (fcSample.features.length + 1).toString();
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("simplify", function () {
        var name = this.title;
        var features = [polygonSimplify];
        var attributes = [
            {
                type: "input",
                key: "tolerance",
                value: "0.01"
            },
            {
                type: "select",
                key: "quality",
                value: "low"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid tolerance", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("square", function () {
        var name = this.title;
        var features = [polygonSquare];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
    });

    describe("square-grid", function () {
        var name = this.title;
        var features = [polygonSquareGrid];
        var attributes = [
            {
                type: "input",
                key: "cell-size",
                value: "10"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid cell size", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "a";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("tag", function () {
        var name = this.title;
        var features = [fcTagPoints, fcTagPolygons];
        var attributes = [
            {
                type: "input",
                key: "field-property",
                value: "pop"
            },
            {
                type: "input",
                key: "out-field-property",
                value: "population"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 3, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects no points selected", function () {
            testForm(name, [line, fcTagPolygons], attributes, 2, true);
        });
        it("Control detects no polygons selected", function () {
            testForm(name, [fcTagPoints, line], attributes, 2, true);
        });
        it("Control detects invalid field property", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "";
            testForm(name, features, attrs, 2, true);
        });
        it("Control detects invalid output field property", function () {
            var attrs = copyAttributes(attributes);
            attrs[1].value = "";
            testForm(name, features, attrs, 2, true);
        });
    });

    describe("tesselate", function () {
        var name = this.title;
        var features = [fcTesselate];
        it("Control creates a feature", function () {
            testControl(name, features, 2, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [polygon, fcTesselate], 2, true);
        });
    });

    describe("tin", function () {
        var name = this.title;
        var features = [fcTin];
        var attributes = [
            {
                type: "input",
                key: "z",
                value: "z"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects invalid number of points", function () {
            testForm(name, [turf.featureCollection([point])], attributes, 1, true);
        });
        it("Control detects invalid feature", function () {
            testForm(name, [turf.featureCollection([line, line, line])], attributes, 1, true);
        });
    });

    describe("triangle-grid", function () {
        var name = this.title;
        var features = [polygonTriangleGrid];
        var attributes = [
            {
                type: "input",
                key: "cell-size",
                value: "10"
            },
            {
                type: "select",
                key: "units",
                value: "miles"
            }
        ];
        it("Control creates a feature", function () {
            testForm(name, features, attributes, 2, false);
        });
        it("Control is canceled", function () {
            testCancel(name, selector);
        });
        it("Control detects no feature selected", function () {
            testForm(name, [], attributes, 0, true);
        });
        it("Control detects invalid cell size", function () {
            var attrs = copyAttributes(attributes);
            attrs[0].value = "";
            testForm(name, features, attrs, 1, true);
        });
    });

    describe("union", function () {
        var name = this.title;
        var features = [polygonUnion1, polygonUnion2];
        it("Control creates a feature", function () {
            testControl(name, features, 3, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects too many features selected", function () {
            testControl(name, [polygon, polygonUnion1, polygonUnion2], 3, true);
        });
    });

    describe("utils", function () {
        it("Source properties not extended with undefined target", function () {
            var src = {};
            //var tgt = void 0;
            ol3turf.utils.extend(src, undefined);
            expect(src).to.eql(src);
        });
        it("Target properties not extended with undefined source", function () {
            //var src = void 0;
            var tgt = {};
            ol3turf.utils.extend(undefined, tgt);
            expect(tgt).to.eql(tgt);
        });
        it("Target undefined property is initialized before extending source", function () {
            var src = {a : {foo: "bar"}};
            var tgt = {};
            ol3turf.utils.extend(src, tgt);
            expect(tgt).to.eql(src);
        });
    });

    describe("within", function () {
        var name = this.title;
        var features = [fcWithinPoints, fcWithinPolygon];
        it("Control computes the points that fall within the polygon.", function () {
            testControl(name, features, 3, false);
        });
        it("Control detects no feature selected", function () {
            testControl(name, [], 0, true);
        });
        it("Control detects no point selected.", function () {
            testControl(name, [turf.featureCollection([line]), fcWithinPolygon], 2, true);
        });
        it("Control detects no polygon selected.", function () {
            testControl(name, [fcWithinPoints, turf.featureCollection([line])], 2, true);
        });
        it("Control detects no point found within.", function () {
            testControl(name, [fcWithinPointsNotWithin, fcWithinPolygon], 2, true);
        });
    });

});
