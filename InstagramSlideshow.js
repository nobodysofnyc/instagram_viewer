function InstagramSlideshow(obj) {
  this._posts = obj._postsFilteredByTag;
  this._postsCount = this._posts.length;
  this._$window = $(window);
  this._windowWidth = this._$window.width();
  this._windowHeight = this._$window.height();

  console.log(this._postsCount);
  this.init();
  this.bindEvents();
}

InstagramSlideshow.prototype = {
  init: function() {

    // cache the body selector
    var $body = $('body');

    // loop through all posts and create a slideshow
    for (var i = 0; i < this._posts.length; i++) {

      // get the current post (posts[i])
      var post = this._posts[i];

      // calculate the left for the current slideshow post
      var left = this._windowWidth * i;

      // get the data for our post and create an <img> element with said data
      var src = post.images.standard_resolution.url;
      // JSON.stringify turns a data object into a string (eg. [] to "[]")
      var tags = JSON.stringify(post.tags);
      var $img = $('<img data-id="'+ post.id +'" data-tags="'+ tags +'" class="insta-image" src="' + src + '">');

      // create a few empty divs
      var $post = $('<div class="post"></div>');
      var $container = $('<div class="post-image-container"></div>');
      var $postImg = $('<div class="post-image"></div>');

      // add the <img> to the post-image div
      $postImg.html($img);

      // add the post-image div to the post-image-container div
      $container.html($postImg);

      // ad the post-image-container div to the post div
      $post.html($container);

      // set some dynamic styles on the post div
      $post.css({
        'left' : left,
        'width' : this._windowWidth,
        'height' : this._windowHeight,
        'background-color' : this.randomRGBA(0.5)
      });

      // append this post to the body
      $body.append($post);
    }
  },

  // returns a random generated rgba
  randomRGBA: function(alpha) {
    alpha = alpha || 1;
    var c1 = this.randomColor();
    var c2 = this.randomColor();
    var c3 = this.randomColor();
    return 'rgba('+c1+','+c2+','+c3+','+alpha+')';
  },

  // returns a random number from 0 - 255
  randomColor: function() {
    return Math.floor(Math.random() * 255);
  },

  bindEvents: function() {
    var $posts = $('.post');
    this._$window.bind('resize.slideshow', function() {
      var width = $(this).width();
      var height = $(this).height();
      $posts.each(function(idx) {
        $(this).css({
          'width' : width,
          'left' : idx * width,
          'height' : height
        });
      });
    });
  }
};
