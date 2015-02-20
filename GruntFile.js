var path = require("path"),
	fs   = require('fs'),
	_    = require('lodash'),
	colors = require('colors'),
	config = require('./config'),
	environment = config.environment === 'production';


	configGrunt = function(grunt) {

		colors.setTheme({silly: 'rainbow'});

		require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

		var gruntConfig = {
			pkg : grunt.file.readJSON('package.json'),
			browserSync: {
				proxy : {
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
			sync: {
				main: {
					files: [{
						cwd: 'app/views',
						src: [
							'**/*.js' /* but exclude txt files */
						],
						dest: 'public/js',
						ext : ".js"
					}],
					pretend: false, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much.
					verbose: true // Display log messages when copying files
				}
			},
			watch : {
				scripts : {
					files : ['app/views/**/*.js'],
					tasks : (function(config){
						var task = [];

						if(config.jshint){
							task.push('jshint');
						}

						if(environment){
							task.push('uglify');
						}
						else{
							task.push('sync');
						}

						return task;
					})(config)
				},
				css : {
					files : ['app/views/**/*.scss', 'app/views/**/*.css', 'app/views/**/*.less'],
					tasks : (function(config){
						var tasks = [];

						if(tasks.cssCompile !== 'none'){
							tasks.push(config.cssCompile);
						}
						else{
							tasks.push('copy:css');
						}

						return tasks;
					})(config)
				}
			}
		};

		grunt.initConfig(gruntConfig);

		grunt.registerTask('default', "开发默认选项" , ['browserSync', 'watch']);


	};


module.exports  = configGrunt;
