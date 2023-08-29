import React from 'react'
import {CgMouse} from "react-icons/cg"
import "./Home.css"
import Product from './Product.jsx'


const  product={
    name:"Blue Tshirt",
    images:[{url:"/"}],
    price: "30000",
    _id:"susan",
};
const Home = () => {
  return (
    <>
     <div className="banner">
        <p>Welcome to Shopify-B</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href='#container'>
            <button>
            Scroll <CgMouse/>
            </button>
        </a>
     </div>
     <h2 className='homeHeading'>Featured Products</h2>

     <div className="container" id="container">
       <Product product={product}/>
       <Product product={product}/>
       <Product product={product}/>
       <Product product={product}/>
       <Product product={product}/>
       <Product product={product}/>
       <Product product={product}/>
       <Product product={product}/>
     </div>
    </>
  )
}

export default Home