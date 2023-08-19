const express = require("express");
const { getAllProducts,
        createProduct, 
        updateProduct, 
        deleteProduct, 
        getProductDetails, 
        cretaeProductReview,
        getProductReviews,
        deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/product/new').post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);
router.route('/product/:id').put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct).get(getProductDetails);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser, cretaeProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);
module.exports = router