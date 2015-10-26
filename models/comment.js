var mongodb = require('mongodb').Db;
var settings = require('../settings');

function Comment(name,day,title,comment){

	this.name = name;
	this.title = title;
	this.day = day;
	this.comment = comment;
}

module.exports = Comment;


Comment.prototype.save = function(callback){
    var name = this.name;
    var title = this.title;
    var day = this.day;
    var comment = this.comment;

    mongodb.connect(settings.url, function (err, db) {
    	if(err){
    		return callback(err);
    	}

    	db.collection('posts',function (err,collection){
               if(err){
               	 db.close();
               	 return callback(err);
               }

               collection.update({
               	  "name":name,
               	  "title":title,
               	  "time.day":day
               },{
               	 $push:{"comments":comment}
               },function (err){
               	   db.close();
               	   if(err){
               	   	return callback(err);
               	   }
               	   callback(null);
               });
    	});
    });

}