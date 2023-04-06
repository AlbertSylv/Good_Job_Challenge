import React, { useState } from 'react';
import { motion } from 'framer-motion';
import user_ from './user_.svg';
import "./App.css"
import arrow_right from './arrow_right_white.svg';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" }
};

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const screenWidth = document.documentElement.clientWidth;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }
  const closeMenu = () => {
    setIsOpen(false);
  }

  window.addEventListener('click', function(e){
    if(!document.getElementById('Menu').contains(e.target)&&!document.getElementById('MenuButton').contains(e.target)){
        closeMenu();
    }
  })

  return (
    <div style={{zIndex:3}}>
      
        <img id="MenuButton" onClick={toggleMenu} style={{paddingRight: screenWidth*0.05,paddingTop:screenWidth*0.05,width: screenWidth*0.08,height: screenWidth*0.08, float: 'right'}} src={user_}  alt="user_" />
      
      <motion.div id='Menu' style={{position:'fixed', top:0, color:"white", width:screenWidth*0.7, height:0, zIndex:3}} animate={isOpen ? "open" : "closed"} variants={variants} >
        <div className="menu container" style={{height:'100vh', backgroundColor:'#43454b', borderRight:'5px solid white', width: '70vw'}}>
            <div className="menu-item">
                <div>
                    <span style={{paddingLeft:'40px',fontFamily:'extraBold'}}>Name</span>
                </div>                    
                <div>                    
                    <span style={{paddingLeft:'40px'}}>John Doe</span>
                </div>
            </div>
            <div className="menu-item">
                <div>
                    <span style={{paddingLeft:'40px',fontFamily:'extraBold'}}>E-mail</span>
                </div>                    
                <div>                    
                    <span style={{paddingLeft:'40px'}}>blabla@mail.com</span>
                </div>
            </div>
            <div className="menu-item">
                <div>
                    <span style={{paddingLeft:'40px', fontFamily:'extraBold'}}>Points</span>
                </div>
                <div>
                    <span style={{paddingLeft:'40px'}}>1000</span>
                </div>
            </div>

            <div className="menu-item">
            <span style={{paddingLeft:'40px', fontFamily:'extraBold'}}>Leaderboard</span> <img style={{paddingLeft:'10px', verticalAlign: -1}} src={arrow_right}  alt="arrow" />
            </div>
            <div className="menu-item">
                <div style={{paddingLeft:'40px'}}>
                    <img style={{verticalAlign: -3, transform:'rotate(180deg)'}} src={arrow_right}  alt="arrow" />
                    <span style={{paddingLeft:10, fontFamily:'extraBold'}}>Log out</span>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Menu;