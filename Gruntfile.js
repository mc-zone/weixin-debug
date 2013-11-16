module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            html: {
                files: ['*.html']
               , options: {
                    livereload:true
                }
            }
           ,js: {
               files:['*.js']
              ,options: {
                  livereload:true
                }
           }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-livereload');

    grunt.registerTask('default',['watch']);
}
