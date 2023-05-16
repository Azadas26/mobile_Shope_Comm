var express = require('express');
var router = express.Router();
var userdb = require('../database/User_Base')
var upperCase = require('upper-case')

var verfyUserLogin = (req, res, next) => {
  if (req.session.status) {
    next()
  }
  else {
    res.redirect('/login')
  }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    if (req.session.falselocation) {
      res.render('./user/first-page', { userhd: true, user: req.session.user, noshope: "Nothing Found.." })
      req.session.falselocation = false
    }
    else {
      res.render('./user/first-page', { userhd: true, user: req.session.user })
    }
  }
  else {
    res.render('./user/first-page', { userhd: true })
  }
});
router.get('/signup', (req, res) => {

  res.render('./user/signup-page', { userhd: true })
})
router.post('/signup', (req, res) => {
  userdb.Do_User_Signup(req.body).then((data) => {
    res.redirect('/signup')
  })
})
router.get('/login', (req, res) => {
  if (req.session.faild) {
    res.render('./user/login-page', { userhd: true, err: "Incorrect UserName or Password" })
    req.session.faild = false
  }
  else {
    res.render('./user/login-page', { userhd: true })
  }
})
router.post('/login', (req, res) => {
  userdb.Do_User_LOgin(req.body).then((state) => {
    if (state.status) {
      req.session.user = state.user;
      req.session.status = true
      console.log(req.session.user);
      res.redirect('/')
    }
    else {
      req.session.faild = true
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

router.post('/findlocation', verfyUserLogin, (req, res) => {
  req.body.location = upperCase.upperCase(req.body.location)
  userdb.Find_Shope_BytheUser_respectTo_His_Location(req.body.location).then((shope) => {
    if (shope[0]) {
      //console.log(shope);
      res.render('./user/shope-details', { userhd: true, user: req.session.user, shops: shope })
    }
    else {

      req.session.falselocation = true
      res.redirect('/')
    }
  })
})
router.get('/intoshop', verfyUserLogin, (req, res) => {
  var type = 'Mobile Phone'
  userdb.Get_All_Product_Under_Thes_selectedShop(req.query.id, type).then((pro) => {
    userdb.Find_Shop_Details_For_PoductAttachment(req.query.id).then((shop) => {
      //console.log(pro, shop);
      res.render('./user/products-page', { userhd: true, user: req.session.user, pro, shop })
    })
  })
})
router.get('/laoptoppro', verfyUserLogin, (req, res) => {
  var type = 'Laptop'
  userdb.Get_All_Product_Under_Thes_selectedShop(req.query.id, type).then((lap) => {
    userdb.Find_Shop_Details_For_PoductAttachment(req.query.id).then((shop) => {
      //console.log(lap, shop);
      res.render('./user/laptop-view', { userhd: true, user: req.session.user, lap, shop })
    })
  })
})
router.get('/otherpro', verfyUserLogin, (req, res) => {
  var type = 'Others'
  userdb.Get_All_Product_Under_Thes_selectedShop(req.query.id, type).then((oth) => {
    userdb.Find_Shop_Details_For_PoductAttachment(req.query.id).then((shop) => {
      //console.log(oth, shop);
      res.render('./user/other-view', { userhd: true, user: req.session.user, oth, shop })
    })
  })
})
router.get('/smartwatch', verfyUserLogin, (req, res) => {
  var type = 'Smart Watch'
  userdb.Get_All_Product_Under_Thes_selectedShop(req.query.id, type).then((swh) => {
    userdb.Find_Shop_Details_For_PoductAttachment(req.query.id).then((shop) => {
      //console.log(swh, shop);
      res.render('./user/swatch-view', { userhd: true, user: req.session.user, swh, shop })
    })
  })
})
router.get('/edituseracc', verfyUserLogin, (req, res) => {
   userdb.Get_User_all_Details_For_EditORUpdate_Account(req.session.user._id).then((userinfo)=>
   {
     res.render('./user/edit-info', { userhd: true, user: req.session.user, us: userinfo })
   })
})
router.post('/edituseracc', verfyUserLogin, (req, res) => {
  console.log(req.body);
     userdb.Edit_OR_Update_User_Information(req.session.user._id,req.body).then((data)=>
     {
        res.redirect('/')
     })
})

router.get('/deleteuser',verfyUserLogin,(req,res)=>
{
    userdb.Delete_User_Account_By_itself(req.session.user._id).then(()=>
    {
       res.redirect('/')
    })
})
router.get('/proinfos',(req,res)=>
{
  userdb.Find_Products_Details_By_porduct_Clicked(req.query.id).then((data)=>
  {
    console.log(data);
    res.render('./user/inside-pro', { userhd: true, user: req.session.user,pros:data})
  })
})
router.get('/about',(req,res)=>
{
  res.render('./user/about-page', { userhd: true, user: req.session.user })
})

module.exports = router;
