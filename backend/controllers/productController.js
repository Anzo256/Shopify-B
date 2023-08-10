const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAysncErrors = require("../middleware/catchAysncErrors");
const ApiFeatures = require("../utils/apifeatures");



//create Product--Admin
exports.createProduct = catchAysncErrors(async(req,res,next) =>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success:true,
      product,
    });

});

//Get all products
exports.getAllProducts =catchAysncErrors(async(req, res) =>{

  const resultPerpage = 5;
  const productCount  = await Product.countDocuments();

  const apiFeature = new  ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerpage);
  const products = await apiFeature.query;

     res.status(200).json({
       success:true,
       products
    });
});

//Get Product Details
exports.getProductDetails = catchAysncErrors(async(req,res,next)=>{
   const  product  = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorHandler("Product not found!",404));
      
    }

    res.status(200).json({
      success:true,
      product,
      productCount,
    });
});



//Update product--Admin
exports.updateProduct = catchAysncErrors(async(req,res,next)=>{
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found!",404));
    
  }
product = await Product.findByIdAndUpdate(req.params.id, req.body,{
  new:true,
  runValidators:true,
  useFindAndModify:false
});

  res.status(200).json({
  success:true,
  product
 });
});

//Delete Product
exports.deleteProduct = catchAysncErrors(async(req,res,next)=>{
   const product = await Product.findById(req.params.id);

   if (!product) {
    return next(new ErrorHandler("Product not found!",404));
    
     }
  await product.remove();
  res.status(200).json({
      success:true,
      message:"Product Deleted Successfully"
  });
});
