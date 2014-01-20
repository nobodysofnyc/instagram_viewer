function InstagramQuery(username, tag, limit, success) {
  this._checkIdx = 0;
  this._limit = limit || 50;
  this._userData = [];
  this._tagData = [];
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
    this.getTagFeed(this.instagramTagUrl());
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

    console.log(this._tagData.length);

    for (var i = 0; i < this._userData.length; i++) {
      var post = this._userData[i];
      var tags = post.tags;
      tags = tags.concat(this.getTagsFromPost(post));
      tags = _.uniq(tags);
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

    var finalData = filteredUserData.slice(0);

    // loop the the result of that stuff ^^^ and filter out duplicates

    for (var i = 0; i < filteredTagData.length; i++) {
      var tagId = filteredTagData[i].id;
      var match = false;
      for (var j = 0; j < filteredUserData.length; j++) {
        var userId = filteredUserData[j].id;
        if (userId == tagId) {
          match = true
          break;
        }
      }
      if (!match) {
        finalData.push(filteredTagData[i]);
      }
    }

    this._postsFilteredByTag = finalData;
    this._hasPostsFilteredByTag = true;

    this._userData = [];
    this._tagData = [];
    if (this._success)
      this._success(this);
  },

  getUserFeed: function() {
    var self = this;
    var success = function(url) { self.getFeedForUser(url) };
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
            success(self.instagramUserFeedUrl());
          }
        } else {
          alert ("No user found.");
        }

      },
      fail: function(response) {
      }
    })
  },

  getFeedForUser: function(url) {
    var self = this;

    $.ajax({
      url: url,
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self._userData = self._userData.concat(response.data);
        if (response.pagination.next_url && self._userData.length < self._limit) {
          console.log('fetchin user...');
          self.getFeedForUser(response.pagination.next_url)
        } else {
          self._checkIdx++;
          self.checkIfFetchIsDone();
        }
      },
      fail: function(response) {
      }
    })
  },

  getTagFeed: function(url) {
    var self = this;

    $.ajax({
      url: url,
      type: "get",
      dataType: "jsonp",
      success: function(response) {
        self._tagData = self._tagData.concat(response.data);
        if (response.pagination.next_url && self._tagData.length < self._limit) {
          console.log('fetchin tag...');
          self.getTagFeed(response.pagination.next_url);
        } else {
          self._checkIdx++;
          self.checkIfFetchIsDone();
        }
      },
      fail: function(response) {
      }
    })
  },

  getTagsFromPost: function(post) {
    var comments = post.comments.data;
    var tags = [];
    for (var i = 0; i < comments.length; i++) {
      var t = comments[i].text.match(/#\w+/g);
      if (t && t.length) {
        var a = [];
        for (var j = 0; j < t.length; j++) {
          a.push(t[j].replace('#', ''));
        }
        tags = tags.concat(a);
      }
    }

    return this.sanitizeArr(tags);
  },

  sanitizeArr: function(tags) {
    var t = [];
    for (var i = 0; i < tags.length; i++) {
      if (tags[i]) {
        t.push(tags[i]);
      }
    }

    return t;
  },

  instagramTagUrl: function() {
    return "https://api.instagram.com/v1/tags/" + this._tag + "/media/recent?count=" + this._limit + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserIdUrl: function() {
    return "https://api.instagram.com/v1/users/search?q=" + this._username + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  },

  instagramUserFeedUrl: function() {
    return "https://api.instagram.com/v1/users/" + this._userId + "/media/recent/?count=" + this._limit + "&client_id=ac0ee52ebb154199bfabfb15b498c067";
  }
};
