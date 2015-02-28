module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ["*.html","scripts/*.js","css/*.css"],
            options: {livereload:true}
        },
		jshint: {
            app:{
                src: 'scripts/*.js'
            }
		}
		
		
	});

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('hint',['jshint']);
};
