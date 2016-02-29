'use strict';
/**
 * web前端开发自动化环境
 * 1. 本地web服务器
 * 2. less编译
 * 3. watch
 * 4. js代码检查
 * 5. css压缩
 * 6. js压缩
 * 7. 文件内容替换
 */
module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var config = {
    'app': 'app',
    'export': 'export'
  };
  
  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // 监视html,js,css文件改变,执行对应任务
    watch: {
      js: {
        files: ['<%= config.app %>/js/**/*.js', '!<%= config.app %>/js/lib/**/*.js'],
        // tasks: ['jshint'],
        tasks: [],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      less: {
        // files: ['<%= config.app %>/less/{,*/}*.less'],
        files: ['<%= config.app %>/less/**/*.less'],
        tasks: ['less','autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/**/*.html',
          '<%= config.app %>/js/**/*.js',
          '<%= config.app %>/css/**/*.css',
          '<%= config.app %>/images/**/*.{png,jpg,jpeg,gif}'
        ]
      }
    },

    // 本地web服务器搭建
    connect: {
      options: {
        port: 8098,
        open: true,
        livereload: 25730,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static(config.app)
            ];
          }
        }
      }
    },

    // js代码规范检查
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/js/**/*.js',
        '!<%= config.app %>/js/lib/**'
      ]
    }, 
    
    // less文件编译
    less: {
      options: {
        compress: false,
        sourceMap: false,
        yuicompress: false
      },
      debug:{
        files: [{
          expand: true,
          cwd: '<%= config.app %>/less',
          src: ['**/*.less','!core/**'],
          dest: '<%= config.app %>/css',
          ext: '.css'
        }]
      }
    },    

    // 浏览器兼容性
    autoprefixer : {
     options: {
        browsers: ['last 2 versions', 'ie 7', 'ie 8', 'ie 9'],
        map: true
      },
      dist:{
        src: '<%= config.app %>/css/**/*.css'
      }
    },

    //css压缩
    cssmin: {
      prod: {
        options: {
          report: 'gzip'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/css',
          src: ['*.css'],
          dest: '<%= config.export %>/css'
        }]
      }
    },

    //js压缩
    uglify: {
      dist: {
        files: [{
          expand:true,
          cwd:'<%= config.app %>/js',//jsÄ¿Â¼ÏÂ
          src:[
            '**/*.js',
            '!lib/**' //²»Ñ¹Ëõjs/lib
          ],
          dest: '<%= config.export %>/js',//Êä³öµ½´ËÄ¿Â¼ÏÂ
        }]
      }
    },

    // 导出项目时用到的copy任务(复制文件和文件夹)
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          src: [
            '**/*',
            '!less/**'
          ],
          dest: '<%= config.export %>'
        }]
      }
    },

    //文件内容替换(php模板可能会用到)
    regexReplace: {
      dist: {
        options: {
          //在文本中使用下面的正则替换内容( 例:把'href="scripts'正则匹配到的内容替换成字符串'href="__RESOURCES_PHONE__/scripts' )
          regex: {
            'href="scripts': 'href="__RESOURCES_PHONE__/scripts',
            'src="scripts': 'src="__RESOURCES_PHONE__/scripts',
            'href="styles': 'href="__RESOURCES_PHONE__/styles',
            'src="images': 'src="__RESOURCES_PHONE__/images'
          }
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: '*.html',
          dest: '<%= config.export %>',
          ext: '.html'
        }]
      }
    }
  });


  grunt.registerTask('server', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '192.168.20.36');
    }
    grunt.task.run([
      'connect:livereload',
      'watch'
    ]);
  });

  /**
   * less编译任务
   */
  grunt.registerTask('build', [
    'less'
    // 'autoprefixer:less',
    // 'autoprefixer:css'
  ]);

  /**
   * (默认任务)
   * 编译less, 开启本地web服务器, 监视html,js,css文件改变并更新web
   */
  grunt.registerTask('default', [
    'build',
    'server'
    // 'autoprefixer:less',
    // 'autoprefixer:css'
  ]);

  /**
   * 导出任务
   * 1.less编译
   * 2.文件copy到export下
   * 3.js压缩(js/lib不压缩)
   * 4.文件内容替换
   * 5.css压缩
   */
  grunt.registerTask('export', [
    'build',
    'copy',
    'uglify',
    // 'regexReplace',
    'cssmin'
  ]);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
