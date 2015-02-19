var path = require("path"),
	fs   = require('fs'),
	_    = require('lodash'),
	colors = require('colors'),
	buildDirectory = path.resolve(process.cwd(), 'public'),
	workDirectory = path.resolve(process.cwd(), 'app/views'),
	config = require('./config'),
	environment = config.environment === 'development';
	configGrunt = function(grunt) {
		colors.setTheme({silly: 'rainbow'});

		require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

		var config = {
			pkg : grunt.file.readJSON('package.json'),

			paths : {
				build : buildDirectory,
				work : workDirectory
			},
			browserSync: {
				server : {
					bsFiles: {
						src : ['app/views/**/*.blade.php' ,'app/views/**/*.css', 'app/views/**/*.js']
					},
					options: {
						proxy : config.proxy,
						watchTask: true
					}
				}
			},
			jshint : {
				files : {
					src : ['app/views/**/*.js']
				},
				options : {
					jshintrc : true
				}
			},
			copy : {
				js : {
					expand : true,
					cwd: 'app/views',
					src: ['**/*.js'],
					dest: 'public/js',
					ext :".js"
				},
				css : {
					expand : true,
					cwd: 'app/views',
					src: ['**/*.css'],
					dest: 'public/css',
					ext :".css"
				}
			},

			uglify : {
				target : {
					options : {
						sourceMap : true
					},
					files : [{
						expand : true,
						cwd : "app/views",
						src : "**/*.js",
						dest :  "public/js",
						ext : ".js",
						filter : "isFile"
					}]
				}
			},

			less : {
				target : {
					options : {
						path : ['app/views'],
						ieCompat : true,
						compress : !environment
					},
					files: [{
						expand : true,
						cwd : "app/views",
						src : "**/*.less",
						dest : "public/css",
						ext : '.css',
						filter : "isFile"
					}]
				}
			},

			watch : {
				scripts : {
					files : buildDirectory + "/**/*.js",
					tasks : (function(config){
						var tasks = [];

						if(config.jshint){
							tasks.push('jshint');
						}

						if(environment){
							tasks.concat(['uplify']);
						}
						else{
							tasks.concat(['copy:js']);
						}

						return tasks;
					})(config)
				},
				css : {
					files : buildDirectory + "**/*.css",
					tasks : (function(config){
						var tasks = [];

						if(tasks.cssCompile !== 'none'){
							tasks.push(config.cssCompile);
						}
						else{
							tasks.push('copy:css');
						}
					})(config)
				}
			}
		};

		grunt.initConfig(config);


		grunt.registerTask('default', ['watch']);

	};


module.exports = configGrunt;
