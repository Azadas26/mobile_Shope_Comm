var db = require('../connection/Database_Connection')
var collection = require('../connection/DB_Collections')
var Promise = require('promise')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports =
{
    Get_Shope_details_from_TempCollection: () => {
        return new Promise(async (resolve, reject) => {
            var shopes = await db.get().collection(collection.Temp_For_shope_accept).find().toArray()
            resolve(shopes)
        })
    },
    Shope_signup_By_Admin: (info) => {
        return new Promise(async (resolve, reject) => {
            info.id = objectId(info.id)
            info.password = await bcrypt.hash(info.password, 10);
            db.get().collection(collection.shope_base).insertOne(info).then((data) => {

                resolve(data.ops[0].id)
                //console.log(data.ops[0].id);
            })
        })
    },
    Remove_Shope_User_From_temBase: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Temp_For_shope_accept).removeOne({ _id: objectId(Id) }).then((data) => {
                // console.log(data);
                resolve(data)
            })
        })
    },
    Do_Admin_Login: (info) => {
        return new Promise(async (resolve, reject) => {
            // console.log(info);
            await db.get().collection(collection.Admin_base).findOne({ name: info.name }).then((username) => {
                console.log(username);
                if (username) {
                    if (username.password === info.password) {
                        console.log("Admin Login Successfull...");
                        resolve({ status: true, username })
                    }
                    else {
                        console.log("Incorrect Password");
                        resolve({ status: false })
                    }
                }
                else {
                    console.log("Incorrect UserName");
                    resolve({ status: false })
                }
            })
        })
    },
    Find_All_Availabe_Shope_users: () => {
        return new Promise(async (resolve, reject) => {
            var shopes = await db.get().collection(collection.shope_base).find().toArray()
            resolve(shopes)
        })
    },
    Find_all_Available_UserInformations: () => {
        return new Promise(async (resolve, reject) => {
            var users = await db.get().collection(collection.User_base).find().toArray()
            resolve(users)
        })
    },
    Find_AvaiLable_Products_By_ADMIN: () => {
        return new Promise(async (resolve, reject) => {
            var pro = await db.get().collection(collection.Shope_Products).aggregate([
                {
                    $lookup:
                    {
                        from:collection.shope_base,
                        localField:'selluser',
                        foreignField:'_id',
                        as:'information'

                    }
                },
                {
                    $project:
                    {
                        pname:1,
                        mnumber:1,
                        type:1,
                        price:1,
                        discription:1,
                        shope:
                        {
                            $arrayElemAt: [ '$information', 0] 
                        }
                    }
                }
            ]).toArray()
            console.log(pro);
            resolve(pro)
        })
    }
}

