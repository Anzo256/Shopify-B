const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const ErrorHandler = require("../utils/errorhandler");
const catchAysncErrors = require("../middleware/catchAysncErrors");

//Create new Order
exports.newOrder = catchAysncErrors(async(req,res,next)=>{
    const{
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

//get Single order
exports.getSingleOrder =catchAysncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
        );
    if (!order) {
        return next(new ErrorHandler("Order with this id, isnt found",404));
    }

    res.status(200).json({
        success:true,
        order,
    })
})

//get logged in user orders
exports.myOrders =catchAysncErrors(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success:true,
        orders,
    })
})

//get all  orders--Admin
exports.getAllOrders =catchAysncErrors(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) =>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })
})

//Update order status--Admin
exports.updateOrder =catchAysncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order with this id is't found", 404));
    }

    if (order.orderStatus === "Deliverd") {
        return next(new ErrorHandler("You have already delivered this order",404));
    }

    order.orderItems.forEach(
       async  (order)=>{
            await updateStock(order.product, order.quantity);
        }
    )
    order.orderStatus = req.body.status;
   
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
     
    await order.save({ validateBeforeSave: false});
    res.status(200).json({
        success:true,
    })
})

async function updateStock (id,quantity){
  const product = await Product.findById(id);
 
  if (product) {
    //Ensure the Stock doesnt go below zero
    product.Stock = Math.max(product.Stock - quantity,0)
  }
  await product.save({validateBeforeSave: false});
}


//Delete orders--Admin
exports.deleteOrder =catchAysncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorHandler("Order with id not found",400));
    }

    await Order.deleteOne({ _id: order._id});

    res.status(200).json({
        success:true,
    
    })
})