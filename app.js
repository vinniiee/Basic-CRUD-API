const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static("static"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});


const articleSchema = {
  "title": {
    type: String,
    required: true,
  },
  "content": {
    type: String,
  }
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

  .get(function(req, res) {



    Article.find({}, function(err, result) {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })


  .post(function(req, res) {

    const title = req.body.title
    const content = req.body.content
    newArticle = new Article({
      title: title,
      content: content,
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });

  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err && result) {
        res.send("Successfully deleted all articles.");
      } else if(!err && !result) {
        res.send("No articles matched your search");
      }
      else{
        res.send(err);
      }
    });
  });

app.route("/articles/:articleTitle")
    .get(function(req,res){
      Article.findOne({title:req.params.articleTitle},function(err,result){
        if(!err){
          res.send(result);
        }
        else{
          res.send(err);
        }
      });
    })

    .put(function(req,res){
      Article.update(
        {title:req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
          if(!err){
            res.send("Successfuly updated the article.");
          }
          else{
            res.send(err);
          }
        }
      );
    })

    .patch(function(req,res){
      Article.update(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
          if(!err){
            res.send("Successfully updated article.");
          }
          else{
            res.send(err);
          }
        }
      );
    })

    .delete(function(req,res){
      Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
          if(!err){
            res.send("Deleted article successfully.");
          }
          else{
            res.send(err);
          }
        }
        );
    });


app.listen(3000, function() {
  console.log("Listenng at port 3000")
});
