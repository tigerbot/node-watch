var EventEmitter = require("events").EventEmitter, util = require("util");

var WatchClass = function() {
    "use strict";
    function Watch(options) {
        EventEmitter.call(this);
        this.__watchedFolders = {};
        this.fs = require("fs");
        this.path = require("path");
    }
    util.inherits(Watch, EventEmitter);
    Watch.prototype.add = function(str_file_or_path, recursive) {
        recursive = recursive || false;
        return this.__handle(true, str_file_or_path, recursive);
    };
    Watch.prototype.remove = function(str_file_or_path) {
        var recursive = false;
        if (this.__watchedFolders.hasOwnProperty(str_file_or_path)) {
            recursive = this.__watchedFolders[str_file_or_path].recursive;
        }
        return this.__handle(false, str_file_or_path, recursive);
    };
    Watch.prototype.onChange = function(cb) {
        this.on("change", cb);
        return this;
    };
    Watch.prototype.clearListeners = function() {
        this.removeAllListeners("change");
        this.removeAllListeners();
        return this;
    };
    Watch.prototype.__handle = function(add, str_file_or_path, recursive) {
        str_file_or_path = this.path.resolve(str_file_or_path);
        var stat = null;
        try {
            stat = this.fs.statSync(str_file_or_path);
        } catch (e) {
            if (add) {
                throw e;
            } else {
                stat = false;
            }
        }
        if (stat) {
            if (stat.isFile()) {
                return this.__file(add, str_file_or_path);
            }
            if (stat.isDirectory()) {
                return this.__dir(add, str_file_or_path, recursive);
            }
        }
    };
    Watch.prototype.__dir = function(add, dir, recursive) {
        var self = this;
        recursive = recursive || false;
        if (add) {
            if (!this.__watchedFolders.hasOwnProperty(dir)) {
                this.__watchedFolders[dir] = {
                    recursive: recursive
                };
                self.__rescan(add, dir, recursive);
                self.fs.watchFile(dir, function(curr, prev) {
                    if (prev.nlink !== curr.nlink) {
                        if (curr.nlink > prev.nlink) {
                            var files = self.fs.readdirSync(dir);
                            for (var i = 0; i < files.length; i++) {
                                var full_path = dir + "/" + files[i];
                                var stat = self.fs.statSync(full_path);
                                if (stat.isFile()) {
                                    if (stat.ctime.getTime() === curr.mtime.getTime()) {
                                        self.emit("change", full_path, stat, stat, "new");
                                    }
                                }
                            }
                        }
                        self.__rescan(add, dir, recursive);
                    }
                });
            } else {
                throw new Error("Folder already being watched");
            }
        } else {
            if (this.__watchedFolders.hasOwnProperty(dir)) {
                self.__rescan(add, dir, this.__watchedFolders[dir].recursive);
                delete this.__watchedFolders[dir];
            }
            self.fs.unwatchFile(dir);
        }
        return this;
    };
    Watch.prototype.__file = function(add, file) {
        var self = this;
        var is_file = false;
        try {
            is_file = self.fs.statSync(file).isFile();
        } catch (e) {
            is_file = false;
        }
        if (!is_file) {
            return self;
        }
        if (add) {
            self.fs.watchFile(file, function watchMe(prev, curr) {
                try {
                    var stat = self.fs.statSync(file).isFile();
                    if (prev.mtime.getTime() !== curr.mtime.getTime()) {
                        self.emit("change", file, prev, curr, "change");
                    }
                } catch (e) {
                    if (e.code === "ENOENT") {
                        self.emit("change", file, prev, curr, "delete");
                        return;
                    } else {
                        throw e;
                    }
                }
            });
        } else {
            self.fs.unwatchFile(file);
        }
        return self;
    };
    Watch.prototype.__rescan = function(add, folder, recursive) {
        var self = this;
        self.fs.stat(folder, function(err, stat) {
            if (!err) {
                var files = self.fs.readdirSync(folder);
                for (var i = 0; i < files.length; i++) {
                    var full_path = self.path.join(folder, files[i]);
                    if (self.fs.statSync(full_path).isFile()) {
                        self.__file(add, full_path);
                    } else if (recursive && self.fs.statSync(full_path).isDirectory()) {
                        self.__dir(add, full_path, recursive);
                    }
                }
            }
        });
    };
    return Watch;
}();

module.exports = new WatchClass;