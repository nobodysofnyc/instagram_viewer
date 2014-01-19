function InstagramQuery(username, tag, type, success) {
  this._checkIdx = 0;
  this._userData;
  this._tagData;
  this._userId;
  this._username = username || "wjhrdy";
  this._tag = tag || "vscocam";
  this._hasPostsFilteredByTag = false;
  this._success = success;
  this._postsFilteredByTag;

  this.fetchData();
}

InstagramQuery.prototype = {
  fetchData: function() {
    this.getUserFeed();
    this.getTagFeed();
  },

  checkIfFetchIsDone: function() {
    if (this._checkIdx < 3) {
      return;
    }

    this.filterPostsByTag();
  },

  filterPostsByTag: function() {
    if (this._filteredData) {
      return this._filteredData;
    }

    var filteredUserData = [];

    for (var i = 0; i < this._userData.length; i++) {
      var post = this._userData[i];
      var tags = post.tags;
      if (tags.length > 0) {
        for (var j = 0; j < tags.length; j++) {
          if (tags[j] == this._tag) {
            filteredUserData.push (post);
            break;
          }
        }
      }
    }

    var filteredTagData = [];

    for (var i = 0; i < this._tagData.length; i++) {
      var post = this._tagData[i];
      var id = post.user.id;
      if (id == this._userId) {
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

    this._postsFilteredByTag = finalData;
    this._hasPostsFilteredByTag = true;

    if (this._success)
      this._success(this);
  },

  getUserFeed: function() {
    var self = this;
    var success = function() { self.getFeedForUser() };
    this.getUserId(success);
  },

  getUserId: function(success) {
    var self = this;
    username = this._username;
    $.ajax({
      url: self.instagramUserIdUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        var data = response.data;
        if (data.length > 0) {
          var user = data[0];
          var id = user.id;

          self._checkIdx++;
          self._userId = id;

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
        self._userData = response.data;
        self._checkIdx++;
        self.checkIfFetchIsDone();
      },
      fail: function(response) {
      }
    })
  },

  getTagFeed: function(tag) {
    tag = tag || this._tag;
    var self = this;

    $.ajax({
      url: self.instagramTagUrl(),
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self._tagData = response.data;
        self._checkIdx++;
        self.checkIfFetchIsDone();
      },
      fail: function(response) {
      }
    })
  },

  instagramTagUrl: function() {
    return "https://api.instagram.com/v1/tags/" + this._tag + "/media/recent?count=500&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserIdUrl: function() {
    return "https://api.instagram.com/v1/users/search?q=" + this._username + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserFeedUrl: function() {
    return "https://api.instagram.com/v1/users/" + this._userId + "/media/recent/?count=500&client_id=ac0ee52ebb154199bfabfb15b498c067";
  }
};
