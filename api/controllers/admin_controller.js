const Admin = require("../models/admin");
const Blog = require("../models/blog");
const Category = require("../models/category");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const slug = require("slug");
// var todayDate = new Date();
// const checkAuth = require("../middlewars/check-auth");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dlnvawxxp",
  api_key: "834946992152468",
  api_secret: "NDS7-ytuII-5NtS_DAgOZf5JbOI",
});

//render login
exports.renderAdminLogin = (req, res, next) => {
  res.render("login");
};

//admin login
exports.admin_login = (req, res, next) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then((admin) => {
      if (admin.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
        if (err) {
          req.toastr.error("Invalid credentials.");
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        console.log(process.env.JWT_KEY);

        if (result) {
          const token = jwt.sign(
            {
              email: admin[0].email,
              adminId: admin[0]._id,
            },

            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res
            .cookie("access_token", token, {
              httpOnly: true,
              // secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({
              message: "Logged in successfully",
            });
        }

        res.status(401).json({
          message: "Auth Failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

// admin logout
exports.admin_logout = (req, res, next) => {
  return res.clearCookie("access_token").status(200).json({
    message: "Successfully logged out cookie",
  });
};

//admin rebder add blog
exports.renderAddBlogs = (req, res, next) => {
  Category.find()
    .select("category _id")
    .exec()
    .then((docs) => {
      // console.log(docs);
      res.render("addBlogs", { res: docs, errors: undefined });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//admin add blog
exports.admin_add_blog = (req, res, next) => {
  req.checkBody("title", "title is Required").notEmpty();
  req.checkBody("category", "category is Required").notEmpty();
  req.checkBody("description", "description is Required").notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    Category.find()
      .select("category _id")
      .exec()
      .then((docs) => {
        res.render("addBlogs", { res: docs, errors: errors });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });

    //res.render("addBlogs", { errors: errors });
  } else {
    const img = req.files.blogImage;

    cloudinary.uploader.upload(img.tempFilePath, (err, result) => {
      const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        slug: slug(req.body.title, "-"),
        category: req.body.category,
        description: req.body.description,
        // publish_date: req.body.publish_date,
        blogImage: result.url,
      });
      blog
        .save()
        .then((result) => {
          res.redirect("/admin/allBlogs");
        })
        .catch((err) => {
          // console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    });
  }
};

//get all blogs
exports.get_all_blogs = (req, res, next) => {
  Blog.find()
    .select()
    .exec()
    .then((docs) => {
      
      res.render("allblogs", { res: docs });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//render add category
exports.renderAddCategory = (req, res, next) => {
  res.render("addCategory", { errors: undefined });
};

// add new category
exports.admin_add_category = (req, res, next) => {
  req.checkBody("category", "category is Required").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render("addCategory", { errors: errors });
  } else {
    const category = new Category({
      _id: new mongoose.Types.ObjectId(),
      category: req.body.category,
    });
    category
      .save()
      .then((result) => {
        res.redirect("/admin/allBlogs");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
};

//get all category
exports.get_all_category = (req, res, next) => {
  Category.find()
    .select("category _id")
    .exec()
    .then((docs) => {
      res.render("allCategory", { res: docs });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

//render updaet category
exports.renderUpdateCategory = (req, res, next) => {
  const id = req.params._id;
  console.log(id);
  Category.findById(id)
    .select("category _id")
    .exec()
    .then((doc) => {
      res.render("updateCategory", { res: doc, errors: undefined });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

//update category
exports.updateCategoryName = (req, res, next) => {
  req.checkBody("category", "category is Required").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    const id = req.params._id;
    console.log("errors is upc", errors);
    Category.findById(id)
      .select("category _id")
      .exec()
      .then((doc) => {
        console.log(doc);
        res.status(400).render("updateCategory", { res: doc, errors: errors });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else {
    let myquery = { _id: req.params._id };
    let newvalues = { $set: { category: req.body.category } };

    Category.findOneAndUpdate(myquery, newvalues)
      .then((doc) => {
        return res
          .status(200)
          .render("allCategory", { res: doc, errors: undefined });
       
      })
      .catch((err) => {
        // console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
};

//delete category
exports.deleteCategory = (req, res, next) => {
  let myquery = { _id: req.params._id };
  Category.findOneAndDelete(myquery)
    .then((doc) => {
      return res.status(200).json({
        category: doc,
        message: "Category Deleted Successfully",
        err: "",
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
//render update blog
exports.renderUpdateBlog = (req, res, next) => {
  const id = req.params._id;
  Blog.findById(id)
    .select("_id title slug category description publish_date blogImage")
    .exec()
    .then((doc) => {
      Category.find()
        .select("category _id")
        .exec()
        .then((categ) => {
          res.render("updateBlog", { res: doc, cat: categ });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

//update blog
exports.updateBlog = (req, res, next) => {
  console.log(req.body);
  req.checkBody("title", "title is Required").notEmpty();
  req.checkBody("category", "category is Required").notEmpty();
  req.checkBody("description", "description is Required").notEmpty();
  
  const errors = req.validationErrors();
  if (errors) {

    res.status(400).render({ errors: errors });
  } else {
    let myquery = { _id: req.params._id };
    let newvalues = {
      $set: {
        title: req.body.title,
        slug: slug(req.body.title, "-"),
        category: req.body.category,
        description: req.body.description,
      },
    };
    Blog.findOneAndUpdate(myquery, newvalues)
      .then((doc) => {
      
        return res
        .json({
          category: doc,
          message: "Blog Updated Successfully",
          err: "",
        });
      })
      .catch((err) => {

        res.status(500).json({
          error: err,
        });
      });
  }
};

//render image
exports.renderUpdateImage = (req, res, next) => {
  const id = req.params._id;
  Blog.findById(id)
    .select("_id blogImage")
    .exec()
    .then((doc) => {
      res.render("updateImage", { res: doc });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//update image
exports.updateIamge = (req, res, next) => {
  let myquery = { _id: req.params._id };
  const img = req.files.blogImage;
  cloudinary.uploader.upload(img.tempFilePath, (err, result) => {
    let newvalues = { $set: { blogImage: result.url } };
    Blog.findOneAndUpdate(myquery, newvalues)
      .then((doc) => {
        return res.redirect("/admin/allBlogs");
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};

//render perticular blog
exports.renderAdminBlog = (req, res, next) => {
  const id = req.params._id;

  Blog.findById(id)
    .select("_id title slug category description publish_date blogImage")
    .exec()
    .then((doc) => {
      res.render("adminBlog", { res: doc });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//delete blog
exports.deleteBlog = (req, res, next) => {
  let myquery = { _id: req.params._id };
  Blog.findOneAndDelete(myquery)
    .then((doc) => {
      return res.status(200).json({
        category: doc,
        message: "Blo Deleted Successfully",
        err: "",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

//
// exports.admin_signup=(req,res, next)=>{
//     Admin.find({email: req.body.email })
//     .exec()
//     .then(admin=>{
//         if(admin.length > 1){
//             return res.status(409).json({
//                 message: "Email Already Exist"
//             });
//         }else{
//             bcrypt.hash(req.body.password, 10 ,(err,hash)=>{
//                 if(err){
//                     return res.status(500).json({
//                         error: err,
//                     });
//                 }else{
//                     const admin=new Admin({
//                         _id:mongoose.Types.ObjectId(),
//                         email: req.body.email,
//                         password:hash,
//                     });
//                     admin.save()
//                     .then(result=>{
//                         console.log(admin);
//                         res.status(201).json({
//                             message:"Admin Created",
//                         });
//                     })
//                     .catch(err=>{
//                         console.log(err);
//                         res.status(500).json({
//                             error:err,
//                         });
//                     });
//                 }
//             });
//         }
//     });
// }

/////
