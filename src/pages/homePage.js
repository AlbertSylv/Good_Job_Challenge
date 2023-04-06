import React, { useState, useEffect } from 'react';
import '../App.css';
import arrow_right from '../arrow right icon_.svg';
import arrow_right_white from '../arrow_right_white.svg';

import {motion, useIsPresent} from 'framer-motion'; 
import { Link } from 'react-router-dom';
import baseURL from '../baseURL';
import Menu from '../Menu';
import { getCookie } from '../getCookie';
import { getUserPoints } from '../getUserPoints';
import getCurrentUser from '../getCurrentUser';


const Box = ({ title, points, size, textSizeSmall }) => {

    return(
    <div style={{
      backgroundColor: '#FFF181',
      height: `${size}px`,
      position: 'relative',
      margin: '3px',
      padding: '10px',
      
    }}>
      <div style={{ position: 'absolute',
              fontSize: textSizeSmall,
        top: `${size/8}px`,
        left: `${size/8}px`, margin: '0 0 10px 0', paddingRight:"20px" }}>The <span style={{fontFamily:"Extrabold"}}>{title}</span></div>
      <div style={{
        fontSize: `${size / 2.5}px`,
        margin: '10px 0',
        position: 'absolute',
        bottom: `${(size/8)}px`,
        left: `${size/8}px`,
        fontFamily:"Extrabold"
  
      }}>{points}</div>
      <div  style={{
        position: 'absolute',
        bottom: `${(size/8)-20}px`,
        left: `${size/8}px`,
      }}>
        <h4 style={{fontFamily:"Extrabold"}}>points</h4>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
      }}>
        <img style={{height: `${size/8}px`, width: `${size/8}px`,paddingRight:`${size/8}px`, paddingBottom:`${(size/8)-10}px`}} src={arrow_right}  alt="arrow" />
      </div>
      
    </div>
    )
  };

const HomePage = () => {
    const [boxSize, setBoxSize] = useState(0);
    const [textSize, setTextSize] = useState(0);
    const [jobs, setJobs] = useState(null);
    const [textSizeSmall, setTextSizeSmall] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);
    const [screenWidth, setScreenWidth] = useState(0);
    const isPresent = useIsPresent();
    const[currentUser,setCurrentUser]= useState(null);
    const[totalUserPoints,setTotalUserPoints]= useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(baseURL + '/items/jobs/', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ getCookie('token')
          }
        });
        const data = await response.json();
        setJobs(data.data)
      } catch (error) {
        console.error(error);
      }
    }
    const screenHeight = document.documentElement.clientHeight;
    const textSizeSmall = screenHeight*0.017;
    const textSize = screenHeight*0.065;  
    setTextSize(textSize);
    setTextSizeSmall(textSizeSmall);        
    setScreenHeight(screenHeight);         
    
    const calculateBoxSize = () => {
   
        const screenW = document.documentElement.clientWidth;

        const availableWidth = screenW - 51;
        const boxSize = Math.floor(availableWidth / 2);
        
      
        setBoxSize(boxSize);

        setScreenWidth(screenW);
        setBoxSize(boxSize);

    };


    calculateBoxSize();



    getCurrentUser().then((result) => {
      setCurrentUser(result);

      getUserPoints(result.data).then((pointsResult) => {
        let total = 0;
        pointsResult.forEach((userJob) => (total += userJob.Points));
        setTotalUserPoints(total);

      }).catch((error) => {
        console.error(error);
      });

    }).catch((error) => {
      console.error(error);
    });


    window.addEventListener('resize', calculateBoxSize);
    fetchJobs();
    return () => {
        
        window.removeEventListener('resize', calculateBoxSize);
    };
  }, []);

    const getBoxes = () => {
      const boxes = [];
      if(jobs){
        for (let i = 0; i < jobs.length; i++) {
          let job = JSON.stringify({"id":jobs[i].id,"qr":false});

          
          boxes.push(<Link style={{color: '#43454B'}} key={jobs[i].id} to={{pathname: `/jobPage/${job}`}}><Box key={i} title={jobs[i].title} points={jobs[i].points} size={boxSize} textSizeSmall={textSizeSmall}/></Link>);
      }
      return boxes;
      }else{

        return "Loading jobs"
      }
      
    };

    return (
    <div style={{backgroundColor:"#FFF181"}}>
    <motion.div
        style={{
        backgroundColor: '#43454B'}}>    
        <div style={{paddingRight: "40px",paddingTop:"40px", float: 'right', fontSize: textSizeSmall+'px', color:'white'}}>
                <Link style={{textDecoration: 'none', color: 'white'}} to={{pathname:`/leaderboard`}} >
                  Statistics <img style={{width: textSizeSmall*1.5,height: textSizeSmall, verticalAlign: textSizeSmall*-0.19}} src={arrow_right_white}  alt="arrow" />
                </Link>
          {/*Total points <span style={{fontFamily:"Extrabold"}}>{totalUserPoints ? JSON.stringify(totalUserPoints) : "Loading..."}</span>*/}
        </div>  
        
          {/*<Menu/> side menu med logout og leaderboard er ikke implementeret fordi den ikke er pæn*/}
        <div style={{marginLeft:'40px', marginRght:'40px',
        paddingTop: 150-screenWidth*0.1}}>
          <div>
              <h1 style={{
              color: 'white',
              marginTop:0,
              marginBottom:0,
              fontSize: textSize
              }}>Done a </h1>
              <h1 style={{
              color: 'white',
              marginTop:0,
              paddingBottom:40,
              fontSize: textSize+'px'
              }}>
                <span style={{fontFamily:"Extrabold"}}>
                  good job{/*currentUser ? currentUser.data.first_name : "Loading..."*/}?
                </span>
               
              </h1>
          </div>
          <div>
              <div style={{
              color: 'white',
              marginTop:0,
              marginBottom:0,
              fontSize: textSizeSmall
              }}>
              Select the <span style={{fontFamily:"Extrabold"}}>good job</span>
              </div>
              <div style={{
              color: 'white',
              marginTop:0,
              marginBottom:0,
              paddingBottom:30,
              fontSize: textSizeSmall
              }}>
              you have done 
              </div>
              <div>
      

    </div>
          </div>
        </div>
        <div style={{
        backgroundColor: '#43454B',
        color: '#43454B',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(calc(50% - 1px), 1fr))', // 6px is half of the combined horizontal margins (3px + 3px)
        gridGap: '1px',
        alignItems: 'center',
        padding: '0px',
        marginTop: "0px",
        marginBottom: "0px"
        }}>
          
        {getBoxes()}
        
        </div>
        <div style={{
        backgroundColor: '#43454B',
        height: screenHeight*0.187}}>
          <div style={{marginLeft:'40px',marginRight:'40px',color:"white",paddingTop:screenHeight*0.043, fontSize:textSizeSmall}}>
            <div>
              Thank you for joining the 'Good job challenge' and the race to become 'Good jobber' of the week
            </div>
            <div style={{paddingTop:screenHeight*0.02, fontFamily:"Extrabold"}}>
              Keep up the good job!
            </div>
          </div>
          
       
      </div>
        <motion.div
          initial={{ scaleX: -1 }}
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut", delay: 0.5 } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" , delay: 0.5} }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="privacy-screen"
        />

    </motion.div>
    </div>
    );
};

export default HomePage;