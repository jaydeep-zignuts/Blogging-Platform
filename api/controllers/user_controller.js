const Blog = require("../models/blog");
const Category = require("../models/category");
const mongoose = require("mongoose");
const slug = require("slug");

exports.user_getall_blog = (req, res, next) => {
    Blog.find()
      .select()
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,

        };
        
        res.render("userAllBlog", { res: docs });
        console.log(docs);

      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  };
  exports.renderBlog=(req,res,next) =>{
    // console.log("render update blog controller :: "+req.params._id);
    const  id = req.params._id;
    
    Blog.findById(id)
      .select("_id title slug category description publish_date blogImage")
      .exec()
      .then((doc) => {
        
        res.render("userBlog", { res: doc });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

  exports.searchBlog =  (req, res, next) => {
    
     Blog.find({
      "$or" : [
        { title : {$regex : req.query.searchValue}}  
    ]
    })
      .select("_id title slug category description publish_date blogImage")
      //.where({title:search})
      .exec()
      .then((docs) => {
        console.log(docs);
            res.render("userAllBlog", { res: docs });
            
          })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });

       

  }
  