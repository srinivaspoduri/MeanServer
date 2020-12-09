let express = require("express")

let app = express();//app is the master object by using express module -master obj is used to colloborate the modules.


//body-parser module used to accept the data form client(UI)

let bodyparser = require("body-parser");
var jwt = require('jsonwebtoken');
//setting the communication between client (angular) and server(node)
//it wont support other formats,cient should send only json format
app.use(bodyparser.json())
//after server reciving the json , server should parse/read the data.
//extended:false means read the data coming from client.
app.use(bodyparser.urlencoded({ extended: false }))

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept")
    next();
})
//enable to ports communiction
let cors = require("cors")
app.use(cors())

//to create client to connect db from server(node)
let mongodb = require("mongodb");
let sambaIT = mongodb.MongoClient;
//app.use("/products",require("./getproducts"))//to get all employee

//REST API to get all the products from DB with paging
app.get("/products", (req, res) => {

    let page = ( req.query.page!=undefined && req.query.page!=0 ) ? req.query.page : 1;
    let limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10

    let startvalue;
    let endvalue;
    if (page > 0) {
        startvalue = (page * 10) - 10;
        endvalue = page * 10
    }
    else {
        startvalue = 0
        endvalue = 0
    }

    sambaIT.connect("mongodb+srv://admin:admin@mycluster.sup8t.mongodb.net/MyDB?retryWrites=true&w=majority", (err, xyz) => {
        if (err) throw err;
        else {
            console.log("hiiiii")
            let db = xyz.db("MyDB");
            // db.collection("MyCollection").find({"subcategory":"AC" }).toArray((err,array)=>{
            db.collection("MyCollection").find().toArray((err, array) => {
                if (err) throw err;
                else {
                    let arr1= array.slice(startvalue,endvalue)
                    console.log(page,startvalue, endvalue)
                    let arr2= arr1.splice(0,parseInt(limit))
                    if(arr2.length>0)
                    {
                        res.status(200).json({
                            count: arr2.length,
                            products:arr2
                        })
                    }
                    else{
                        res.json({"message":"products not available"});
                    }
                   
                }
            });
        }
    });

});

app.get("/Allproducts", (req, res) => {

  
    sambaIT.connect("mongodb+srv://admin:admin@mycluster.sup8t.mongodb.net/MyDB?retryWrites=true&w=majority", (err, xyz) => {
        if (err) throw err;
        else {
            console.log("hiiiii")
            let db = xyz.db("MyDB");
            // db.collection("MyCollection").find({"subcategory":"AC" }).toArray((err,array)=>{
            db.collection("MyCollection").find().toArray((err, array) => {
                if (err) throw err;
                else {
                  
                    if(array.length>0)
                    {
                        res.status(200).json({
                            count: array.length,
                            products:array
                        })
                    }
                    else{
                        res.json({"message":"products not available"});
                    }
                   
                }
            });
        }
    });

});
app.get("/products/category/:key", (req, res) => {

    app.use((req,res,next)=>{
        res.setHeader('Access-Control-Allow-Origin','*')
        res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept")
        next();
    })
  
    sambaIT.connect("mongodb+srv://admin:admin@mycluster.sup8t.mongodb.net/MyDB?retryWrites=true&w=majority", (err, xyz) => {
        if (err) throw err;
        else {
            console.log("hiiiii")
            let db = xyz.db("MyDB");
            // db.collection("MyCollection").find({"subcategory":"AC" }).toArray((err,array)=>{
            db.collection("MyCollection").find({category:req.params.key}).toArray((err, array) => {
                if (err) throw err;
                else {
                  
                    if(array.length>0)
                    {
                        res.status(200).json({
                            count: array.length,
                            products:array
                        })
                    }
                    else{
                        res.json({"message":"products not available"});
                    }
                   
                }
            });
        }
    });

});

// to get individual category items
app.get("/products/subcategory/:key", (req, res) => {

  
    sambaIT.connect("mongodb+srv://admin:admin@mycluster.sup8t.mongodb.net/MyDB?retryWrites=true&w=majority", (err, xyz) => {
        if (err) throw err;
        else {
            console.log("hiiiii")
            let db = xyz.db("MyDB");
            // db.collection("MyCollection").find({"subcategory":"AC" }).toArray((err,array)=>{
            db.collection("MyCollection").find({subcategory:req.params.key}).toArray((err, array) => {
                if (err) throw err;
                else {
                  
                    if(array.length>0)
                    {
                        res.status(200).json({
                            count: array.length,
                            products:array
                        })
                    }
                    else{
                        res.json({"message":"products not available"});
                    }
                   
                }
            });
        }
    });

});

app.post("/login" , (req,res)=>{
    sambaIT.connect("mongodb+srv://admin:admin@mycluster.sup8t.mongodb.net/MyDB?retryWrites=true&w=majority", (err, xyz) => {
        if (err) throw err;
        else {
            console.log("hiiiii")
            let db = xyz.db("MyDB");
            db.collection("UsersCollections").find({username:req.body.username}).toArray((err,arry)=>{
                console.log(arry);
                if(err) throw err;
                else{
                    if(arry.length >0){
                        let token = jwt.sign({username:arry.username},'secret', {expiresIn : '3h'});
                        return res.status(200).json(token);

                    }  else {
                        return res.status(401).json({message:'Invalid UserName or Password'});
                      }
                }

            })
        }
    
})

})

app.post("/cart" , (req,res)=>{
    sambaIT.connect("mongodb+srv://admin:admin@mycluster.sup8t.mongodb.net/MyDB?retryWrites=true&w=majority", (err, xyz) => {
        if (err) throw err;
        else {
            console.log("hiiiii")
            let db = xyz.db("MyDB");
            db.collection("CartCollections").find({username:req.body.username}).toArray((err,arry)=>{
                console.log(arry);
                if(err) throw err;
                else{
                    if(arry.length >0){
                        res.status(200).json({
                            count: array.length,
                            cartitems:array
                        })

                    }  else {
                        return res.status(401).json({message:'no Cart Items'});
                      }
                }

            })
        }
    
})

})

app.listen(process.env.PORT || 8080,()=>{
    console.log("Server Started");
});

