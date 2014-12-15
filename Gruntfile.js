module.exports = function(grunt) {

	grunt.initConfig({
		uglify: {
			min: {
				files: {
					"picturecaption.min.js": "picturecaption.js"
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask("js", [ "uglify" ]);

};