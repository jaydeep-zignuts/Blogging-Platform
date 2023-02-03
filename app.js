const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const expressValidator=require('express-validator');
const validationResult=require('express-validator');
const fileUpload=require('express-fileupload')
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('secret'));

app.set('view engine','ejs');
const adminRoutes = require("./api/routes/admin_route");
const userRoutes = require("./api/routes/user_route");
const defaultRoute = require("./api/routes/default_route");

mongoose.set('strictQuery', false);
mongoose.connect(
  "mongodb://jaydeepa:6M8tcWhCoJJAptz66e92W0Z9@15.206.7.200:28017/jaydeepa?authSource=admin&readPreference=primary&directConnection=true&ssl=false",
  {
    useNewUrlParser:true
  }
);
app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace=param.split(".")
        , root =namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param : formParam,
            msg : msg ,
            value : value
        };
    }
}));


app.use(morgan("dev"));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, PATCH, POST, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(fileUpload({
  useTempFiles:true
}));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use('/',defaultRoute)

// router.get("/login", AdminController.renderAdminLogin);

// app.use(express.static('./template'));
// app.use(express.static('/html'));
// app.use(express.static('./assets'));
app.use('/assets',express.static(__dirname + '/assets'));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
app.use(function(req,res,next){
  res.locals.errors=null;
  next();
});


module.exports = app;
