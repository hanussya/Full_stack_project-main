const express= require("express");
const app= express();
console.log("Hello");
const fs= require("fs");
// const short = require('short-uuid');
const strContent =fs.readFileSync("./dev_data.json", "utf-8");
const userDataStore=JSON.parse(strContent);

 
// app.use-> a method -> express
// app.use(function (req,res,next){
//     console.log("before", req.body);
//     next();
// })

app.use(express.json());
app.use(function (req,res,next){
    if(req.method =="POST"){
        const userDetails =req.body
        const isEmpty = Object.keys(userDetails).length==0;
        if(isEmpty){
            res.status(404).json({
                status:"failure",
                message: "userDetails are empty"
            })
        }
        else{
            next();
        }
    }
    else{
        next();
    }
})
app.post("/api/user", createUserHandler);
app.get("/api/user", getAllUserHandler);
app.get("/api/user/:userId", getUserByIdHandler);


app.use(function cb(req, res){
console.log("I am inside app.use");
res.status(404).json({
    status:"Not FOUND",
    message : "Route not found"
})
})
const port=process.env.PORT || 3000
app.listen(port, function(){
    console.log("server is listening to port 3000")
})
function getUserByIdHandler(req, res){
    try{
    const userIdparam=req.params.userId;
    const userDetails=getUserById(userIdparam);
    if(userDetails== "no user found"){
throw new Error (`user not found ${userIdparam}`)
    }
    console.log("I am inside app.getparam", req.params);
    res.status(200).json({
        status:"Success",
        message:"got the get request"
    })
}catch(err){
    res.status(404).json({
        status:"user not found",
        message:err.message
    })
}
}
function createUserHandler(req, res){
    // const id= short.generate();
    const userDetails =req.body;
    userDataStore.push(userDetails);
    const struserStore =JSON.stringify(userDataStore);
    fs.writeFileSync("./dev_data.json",struserStore);
    // userDetails.id=id;

    console.log("I am inside app.post", req.body);
    res.status(200).json({
        status:"Success",
        message:`update the user with `
    })
}

function getAllUserHandler(req, res){
    try{
    
     console.log("I am inside app.get");
     // console.log("userData", userDataStore);
     if(userDataStore.length==0 || userDataStore== undefined){
         throw new Error("Not Found Exception")
     }
     res.status(200).json({
         status:"Success",
         message:userDataStore
     })
 
    
     
 }catch(err){
     res.status(404).json({
         status:"Not Found",
         message:err.message
     })
 }
 }

function getUserById(id){
    const user = userDataStore.find((user)=>{
        return user.id ==id;
    })
    if( user ==undefined){
        return "no user found";

    }else{
        return user;
    }
}