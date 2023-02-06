const jwt= require('jsonwebtoken');
const router = require("express").Router();
module.exports=(req, res, next)=>{
    try{
        const token=req.cookies.access_token;
        // req.headers.authorization.split(" ")[1];
        
        const decoded= jwt.verify(token, process.env.JWT_KEY);
        req.userData=decoded;
        next();
    }catch(error){
        return res.status(401).render('login');
    }
        
}