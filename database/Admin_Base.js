var db = require('../connection/Database_Connection')
var collection = require('../connection/DB_Collections')
var Promise = require('promise')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports=
{
    Get_Shope_details_from_TempCollection:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
           var shopes = await db.get().collection(collection.Temp_For_shope_accept).find().toArray()
           resolve(shopes)
        })
    },
    Shope_signup_By_Admin:(info)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            info.id=objectId(info.id)
            info.password = await bcrypt.hash(info.password,10);
            db.get().collection(collection.shope_base).insertOne(info).then((data)=>
            {
                
                resolve(data.ops[0].id)
                //console.log(data.ops[0].id);
            })
        })
    },
    Remove_Shope_User_From_temBase:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
           await db.get().collection(collection.Temp_For_shope_accept).removeOne({_id:objectId(Id)}).then((data)=>
            {
               // console.log(data);
                resolve(data)
            })
        })
    }
}