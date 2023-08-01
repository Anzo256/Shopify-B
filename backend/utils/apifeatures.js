const Product = require("../models/productModel");

class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
     
    search(){
        const keyword = this.queryStr.keyword
        ? {
            $or: [
                { category:{ $regex: this.queryStr.keyword, $options: "i"}},
                { name:{$regex: this.queryStr.keyword, $options: "i"}},
              ],
          }
        : {};

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr };
    
        //removing some fields for category
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        //filter for Price and Ratings
        if (queryCopy.minPrice || queryCopy.maxPrice) {
            const minPrice = parseFloat(queryCopy.minPrice) || 0;
            const maxPrice = parseFloat(queryCopy.maxPrice) || Number.MAX_VALUE;

            queryCopy.price = {$gte: minPrice, $lte: maxPrice};
            delete queryCopy.minPrice;
            delete queryCopy.maxPrice;
        }

        //convert price query to MongoDB query format
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|gte|lte)\b/g, (key) =>`$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));    
        return this;    
    }
    pagination(resultPerpage){
       const  currentPage = Number(this.queryStr.page) || 1;
       const skip = resultPerpage * (currentPage - 1);
       this.query = this.query.limit(resultPerpage).skip(skip);

      return this;
    }
}
module.exports = ApiFeatures