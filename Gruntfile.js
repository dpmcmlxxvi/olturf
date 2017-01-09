/*global module */

module.exports = function (grunt) {

    "use strict";

    var pkg = grunt.file.readJSON("package.json");
    var banner = "/* " + pkg.name + " " + pkg.version + " (c) " + pkg.author.name + " <" + pkg.author.email + ">" + " */\n";

    grunt.initConfig({

        pkg: pkg,

        clean: {
            api: [
                "docs/api/*"
            ],
            ol3turf: [
                "dist/*.js",
                "dist/*.css"
            ]
        },

        concat: {
            css: {
                dest: "dist/ol3-turf.css",
                options: {
                    banner: banner
                },
                src: [
                    "src/css/main.css",
                    "src/css/control.css",
                    "src/css/form.css",
                    "src/css/popup.css",
                    "src/css/along.css",
                    "src/css/area.css",
                    "src/css/bearing.css",
                    "src/css/bezier.css",
                    "src/css/buffer.css",
                    "src/css/center.css",
                    "src/css/center-of-mass.css",
                    "src/css/centroid.css",
                    "src/css/circle.css",
                    "src/css/collect.css",
                    "src/css/combine.css",
                    "src/css/concave.css",
                    "src/css/convex.css",
                    "src/css/destination.css",
                    "src/css/difference.css",
                    "src/css/distance.css",
                    "src/css/envelope.css",
                    "src/css/explode.css",
                    "src/css/flip.css",
                    "src/css/hex-grid.css",
                    "src/css/inside.css",
                    "src/css/intersect.css",
                    "src/css/isolines.css",
                    "src/css/kinks.css",
                    "src/css/line-distance.css",
                    "src/css/line-slice-along.css",
                    "src/css/midpoint.css",
                    "src/css/nearest.css",
                    "src/css/planepoint.css",
                    "src/css/point-grid.css",
                    "src/css/point-on-line.css",
                    "src/css/point-on-surface.css",
                    "src/css/random.css",
                    "src/css/sample.css",
                    "src/css/simplify.css",
                    "src/css/square.css",
                    "src/css/square-grid.css",
                    "src/css/tag.css",
                    "src/css/tin.css",
                    "src/css/tesselate.css",
                    "src/css/triangle-grid.css",
                    "src/css/union.css",
                    "src/css/within.css"
                ]
            },
            js: {
                dest: "dist/ol3-turf.js",
                options: {
                    banner: banner
                },
                src: [
                    "src/js/main.js",
                    "src/js/utils.js",
                    "src/js/control.js",
                    "src/js/form.js",
                    "src/js/handler.js",
                    "src/js/popup.js",
                    "src/js/along.js",
                    "src/js/area.js",
                    "src/js/bearing.js",
                    "src/js/bezier.js",
                    "src/js/buffer.js",
                    "src/js/center.js",
                    "src/js/center-of-mass.js",
                    "src/js/centroid.js",
                    "src/js/circle.js",
                    "src/js/collect.js",
                    "src/js/combine.js",
                    "src/js/concave.js",
                    "src/js/convex.js",
                    "src/js/destination.js",
                    "src/js/difference.js",
                    "src/js/distance.js",
                    "src/js/envelope.js",
                    "src/js/explode.js",
                    "src/js/flip.js",
                    "src/js/hex-grid.js",
                    "src/js/inside.js",
                    "src/js/intersect.js",
                    "src/js/isolines.js",
                    "src/js/kinks.js",
                    "src/js/line-distance.js",
                    "src/js/line-slice-along.js",
                    "src/js/midpoint.js",
                    "src/js/nearest.js",
                    "src/js/planepoint.js",
                    "src/js/point-grid.js",
                    "src/js/point-on-line.js",
                    "src/js/point-on-surface.js",
                    "src/js/random.js",
                    "src/js/sample.js",
                    "src/js/simplify.js",
                    "src/js/square.js",
                    "src/js/square-grid.js",
                    "src/js/tag.js",
                    "src/js/tin.js",
                    "src/js/tesselate.js",
                    "src/js/toolbars.js",
                    "src/js/triangle-grid.js",
                    "src/js/union.js",
                    "src/js/within.js"
                ]
            }
        },

        copy: {
            main: {
                files: [
                    {
                        dest: "docs/api/docs/web/img/",
                        expand: true,
                        filter: "isFile",
                        flatten: true,
                        src: ["docs/web/img/*"]
                    },
                    {
                        dest: "docs/web/js/",
                        expand: true,
                        filter: "isFile",
                        flatten: true,
                        src: ["bower_components/**/*.js"]
                    },
                    {
                        dest: "docs/web/css/",
                        expand: true,
                        filter: "isFile",
                        flatten: true,
                        src: ["bower_components/**/*.css"]
                    },
                    {
                        dest: "docs/web/js/",
                        expand: true,
                        filter: "isFile",
                        flatten: true,
                        src: ["dist/*.js"]
                    },
                    {
                        dest: "docs/web/css/",
                        expand: true,
                        filter: "isFile",
                        flatten: true,
                        src: ["dist/*.css"]
                    },
                ]
            }
        },

        csslint: {
            ol3turf: {
                options: {
                    "box-sizing": false,
                    "overqualified-elements": false
                },
                src: [
                    "src/css/*.css",
                    "src/css/!*.min.css"
                ]
            }
        },

        cssmin: {
            dist: {
                cwd: "dist/",
                dest: "dist/",
                expand: true,
                ext: ".min.css",
                src: [
                    "*.css",
                    "!*.min.css"
                ]
            }
        },

        "gh-pages": {
            options: {
                base: "docs"
            },
            src: ["**"]
        },

        gitadd: {
            dist: {
                files: {
                    src: ["dist/*"]
                }
            }
        },

        gitcommit: {
            dist: {
                options: {
                    message: "Add new dist files for release " + pkg.version
                },
                files: {
                    src: ["dist/*"]
                }
            }
        },

        htmlhint: {
            all: {
                options: {
                    "space-tab-mixed-disabled": "space4"
                },
                src: [
                    "docs/**/*.html",
                    "test/*.html"
                ]
            }
        },

        jsdoc : {
            dist : {
                options: {
                    configure: "conf.json",
                    destination: "docs/api",
                    template: "node_modules/ink-docstrap/template"
                }
            }
        },

        jshint: {
            dist: {
                src: [
                    "src/js/*.js",
                    "!src/js/*.min.js"
                ]
            }
        },

        release: {
            options: {
                afterBump: ["default", "dist"],
                github: {
                    repo: "dpmcmlxxvi/ol3-turf",
                    accessTokenVar: "GITHUB_ACCESS_TOKEN"
                },
            }
        },

        uglify: {
            ol3turf: {
                files: {
                    "dist/ol3-turf.min.js": "dist/ol3-turf.js"
                },
                options: {
                    banner: banner
                }
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-gh-pages");
    grunt.loadNpmTasks("grunt-git");
    grunt.loadNpmTasks("grunt-htmlhint");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-release");

    grunt.registerTask("dist", ["gitadd:dist", "gitcommit:dist"]);
    grunt.registerTask("lint", ["csslint", "jshint", "htmlhint"]);
    grunt.registerTask("minify", ["cssmin", "uglify"]);
    grunt.registerTask("web", ["gh-pages"]);
    grunt.registerTask("default", ["clean", "lint", "concat", "minify", "jsdoc", "copy"]);

};
