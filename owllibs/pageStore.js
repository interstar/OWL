// Generated by CoffeeScript 1.4.0
(function() {
  var SyncQueue,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Page = (function() {

    function Page(pageName, body) {
      this.pageName = pageName;
      this.body = body;
      this.created = new Date().toString();
      this.saved = "";
      this.text = "";
    }

    Page.prototype.toString = function() {
      return "" + this.pageName + " \n " + this.body + " \n " + this.created + " \n " + this.saved + " ";
    };

    return Page;

  })();

  this.BrowserBasedPageStore = (function() {

    function BrowserBasedPageStore() {}

    BrowserBasedPageStore.prototype.k = function(pName) {
      return "fpt.pageStore." + pName;
    };

    BrowserBasedPageStore.prototype.hasName = function(pName) {
      var s;
      s = localStorage.getItem(this.k(pName));
      if (s != null) {
        return true;
      }
      return false;
    };

    BrowserBasedPageStore.prototype.get = function(pName, callback) {
      var page, s;
      s = localStorage.getItem(this.k(pName));
      if (s != null) {
        page = JSON.parse(s);
      } else {
        page = new Page(pName, initialOpmltext);
      }
      return callback(page);
    };

    BrowserBasedPageStore.prototype.set = function(pName, page) {
      return localStorage.setItem(this.k(pName), JSON.stringify(page));
    };

    BrowserBasedPageStore.prototype.save = function(page, errorCallback) {
      page.saved = new Date().toString();
      return this.set(page.pageName, page);
    };

    return BrowserBasedPageStore;

  })();

  SyncQueue = (function() {

    function SyncQueue(postUrl, postSuccessHandler, errorHandler) {
      this.postUrl = postUrl;
      this.postSuccessHandler = postSuccessHandler;
      this.errorHandler = errorHandler;
      this.queue = [];
    }

    SyncQueue.prototype.add = function(pageName) {
      if (__indexOf.call(this.queue, pageName) >= 0) {
        return;
      }
      this.queue.push(pageName);
      return console.log(this.queue);
    };

    SyncQueue.prototype.isHolding = function(pageName) {
      return __indexOf.call(this.queue, pageName) >= 0;
    };

    SyncQueue.prototype.next = function(pageStore) {
      var pName, _results,
        _this = this;
      console.log("in queue next ... url is " + this.postUrl);
      _results = [];
      while (this.queue.length > 0) {
        pName = this.queue.pop();
        _results.push(pageStore.get(pName, function(page) {
          console.log("POSTING " + pName);
          console.log(_this.postUrl + pName);
          return $.ajax({
            type: 'POST',
            url: _this.postUrl + pName,
            data: {
              "pageName": pName,
              "body": page.body,
              "text": page.text
            },
            success: function(data) {
              return _this.postSuccessHandler(pName);
            },
            error: function(xmlHttpRequest) {
              console.log("ERROR IN POST " + pName);
              console.log(xmlHttpRequest);
              return _this.add(pName);
            }
          });
        }));
      }
      return _results;
    };

    return SyncQueue;

  })();

  this.ServerBasedPageStore = (function() {

    function ServerBasedPageStore(getUrl, postUrl, postSuccessHandler, saveErrorHandler) {
      var _this = this;
      this.getUrl = getUrl;
      this.postUrl = postUrl;
      this.inner = new BrowserBasedPageStore();
      this.syncQueue = new SyncQueue(this.postUrl, postSuccessHandler, saveErrorHandler);
      this.syncTimer = setInterval(function() {
        console.log("in synctimer");
        console.log("this is " + _this);
        return _this.next();
      }, 10000);
    }

    ServerBasedPageStore.prototype.get = function(pName, callback) {
      var _this = this;
      if (this.syncQueue.isHolding(pName)) {
        this.inner.get(pName, callback);
        return;
      }
      return $.ajax({
        type: 'GET',
        url: this.getUrl + pName + ".opml",
        success: function(data) {
          console.log(data);
          return callback(new Page(pName, data));
        },
        error: function(xmlHttpRequest) {
          console.log("ERROR IN get " + pName);
          return _this.inner.get(pName, callback);
        }
      });
    };

    ServerBasedPageStore.prototype.save = function(page) {
      this.inner.save(page);
      console.log("Now adding " + page.pageName + " to queue");
      return this.syncQueue.add(page.pageName);
    };

    ServerBasedPageStore.prototype.next = function() {
      return this.syncQueue.next(this.inner);
    };

    return ServerBasedPageStore;

  })();

}).call(this);
