let mongodb = require("mongodb");
let sambaIT = mongodb.MongoClient;

let products = require("express").Router().get("/",(req,res)=>{
    sambaIT.connect("mongodb+srv://admin:admin@mycluster.sup8t.mongodb.net/MyDB?retryWrites=true&w=majority",(err,xyz)=>{
        if(err) throw err;
        else{
            console.log("hiiiii")
            let db = xyz.db("MyDB");
                // db.collection("MyCollection").find({"subcategory":"AC" }).toArray((err,array)=>{
                    db.collection("MyCollection").find().toArray((err,array)=>{
                if (err) throw err;
                else{
                    res.send(array);
                }
            });
        }
    });

});

module.exports = products;