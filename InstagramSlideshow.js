function InstagramSlideshow(obj) {
  this.posts = obj._postsFilteredByTag;
  this.$window = $(window);
  this.windowWidth = this.$window.width();
  this.windowHeight = this.$window.height();
  this.init();
}

InstagramSlideshow.prototype = {
  init: function() {
    var $body = $('body');
    for (var i = 0; i < this.posts.length; i++) {
      var post = this.posts[i];
      var left = this.windowWidth * i;
      var src = post.images.standard_resolution.url;
      var tags = JSON.stringify(post.tags);
      var $img = $('<img data-id="'+ post.id +'" data-tags="'+ tags +'" class="insta-image" src="' + src + '">');

      var $post = $('<div class="post"></div>');
      var $container = $('<div class="post-image-container"></div>');
      var $postImg = $('<div class="post-image"></div>');

      $postImg.html($img);
      $container.html($postImg);
      $post.html($container);

      $post.css({
        'left' : left,
        'width' : this.windowWidth,
        'height' : this.windowHeight,
        'background-color' : this.randomRGBA(0.5)
      });

      $body.append($post);
    }
  },

  randomRGBA: function(alpha) {
    alpha = alpha || 1;
    var c1 = this.randomColor();
    var c2 = this.randomColor();
    var c3 = this.randomColor();
    return 'rgba('+c1+','+c2+','+c3+','+alpha+')';
  },

  randomColor: function() {
    return Math.floor(Math.random() * 256);
  }
};
