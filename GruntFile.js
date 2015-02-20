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
						compress : environment
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

						if(environment){
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

						if(tasks.cssCompile !== 'none'){
							tasks.push(config.cssCompile);
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
			if(config.cssCompile !== 'none'){
				grunt.task.run(config.cssCompile);
			}
			else{
				grunt.task.run('copy:css');
			}

			if(config.jshint){
				grunt.task.run('jshint');
			}

			if(environment){
				grunt.task.run('uglify');
			}
			else{
				grunt.task.run('copy:js');
			}
		});
	};


module.exports  = configGrunt;
