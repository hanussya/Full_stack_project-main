const express=require("express");
const {checkInputValue}= require("../controller/middleware.js");
const {createProductHandler,getAllProductHandler,getProductByIdHandler,deleteProductById}= require("../controller/ProductController.js")
const ProductRouter= express.Router();

ProductRouter.post("/", checkInputValue,createProductHandler);
ProductRouter.get("/", getAllProductHandler);
ProductRouter.get("/:productId", getProductByIdHandler);
ProductRouter.delete("/:productId", deleteProductById);
module.exports=ProductRouter;