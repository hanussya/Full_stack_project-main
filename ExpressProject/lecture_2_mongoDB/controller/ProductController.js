const {createFactory,getAllFactory,getByIdFactory,deleteByIdFactory}=require("../utility/crudFactory");
const ProductModel=require("../model/ProductModel")
const createProductHandler= createFactory(ProductModel);
const getAllProductHandler= getAllFactory(ProductModel);
const getProductByIdHandler= getByIdFactory(ProductModel);
const deleteProductById = deleteByIdFactory(ProductModel);
module.exports={createProductHandler,getAllProductHandler,getProductByIdHandler,deleteProductById};