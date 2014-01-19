function InstagramQuery(username, tag, type, success) {
  this.checkIdx = 0;
  this.userData;
  this.tagData;
  this.userId;
  this.username = username || "wjhrdy";
  this.tag = tag || "vscocam";
  this.hasPostsFilteredByTag = false;
  this.success = success;
  this.postsFilteredByTag;

  this.fetchData();
}

InstagramQuery.prototype = {
  fetchData: function() {
    this.getUserFeed();
    this.getTagFeed();
  },

  checkIfFetchIsDone: function() {
    if (this.checkIdx < 3) {
      return;
    }

    this.filterPostsByTag();
  },

  filterPostsByTag: function() {
    if (this.filteredData) {
      return this.filteredData;
    }

    var filteredUserData = [];

    for (var i = 0; i < this.userData.length; i++) {
      var post = this.userData[i];
      var tags = post.tags;
      if (tags.length > 0) {
        for (var j = 0; j < tags.length; j++) {
          if (tags[j] == this.tag) {
            filteredUserData.push (post);
            break;
          }
        }
      }
    }

    var filteredTagData = [];

    for (var i = 0; i < this.tagData.length; i++) {
      var post = this.tagData[i];
      var id = post.user.id;
      if (id == this.userId) {
        filteredTagData.push(post);
      }
    }

    var finalData = filteredUserData;

    // loop the the result of that stuff ^^^ and filter out duplicates

    for (var i = 0; i < filteredTagData.length; i++) {
      var tagPost = filteredTagData[i];
      var tagPostId = tagPost.id;
      for (var j = 0; j < filteredUserData.length; j++) {
        var userPost = filteredUserData[j];
        var userPostId = userPost.id;
        if (userPostId == tagPostId) {
          break;
        } else {
          finalData.push(tagPost);
        }
      }
    }

    this.postsFilteredByTag = finalData;
    this.hasPostsFilteredByTag = true;

    if (this.success)
      this.success(this);
  },

  getUserFeed: function() {
    var self = this;
    var success = function() { self.getFeedForUser() };
    this.getUserId(success);
  },

  getUserId: function(success) {
    var self = this;
    username = this.username;
    $.ajax({
      url: self.instagramUserIdUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        var data = response.data;
        if (data.length > 0) {
          var user = data[0];
          var id = user.id;

          self.checkIdx++;
          self.userId = id;

          if (success) {
            success();
          }
        } else {
          alert ("No user found.");
        }

      },
      fail: function(response) {
      }
    })
  },

  getFeedForUser: function() {
    var self = this;

    $.ajax({
      url: self.instagramUserFeedUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self.userData = response.data;
        self.checkIdx++;
        self.checkIfFetchIsDone();
      },
      fail: function(response) {
      }
    })
  },

  getTagFeed: function(tag) {
    tag = tag || this.tag;
    var self = this;

    $.ajax({
      url: self.instagramTagUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self.tagData = response.data;
        self.checkIdx++;
        self.checkIfFetchIsDone();
      },
      fail: function(response) {
      }
    })
  },

  instagramTagUrl: function() {
    return "https://api.instagram.com/v1/tags/" + this.tag + "/media/recent?count=500&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserIdUrl: function() {
    return "https://api.instagram.com/v1/users/search?q=" + this.username + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserFeedUrl: function() {
    return "https://api.instagram.com/v1/users/" + this.userId + "/media/recent/?count=500&client_id=ac0ee52ebb154199bfabfb15b498c067";
  }
};
