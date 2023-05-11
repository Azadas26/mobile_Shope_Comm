var express = require('express');
var router = express.Router();
var shopbase = require('../database/Shope_Base')
var upperCase= require('upper-case')


module.exports.verfyshopeLogin = (req, res, next) => {
    if (req.session.sstatus) {
        next()
    }
    else {
        res.redirect('/shope/login')
    }
}
/* GET users listing. */
//Starting Shope Routing..

router.get('/', function (req, res, next) {
    if (req.session.sstatus) {
        res.render('./shope/first-page', { shopehd: true, suser: req.session.suser })
    }
    else {
        res.render('./shope/first-page', { shopehd: true })
    }

});

router.get('/signup', (req, res) => {
    res.render('./shope/signup-page', { shopehd: true })
})

router.post('/signup', (req, res) => {
    
    req.body.subdistric = upperCase.upperCase((req.body.subdistric))
    console.log(req.body.subdistric);
    shopbase.Shope_Details_Into_Temp_Collection(req.body).then((Id) => {
        if (req.files.image) {
            var image = req.files.image
            image.mv("public/Shope_image/" + Id + ".jpg", (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        res.redirect("/shope/signup")
    })
})

router.get('/login', (req, res) => {
    if (req.session.sfaild) {
        res.render('./shope/login-page', { shopehd: true, faild: "Incorrect Username or Password" })
        req.session.sfaild = false;
    }
    else {
        res.render('./shope/login-page', { shopehd: true })
    }

})
router.post('/login', (req, res) => {

    shopbase.Do_Shope_Login(req.body).then((state) => {
        if (state.status) {
            req.session.sstatus = true;
            req.session.suser = state.suser;
            res.redirect('/shope')
        }
        else {
            req.session.sfaild = true
            res.redirect('/shope/login')
        }
    })

})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/shope/login')
})
router.get('/addpro', this.verfyshopeLogin, (req, res) => {
    res.render('./shope/add-product', { shopehd: true, suser: req.session.suser })
})
router.post('/addpro', (req, res) => {
    req.body.selluser = req.session.suser._id
    shopbase.Add_Productt_Details_From_ShopeUser(req.body).then((Id) => {
        res.redirect('/shope/addpro')
        var image1 = req.files.image1
        var image2 = req.files.image2
        var image3 = req.files.image3
        if (image1) {
            image1.mv("public/product-image/" + Id + "1.jpg")
            image2.mv("public/product-image/" + Id + "2.jpg")
            image3.mv("public/product-image/" + Id + "3.jpg")
        }
    })
})
router.get('/viewpro', this.verfyshopeLogin, (req, res) => {
    shopbase.View_ShopeUser_Added_ProductS(req.session.suser._id).then((pro) => {
        res.render('./shope/view-products', { shopehd: true, suser: req.session.suser, pro })
    })
})
router.get('/remove', this.verfyshopeLogin, (req, res) => {
    shopbase.Remove_Shope_products_By_Shope_User(req.query.id).then((data) => {
        res.redirect('/shope/viewpro')
    })
})
router.get('/edit', (req, res) => {
    shopbase.Get_Products_information_For_EDIT(req.query.id).then((info) => {

        res.render('./shope/edit-product', { shopehd: true, suser: req.session.suser, info })
    })
})
router.post('/edit', (req, res) => {
    var id = req.query.id
    shopbase.Update_Edited_Product_Bythe_ShopeUser(req.query.id, req.body).then((data) => {
        res.redirect('/shope/viewpro')
        if (req.files.image1) {

            var image1 = req.files.image1
            image1.mv("public/product-image/" + id + "1.jpg")

        }
        if (req.files.image2) {

            var image2 = req.files.image2
            image2.mv("public/product-image/" + id + "2.jpg")

        }
        if (req.files.image3) {

            var image3 = req.files.image3
            image3.mv("public/product-image/" + id + "3.jpg")
        }
    })
})
router.get('/editaccount', this.verfyshopeLogin, (req, res) => {
    shopbase.Get_Information_of_ShopeUser_For_Profile_edit(req.query.id).then((info) => {
        res.render('./shope/edit-suserAccount', { shopehd: true, suser: req.session.suser, info })
    })

})
router.post('/editaccount', (req, res) => {
    var orgId = req.session.suser.id;
   
    shopbase.Edit_Shope_user_information_By_theShopeUser(req.session.suser._id, req.body).then((data) => {
        res.redirect('/shope')
        if (req.files.image) {
            var image = req.files.image;
            image.mv("public/Shope_image/" + orgId + ".jpg")
        }
    })
})
router.get('/removeaccount',this.verfyshopeLogin,async(req,res)=>
{
      await shopbase.Delete_ShopeUser_By_theSameUser(req.session.suser._id).then(()=>
      {
         shopbase.Delet_All_Porducts_From_Shope_Products_BassedOn_ShopeUser(req.session.suser._id).then(()=>
         {
            req.session.destroy()
            res.redirect('/shope')
         })
      })
})

module.exports = router;
