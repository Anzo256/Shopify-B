import { useEffect } from 'react'
import './App.css'
import Header from "./component/layout/Header/Header.jsx"
import Footer from './component/layout/Footer/Footer.jsx'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import webfont from "webfontloader"
import Home from "./component/Home/Home.jsx"

function App() {
  useEffect(()=>{
 webfont.load({
  google:{
    families:["Roboto","Droid sans","Chilanka"]
  }
 })
  },[])
  return (
    <>
     <Router>
      <Header/>
      <Routes>
          <Route  path='/' element={<Home/>}/>
      </Routes>
      <Footer/>
     </Router>  
    </>
  )
}

export default App
