var express = require('express');
var router = express.Router();
let passport = require('passport');
const localStrategy = require('passport-local')
const userModel = require('../models/user');
const postModel = require("../models/posts");
const storyModel = require("../models/story");
const upload = require('../utils/multer');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Instagram' });
});

/* login / post */
router.post("/",
  passport.authenticate("local", {
      failureRedirect: "/",
      successRedirect: "/instagram",
  }),
  function (req, res, next) {
  }
);

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/register",async function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
  });
  
  userModel.register(newUser, req.body.password)
    .then(function (u) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/instagram");
      });
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/instagram",
    failureRedirect: "/",
  }),
  function (req, res, next) { }
);

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// *******************************************************************

router.get("/instagram", isloggedIn, async function (req, res, next) {
  let loggedinuser = await userModel.findOne({
    username: req.session.passport.user,
  });
  console.log(loggedinuser)
  let allposts = await postModel.find().populate("userid");
  let allstories = await storyModel.find().populate("userid");
  let story = await storyModel.findOne({ userid: loggedinuser._id });
  let allusers = await userModel.find()
  res.render("instagram", {
    loggedinuser: loggedinuser,
    allposts: allposts,
    story: story,
    allstories: allstories,
    allusers: allusers
  });
});

router.get('/profile/:username',async function(req,res,next){
    let user = await userModel.findOne({username:req.params.username})
    // let allpost = await postModel.find({ userid: user._id }).populate("userid")
    let loggedinuser = await userModel.findOne({
    username: req.session.passport.user,
  });
    res.render('profile',{user,loggedinuser})
})
router.post('/upload',upload.single('profileImage'),async(req,res,next)=>{
    let user = await userModel.findOne({username:req.session.passport.user})
    user.profileImage = req.file.filename
    user.save()
    res.redirect('back')
})

// create post route
router.get('/createpost',async function(req,res,next){
  res.render('createpost',{title:"create post"})
})

module.exports = router;
