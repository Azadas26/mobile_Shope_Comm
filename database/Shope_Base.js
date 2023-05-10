var db = require('../connection/Database_Connection')
var collection = require('../connection/DB_Collections')
var Promise = require('promise')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports =
{
    Shope_Details_Into_Temp_Collection: (info) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Temp_For_shope_accept).insertOne(info).then((data) => {
                //console.log(data.ops[0]._id);
                resolve(data.ops[0]._id)
            })
        })
    },
    Do_Shope_Login: (data) => {
        return new Promise(async (resolve, reject) => {
            var state =
            {
                status: null,
                suser: null

            }
            await db.get().collection(collection.shope_base).findOne({ email: data.email }).then(async (email) => {
                if (email) {
                    await bcrypt.compare(data.password, email.password).then((pwd) => {
                        if (pwd) {
                            console.log("Login Successsfull...");
                            state.status = true;
                            state.suser = email
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
    Add_Productt_Details_From_ShopeUser: (info) => {

        return new Promise(async (resolve, reject) => {
            info.selluser = await objectId(info.selluser)

            db.get().collection(collection.Shope_Products).insertOne(info).then((data) => {

                resolve(data.ops[0]._id)
            })
        })
    },
    View_ShopeUser_Added_ProductS: (Id) => {
        return new Promise(async (resolve, reject) => {
            var prodetails = await db.get().collection(collection.Shope_Products).find({ selluser: objectId(Id) }).toArray()
            resolve(prodetails)
        })
    },
    Remove_Shope_products_By_Shope_User: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Shope_Products).removeOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    Get_Products_information_For_EDIT: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Shope_Products).findOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    Update_Edited_Product_Bythe_ShopeUser: (Id, info) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Shope_Products).updateOne({ _id: objectId(Id) },
                {
                    $set:
                    {
                        pname: info.pname,
                        mnumber: info.mnumber,
                        type: info.type,
                        price: info.price,
                        discription: info.discription
                    }
                }).then((data) => {
                    resolve(data)
                })
        })
    },
    Get_Information_of_ShopeUser_For_Profile_edit: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.shope_base).findOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    Edit_Shope_user_information_By_theShopeUser: (Id, info) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.shope_base).updateOne({_id:objectId(Id)},
            {
                $set:
                {
                    sname:info.sname,
                    address:info.address,
                    pincode:info.pincode,
                    location:info.location
                }
            }).then((data)=>
            {
                resolve(data)
            })
        })
    },
    Delete_ShopeUser_By_theSameUser:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(collection.shope_base).removeOne({_id:objectId(Id)}).then((data)=>
            {
                resolve()
            })
        })
    },
    Delet_All_Porducts_From_Shope_Products_BassedOn_ShopeUser:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            db.get().collection(collection.Shope_Products).remove({selluser:objectId(Id)}).then((data)=>
            {
                resolve()
            })
        })
    }
}
