var mongodb = require('mongodb').Db;
var settings = require('../settings');

function Post(name, head, title, tags,cover, post) {
  this.name = name;
  this.head = head;
  this.title = title; 
  this.tags = tags;
  this.cover = cover;
  this.post = post;
}

module.exports = Post;
 
Post.prototype.save = function(callback) {
  var date = new Date();
  
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }
  
 var post = {
    name: this.name,
    head: this.head,
    time: time,
    title:this.title, 
    tags:this.tags,
    cover:this.cover,
    post: this.post,
    comments: [],
    pv: 0
};
 
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
  
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      } 

      collection.insert(post, {
        safe: true
      }, function (err) {
        db.close();
        if (err) {
          return callback(err);  
        }
        callback(null); 
      });
    });
  });
};

 
Post.getTen = function(name,page,callback) { 
    
    mongodb.connect(settings.url, function (err, db) {
    	if(err){
    		return callback(err);
    	}

    	db.collection('posts',function (err,collection){
            if(err){
            	db.close();
            	return callback(err);
            }

       var query = {};
       if(name){
       	  query.name = name;
       }

        collection.count(query, function(err,total){
        	 collection.find(query,{
        	 	skip:(page-1)*10,
        	 	limit:10
        	 }).sort({
        	 	time:-1
        	 }).toArray(function (err,docs){
                   db.close();
                   if(err){
                   	return callback(err);
                   }

                   
                  callback(null,docs,total);
        	  }); 
           });
    	});
    });
};



Post.getOne = function(name, day, title, callback) { 
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    } 
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
     
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        db.close();
        if (err) {
          return callback(err);
        }
       

        callback(null, doc); 
      });
    });
  });
};

Post.edit = function (name,day,title,callback){

      mongodb.connect(settings.url, function (err, db) {
      	  if(err){
      	  	return callback(err);
      	  }

      	 db.collection('posts',function (err,collection){
          if(err){
          	db.close();
          	return callback(err);
          }

          collection.findOne({
          	"name":name,
          	"time.day":day,
          	"title":title
          },function (err,doc){
               db.close();
                if(err){ 
                	return callback(err);
                }
 
                callback(null,doc);
           }); 
      	 });
      });
};

 
Post.update = function(name, day, title, post, callback) {
 
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
 
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
 
      collection.update({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        $set: {post: post}
      }, function (err) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

Post.remove = function(name, day, title, callback) {
   mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
   
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
    
      collection.remove({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        w: 1
      }, function (err) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

Post.getArchive = function(callback) {
 
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
 
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
   
      collection.find({}, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

Post.search = function(keyword, callback) {
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      var pattern = new RegExp(keyword, "i");
      collection.find({
        "title": pattern
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        db.close();
        if (err) {
         return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

Post.getTags = function(callback) {
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
   
      collection.distinct("tags", function (err, docs) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

Post.getTag = function(tag, callback) {
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
    
      collection.find({
        "tags": tag
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};