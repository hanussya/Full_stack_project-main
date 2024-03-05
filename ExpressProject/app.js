const express= require("express");
const app= express();
console.log("Hello");
const fs= require("fs");
const strContent =fs.readFileSync("./dev_data.json", "utf-8");
// JSON.parse(strContent);
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter);

// app.use-> a method -> express
app.use(function (req,res,next){
    console.log("before", req.body);
    next();
})

app.use(express.json());
app.post("/api/user", function(req, res){
    console.log("I am inside app.post", req.body);
    res.status(200).json({
        status:"Success",
        message:"got the p0ost request"
    })
})
app.get("/api/user", function(req, res){
    console.log("I am inside app.get");
    res.status(200).json({
        status:"Success",
        message:"got the get request"
    })
})

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