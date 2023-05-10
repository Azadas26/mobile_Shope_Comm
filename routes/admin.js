var express = require('express');
var router = express.Router();
var adminDb = require('../database/Admin_Base')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./user/first-page', { adminhd: true })
});
router.get('/accept', (req, res) => {
  adminDb.Get_Shope_details_from_TempCollection().then((shopes) =>
  {
    res.render('./admin/Accept-shope', { adminhd: true,shopes})
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
module.exports = router;
