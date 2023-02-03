const express = require("express");
// const multer = require("multer");

// const router = express.Router();
const router = require("express").Router();
const AdminController = require('../controllers/admin_controller');
const checkAuth = require("../middlewars/check-auth");


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().toISOString() + file.originalname);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5,
//     },
//     fileFilter: fileFilter,
//   });
// upload.single('blogImage'),
// router.post("/signup",AdminController.admin_signup);

//render login


router.get("/login", AdminController.renderAdminLogin);

//login
router.post("/loginChk", AdminController.admin_login);
router.get("/logout", checkAuth, AdminController.admin_logout);


router.get("/",checkAuth, AdminController.get_all_blogs)


//add and display blog
router.post("/addBlog", checkAuth, AdminController.admin_add_blog );
router.get("/allBlogs", checkAuth, AdminController.get_all_blogs);

//add and display category
router.post("/addCategory", checkAuth, AdminController.admin_add_category);
router.get("/allCategory", checkAuth, AdminController.get_all_category);


//render
router.get('/addCategory', checkAuth, AdminController.renderAddCategory);
router.get('/addBlogs', checkAuth, AdminController.renderAddBlogs);

//update Category

router.get('/renderUpdateCategory/:_id', checkAuth, AdminController.renderUpdateCategory);
router.put('/updateCategory/:_id', checkAuth, AdminController.updateCategoryName);

//delete category
router.delete('/delete/:_id', checkAuth, AdminController.deleteCategory);


//render and update blog 
router.get('/renderUpdateBlog/:_id', checkAuth, AdminController.renderUpdateBlog);
router.put('/updateBlog/:_id', checkAuth, AdminController.updateBlog);

router.delete('/deleteBlog/:_id', checkAuth, AdminController.deleteBlog);


router.get('/renderUpdateImage/:_id', checkAuth, AdminController.renderUpdateImage);
router.post('/updateImage/:_id', checkAuth, AdminController.updateIamge);


router.get("/adminBlog/:_id/:slug",AdminController.renderAdminBlog);

// router.get('/search', checkAuth, AdminController.searchBlog);




module.exports = router;