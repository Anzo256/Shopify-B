import React from 'react'
import playStore from"../../../images/playstore.png"
import appStore from "../../../images/Appstore(1).png"
import "./Footer.css";

const Footer = () => {
  return (
    <footer id='footer'>

      <div className='leftFooter'>
       <h4>DOWNLOAD OUR APP</h4>
       <p>Download App for Android and IOS mobile phones</p>
       <img src={playStore} alt='playstore'/> 
       <img src={appStore} alt='Applest'/>
      </div>
      <div className='midFooter'>
        <h1>Shopify-B.</h1>
        <p>High Quality is Our First Priority</p>
        <p>Copyrights 2023 &copy; Shopify-B Inc. Anzoangelo</p>
      </div>
      <div className='rightfooter'>
        <h4>Follow Us</h4>
        <a href='/'>Instagram</a>
        <a href='/'>Twitter</a>
        <a href='/'>FaceBook</a>
        
      </div>

    </footer>
  )
}

export default Footer