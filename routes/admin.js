var express = require('express');
var router = express.Router();
var adminDb = require('../database/Admin_Base')

module.exports.verfyAdminLigin = (req,res,next)=>
{
  if(req.session.adminstatus)
  {
    next()
  }
  else
  {
    res.redirect('/admin')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  if(req.session.adminfaild)
  {
    res.render('./admin/login-form', { adminhd: true,err:"Incorrect UserName or Password"})
    req.session.adminfaild=false
  }
  else
  {
    res.render('./admin/login-form', { adminhd: true })
  }
  
});
router.get('/accept',this.verfyAdminLigin,(req, res) => {
  adminDb.Get_Shope_details_from_TempCollection().then((shopes) =>
  {
    console.log(req.session.admin);
    res.render('./admin/Accept-shope', { adminhd: true,shopes,user:req.session.admin})
  })

})
router.post('/accept',async(req,res)=>
{
  await adminDb.Shope_signup_By_Admin(req.body).then((Id)=>
   {
      if(Id)
      {
         adminDb.Remove_Shope_User_From_temBase(Id).then((data)=>
         {
             res.redirect('/admin/accept')
         })
      }
   })
})

router.get('/rejectshope',(req,res)=>
{
  adminDb.Remove_Shope_User_From_temBase(req.query.id).then((data)=>
  {
    res.redirect('/admin/accept')
  })
})
router.post('/',(req,res)=>
{
  
   adminDb.Do_Admin_Login(req.body).then((state)=>
   {
      if(state.status)
      {
         req.session.adminstatus=true;
        req.session.admin = state.username
        res.redirect('/admin/accept')
      }
      else
      {
        req.session.adminfaild=true
        res.redirect('/admin')
      }
   })
})
router.get('/logout',(req,res)=>
{
   req.session.destroy()
   res.redirect('/admin')
})

router.get('/showshops',this.verfyAdminLigin,(req,res)=>
{
    adminDb.Find_All_Availabe_Shope_users().then((data)=>
    {
      console.log(data);
      res.render('./admin/shop-users', { adminhd: true, shop: data, user: req.session.admin })
    })
})
router.get('/showusers',this.verfyAdminLigin,(req,res)=>
{
   adminDb.Find_all_Available_UserInformations().then((data)=>
   {
    console.log(data);
     res.render('./admin/normal-users', { adminhd: true, users: data, user: req.session.admin })
   })
})
router.get('/showproducts',(req,res)=>
{
   adminDb.Find_AvaiLable_Products_By_ADMIN().then((proo)=>
   {
     res.render('./admin/product-info', { adminhd: true, user: req.session.admin,proo})
   })
})

module.exports = router;
