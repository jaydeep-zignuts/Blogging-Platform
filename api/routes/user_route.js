const express = require("express");
const router = require("express").Router();
const UserController = require('../controllers/user_controller');

router.get("/", UserController.user_getall_blog);

router.get("/userAllBlogs", UserController.user_getall_blog);
router.get("/userBlog/:_id/:slug",UserController.renderBlog);
router.get('/search', UserController.searchBlog);

module.exports = router;