var db = require('../connection/Database_Connection')
var collection = require('../connection/DB_Collections')
var Promise = require('promise')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports =
{
    Do_User_Signup: (info) => {
        return new Promise(async (resolve, reject) => {

            info.password = await bcrypt.hash(info.password, 10);
            db.get().collection(collection.User_base).insertOne(info).then((data) => {

                resolve(data.ops[0].id)

            })
        })
    },
    Do_User_LOgin: (info) => {
        return new Promise(async (resolve, reject) => {
            var state =
            {
                status: null,
                user: null

            }
            await db.get().collection(collection.User_base).findOne({ email: info.email }).then(async (email) => {
                if (email) {
                    await bcrypt.compare(info.password, email.password).then((pwd) => {
                        if (pwd) {
                            console.log("Login Successsfull...");
                            state.status = true;
                            state.user = email
                            resolve(state)
                        }
                        else {
                            console.log("Incorrect Password..");
                            resolve({ status: false })
                        }
                    })
                }
                else {
                    console.log("Incorrect MailAddress...");
                    resolve({ status: false })
                }
            })
        })
    },
    Find_Shope_BytheUser_respectTo_His_Location: (location) => {
        return new Promise(async (resolve, reject) => {
            var shopes = await db.get().collection(collection.shope_base).find({ subdistric: location }).toArray()
            resolve(shopes)
        })
    },
    Get_All_Product_Under_Thes_selectedShop: (Id, typ) => {
        return new Promise(async (resolve, reject) => {
            var products = await db.get().collection(collection.Shope_Products).find({ selluser: objectId(Id), type: typ }).toArray()
            //console.log(products);
            resolve(products)
        })
    },
    Find_Shop_Details_For_PoductAttachment: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.shope_base).findOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    }
}