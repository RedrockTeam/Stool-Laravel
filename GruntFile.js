var path = require("path"),
	fs   = require('fs'),
	_    = require('lodash'),
	colors = require('colors'),
	config = require('./config'),
	isProduction = config.environment === 'production';


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
					ext : isProduction ?  ".min.js" : ".js"
				},
				css : {
					expand : true,
					cwd: 'app/views',
					src: ['**/*.css'],
					dest: 'public/css',
					ext : isProduction ?  ".min.css" : ".css"
				}
			},
			sass : {
				dist : {
					options : {
						style : isProduction ? 'compressed' : 'expanded'
					},
					files : [{
						expand : true,
						cwd : "app/views",
						src : "**/*.scss",
						dest : "public/css",
						ext :  isProduction ? '.min.css' : ".css",
						filter : "isFile"
					}]
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
						compress : isProduction
					},
					files: [{
						expand : true,
						cwd : "app/views",
						src : "**/*.less",
						dest : "public/css",
						ext :  isProduction ?  '.min.css' : ".css",
						filter : "isFile"
					}]
				}
			},
			cssmin: {
				target: {
					files: [{
						expand: true,
						cwd: 'public/css',
						src: ['**/*.css'],
						dest: 'public/css',
						ext: '.min.css'
					}]
				}
			},
			sync: {
				js: {
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
				},
				css : {
					files: [{
						cwd: 'app/views',
						src: [
							'**/*.css' /* but exclude txt files */
						],
						dest: 'public/css',
						ext : ".css"
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

						if(isProduction){
							task.push('uglify');
						}
						else{
							task.push('sync:js');
						}

						return task;
					})(config)
				},
				css : {
					files : ['app/views/**/*.scss', 'app/views/**/*.css', 'app/views/**/*.less'],
					tasks : (function(config){
						var tasks = [];

						if(config.cssCompile !== 'none'){
							if(config.cssCompile.split('|').length > 1){
								tasks = tasks.concat(config.cssCompile.split('|'));
							}
							else{
								tasks.push(config.cssCompile);
							}
						}
						else{
							tasks.push('sync:css');
						}

						return tasks;
					})(config)
				}
			}
		};

		grunt.initConfig(gruntConfig);

		/**
		 * 默认设置， 打开liveload和watch
		 */
		grunt.registerTask('default', "开发默认选项" , function(){
			grunt.task.run('build');
			grunt.task.run(['browserSync', 'watch']);
		});

		grunt.registerTask('build', "编译所有文件", function(){

			grunt.task.run('copy:css');
			if(config.cssCompile !== 'none'){
				if(config.cssCompile.split('|').length > 1){
					grunt.task.run(config.cssCompile.split('|'));
				}
				else{
					grunt.task.run(config.cssCompile);
				}
			}
			if(isProduction){
				grunt.task.run('cssmin');
			}


			if(config.jshint){
				grunt.task.run('jshint');
			}

			if(isProduction){
				grunt.task.run('uglify');
			}
			else{
				grunt.task.run('copy:js');
			}
		});
	};
module.exports  = configGrunt;
