const express=require("express");
const app= express();
const cookieParser = require("cookie-parser");
const fs = require("fs");
const mongoose = require('mongoose');

const jwt=require("jsonwebtoken");
const promisify = require("util").promisify;
const promisifiedJWTSign=promisify(jwt.sign);
const promisifiedJWTVerify=promisify(jwt.verify);
// const payload="1234";//id if the user usually

// const port = 3040;

// const { PORT, DB_PASSWORD, DB_USER } = process.env
// const cookieParser = require("cookie-parser");
app.use(cookieParser());
const dotenv = require("dotenv");
dotenv.config();
const { PORT, DB_PASSWORD, DB_USER,JWT_SECRET } = process.env;
const secretKey =JWT_SECRET;
const UserModel =require('./model/UserModel');


const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@hanussyacluster.iv9bzry.mongodb.net/?retryWrites=true&w=majority`;
// const port = PORT;
mongoose.connect(dbURL)
    .then(function (connection) {
        console.log("connected to db");
    }).catch(err => console.log(err))

app.listen(PORT,()=>{
    console.log(`Hi Listening to port ${PORT}`)
})
app.use(express.json());
app.get("/sign", async function (req, res){
    try{
   const authToken = await promisifiedJWTSign({id: user["_id"]},secretKey)
   res.cookie("jwt",authToken , {
    maxAge: 900000000,
    httpOnly: true
})
res.status(200).json({
    status:authToken,
    message:"signed the jwt and sending it in the cookie"
})
}
    catch(err){
        res.status(400).json({
            message: err.message,
            status: "failure"
        })
    }
})
app.get("/",getData);
function getData(req,res){
    console.log("Hi get data called", req.cookies);
    res.cookie("prevPage", "home", {
        maxAge: 900000000,
        httpOnly: true
    })
    
    res.status(200).json({
        status:"success",
        message:"Thank you for accessing"
    })

}
app.get("/app/post",postData);
function postData(req,res){
    console.log(`You have already visited ${req.cookies.prevPage}`)
    if(req.cookies){
        console.log(`You have already visited ${req.cookies.prevPage}`)
    }
    console.log("Hi post data called");
    res.status(200).json({
        status:"success",
        message:"got Sucess post call"
    })
}
app.get("/clearCookies", function(req, res){
    res.clearCookie("jwt",{path:"/sign"});
    res.status(200).json({
        message:"Suceess clearing the cookie",
    })
})
async function signupController(req, res){
try{
    let userObject=req.body;

    let newUser=await UserModel.create(userObject);
    if(newUser.length ==0 ||newUser ==undefined){
        throw new Error("No Data");
    }
    res.status(200).json({
        message:"New user registered",
        UserDeatils:newUser,
    })

}catch(err){
    res.status(404).json({
        message:err.message
    })
}
}
async function loginController(req, res){
    try {

        /***
         * 1. enable login -> tell the client that user is logged In
         *      a. email and password 
         **/

        let { email, password } = req.body;
        let user = await UserModel.findOne({ email });
        if (user) {
            let areEqual = password == user.password;
            if (areEqual) {
                // user is authenticated
                /* 2. Sending the token -> people remember them
                       * */
                // payload : id of that user 
                let token = await promisifiedJWTSign({ id: user["_id"] }, JWT_SECRET);
                console.log("sendning token");
                res.cookie("jwt", token, { maxAge: 90000000, httpOnly: true, path: "/" });
                res.status(200).json({
                    status: "success",
                    message: "user logged In"
                })
            } else {
                console.log("err", err)
                res.status(404).json({
                    status: "failure",
                    message: "email or password is incorrect"
                })
            }


        } else {
            res.status(404).json({
                status: "failure",
                message:
                    "user not found with creds"
            })
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }
}
async function protectRouteMiddleWare(req, res, next){
    try{
        const jwtToken=req.cookies.jwt;
        console.log("jwtToken", jwtToken);
        console.log("JWT_SECRET", JWT_SECRET);
         let decodedToken = await promisifiedJWTVerify(jwtToken,JWT_SECRET);
         console.log("decodedToken", decodedToken);
         if(decodedToken){
            req.id=decodedToken.id;
         }
     
next();

    }catch(err){
        res.status(404).json({
            message:err.message
        })
    }
}
async function getUserData(req, res){
    try{
        const user=await UserModel.findById(req.id);
        res.status(200).json({
            message:"User Details",
            UserDeatils:user,
        })

    }catch(err){
        res.status(404).json({
            message:err.message
        })
    }
}
app.post("/signup", signupController);
app.post("/login", loginController);
app.get("/allowIfLoggedIn", protectRouteMiddleWare, getUserData);
