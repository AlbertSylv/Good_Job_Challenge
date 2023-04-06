import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import { motion ,useIsPresent} from 'framer-motion';
import '../App.css';
import getCurrentUser from '../getCurrentUser';
import arrow_right from '../arrow right icon_.svg';
import baseURL from '../baseURL';
import { getCookie } from '../getCookie';
import {setCookie} from '../setCookie';

function JobPage() {
  const [jobData, setJobData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userJobsDone, setUserJobsDone] = useState([]);
  const [totalUserPoints, setTotalUserPoints] = useState(0);
  const [textSize, setTextSize] = useState(0);
  const [textSizeSmall, setTextSizeSmall] = useState(0);
  const { jobs } = useParams();
  const { id, qr } = JSON.parse(jobs);
  const [screenHeight, setScreenHeight] = useState(0);
  const isPresent = useIsPresent();
  const [home,setHome] = useState(true);
  const [lessThan5MinutesAgo,setLessThan5MinutesAgo] = useState(true);


  const setTheHome = () => {
    setHome(false)
  };
  

  useEffect(() => {      
    
    const textSize = screenHeight*0.065;
    const textSizeSmall = screenHeight*0.017;
    setTextSize(textSize);
    setTextSizeSmall(textSizeSmall);
    
    const calculateBoxSize = () => {
      setScreenHeight(document.documentElement.clientHeight);

    };
  
    calculateBoxSize();
    window.addEventListener('resize', calculateBoxSize);

    return () => {
        
        window.removeEventListener('resize', calculateBoxSize);
    };
  }
  ,[[],textSizeSmall]);



  useEffect(() => {
    
    async function fetchJob(id) {
      try {
        const bruger = await getCurrentUser();
        setUserData(bruger);
        const response = await fetch(baseURL + `/items/jobs/${id}`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`,
          },
        });
        const jobData = await response.json();

        setJobData(jobData.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchJob(id);
  }, [id]);

  useEffect(() => {
    async function awardPoints(job, user) {

      
      const currentTime = Date.now();
      let lastAwardTime = 0;
      let lessThan5Minutes = false;
      setLessThan5MinutesAgo(lessThan5Minutes);

      if(getCookie(job.id+"lastAwardTime")){
        lastAwardTime = getCookie(job.id+"lastAwardTime");

      }

      if (lastAwardTime===0 || (currentTime - lastAwardTime) >= 300000) {
        // award points
        lessThan5Minutes = false
        setLessThan5MinutesAgo(false);

      } else {
        // do not award points
        lessThan5Minutes = true;
        setLessThan5MinutesAgo(true);
        //lessThan5Minutes = true;
        

      }



      if (lessThan5Minutes === false && qr===true) {


        if(qr===true){
          
          
          const dataSent = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getCookie('token')}`,
            },
            body: JSON.stringify({
              jobId: id,
              Points: job.points,
              user_name: user.data.first_name,
              job_title: job.title

            }),
          };
          try {
            const response = await fetch(baseURL + '/items/userjobs', dataSent);
            if (response.ok) {
              setCookie(job.id+"lastAwardTime", currentTime, 30);

              const newEntry = await response.json();
              setUserJobsDone((prevState) => [...prevState, newEntry.data]);
            } else {
              throw new Error('Failed to award points');
            }
          } catch (error) {
            console.error(error);
          }  
        }
        
      }
    }
    
    if(jobData.length!==0){

      
      awardPoints(jobData, userData);
    }
    
  }, [qr, id, jobData]);

  useEffect(() => {
    async function getUserPoints(user) {
      const requestOptions = {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
      };
      try {
        const response = await fetch(baseURL + `/items/userjobs?filter[user_created]=${user.id}&limit=9999&offset=0`, requestOptions);
        if (response.ok) {
          const pointsData = await response.json();
          return pointsData.data;
        } else {
          throw new Error('Failed to get total points');
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (userData.length !== 0) {
      async function handlingAward(user) {
        const pointsData = await getUserPoints(user.data);
        setUserJobsDone(pointsData);
      }
      handlingAward(userData);
    }
  }, [userData]);

  useEffect(() => {
    let total = 0;
    userJobsDone.forEach((userJob) => (total += userJob.Points));
    setTotalUserPoints(total);
  }, [userJobsDone]);

  const getAwardMessage = () => {
    
    if(lessThan5MinutesAgo==true){


      return <div>
                <div>
                    <div style={{
                    paddingTop:screenHeight*0.064,
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize: textSize+'px'
                    }}>Oops!</div>
                    <div style={{
                    color: '#43454B',
                    marginTop:0,
                    fontSize: textSize+'px'
                    }}>
                      <span style={{fontFamily:"Extrabold"}}>
                        
                      </span>
                    </div>
                </div>
                <div>
                    <div style={{
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    paddingTop:screenHeight*0.084,
                    fontSize:textSizeSmall,
                    paddingBottom:screenHeight*0.16
                    }}>
                    - you already did the <span style={{fontFamily:"Extrabold"}}>{jobData.title}</span> not too long ago, please wait a while before doing this job again.
                    </div>
                    <div style={{
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize:textSizeSmall
                    }}>
                    
                    </div>
                </div>
                <div>
                  <div style={{
                    color: '#43454B',
                    marginTop:0,
                    paddingTop:screenHeight*0.034,
                    paddingBottom: 0,
                    fontSize: textSize+'px',
                    marginBottom:(screenHeight*-0.01)
                    }}>
                      <span style={{fontFamily:"Extrabold"}}>
                      
                      </span>
                    </div><div style={{
                    marginTop:0,
                    paddingTop: 0,
                    color: '#43454B',
                    fontSize:textSizeSmall,
                    fontFamily:"Extrabold"
                        
                    }}>
                    
                  </div>
                </div>
              </div>;
    }else if(lessThan5MinutesAgo==false){

      return <div>
                <div>
                    <div style={{
                    paddingTop:screenHeight*0.064,
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize: textSize+'px'
                    }}>WAUW</div>
                    <div style={{
                    color: '#43454B',
                    marginTop:0,
                    fontSize: textSize+'px'
                    }}>
                      <span style={{fontFamily:"Extrabold"}}>
                        - good job!
                      </span>
                    </div>
                </div>
                <div>
                    <div style={{
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    paddingTop:screenHeight*0.084,
                    fontSize:textSizeSmall
                    }}>
                    You have done a good <span style={{fontFamily:"Extrabold"}}>{jobData.title}</span>
                    </div>
                    <div style={{
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize:textSizeSmall
                    }}>
                    and recieved
                    </div>
                </div>
                <div>
                    <div style={{
                    
                    color: '#43454B',
                    marginTop:0,
                    paddingTop:screenHeight*0.034,
                    paddingBottom: 0,
                    fontSize: textSize+'px',
                    marginBottom:(screenHeight*-0.01)
                    }}>
                      <span style={{fontFamily:"Extrabold"}}>
                      {jobData.points}
                      </span>
                    </div><div style={{
                    marginTop:0,
                    paddingTop: 0,
                    color: '#43454B',
                    fontSize:textSizeSmall,
                    fontFamily:"Extrabold"
                        
                    }}>
                    points
                    </div>
                </div>
              </div>;

    }
    
  }



  if(qr!==undefined&&qr===true){

    return (
    <div style={{backgroundColor:"#43454B", height:"100vh"}}>
    <motion.div >
      
      <div
        style={{
        backgroundColor: '#FFF181',
        paddingTop: screenHeight*0.119}}>
        <div style={{marginLeft:'40px',marginRight:'40px'}}>
        <div>
              <div style={{
              color: '#43454B',
              marginTop:0,
              marginBottom:0,
              fontSize:textSizeSmall
              }}>
                <Link style={{textDecoration: 'none', color: '#43454B'}} to={{pathname:"/"}}>
                  <img style={{width: textSizeSmall*1.5,height: textSizeSmall, verticalAlign: textSizeSmall*-0.1, transform:'rotate(180deg)'}} src={arrow_right}  alt="arrow" /> View all jobs
                </Link>
              </div>
          </div>




          <div>
            {getAwardMessage()}
          </div>


          <div>
              <div style={{
              color: '#43454B',
              paddingTop:screenHeight*0.036,
              fontSize:textSizeSmall,
              marginBottom:0,
              }}>
              Total points:
              </div>
          </div>
          <div>
              <div style={{
              color: '#43454B',
              marginTop:0,
              marginBottom:0,
              fontSize:textSizeSmall
              }}>
                <span style={{fontFamily:"Extrabold"}}>
              {totalUserPoints}</span>
              </div>
          </div>
          <div>
              <div style={{
              color: '#43454B',
              marginTop:0,
              marginBottom:0,
              paddingTop:screenHeight*0.049,
              paddingBottom:screenHeight*0.0719
              }}>
               
              </div>
          </div>
          

        </div>
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
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: isPresent ? 1 : 0 }}
          className="privacy-screen"
        />
       
    </motion.div>
    </div>

    );
  }
  if(qr===false){
    return (
      
    <div style={{backgroundColor:"#43454B", height:"100vh"}}>


      
      <motion.div >

      <div
        style={{
        backgroundColor: '#FFF181',
        paddingTop: screenHeight*0.119}}>
        <div style={{marginLeft:'40px',marginRight:'40px'}}>
        <div>
              <div style={{
              color: '#43454B',
              marginTop:0,
              marginBottom:0,
              fontSize:textSizeSmall
              }}>
                <Link style={{textDecoration: 'none', color: '#43454B'}} to={{pathname:"/"}}>
                  <img style={{width: textSizeSmall*1.5,height: textSizeSmall, verticalAlign: textSizeSmall*-0.1, transform:'rotate(180deg)'}} src={arrow_right}  alt="arrow" /> View all jobs
                </Link>
              </div>
          </div>
          <div>
              <div style={{
              paddingTop:screenHeight*0.064,
              color: '#43454B',
              marginTop:0,
              marginBottom:0,
              fontSize: textSize+'px'
              }}>The <span style={{fontFamily:"Extrabold"}}>{jobData.title}</span>
              </div>
          </div>
          <div>
              <div style={{
              color: '#43454B',
              marginTop:0,
              marginBottom:0,
              paddingTop:screenHeight*0.084,
              fontSize:textSizeSmall
              }}>
              {jobData.description}
              </div>

          </div>
          <div>
              <div style={{
              
              color: '#43454B',
              marginTop:0,
              paddingTop:screenHeight*0.034,
              paddingBottom: 0,
              fontSize: textSize+'px',
              marginBottom:(screenHeight*-0.01)
              }}>
                <span style={{fontFamily:"Extrabold"}}>
                 {jobData.points}
                </span>
              </div><div style={{
              marginTop:0,
              paddingTop: 0,
              color: '#43454B',
              fontSize:textSizeSmall,
              fontFamily:"Extrabold"
                  
              }}>
              points
              </div>
          </div>


          <div>
              <div style={{
              color: '#43454B',
              marginTop:0,
              marginBottom:0,
              paddingTop:screenHeight*0.144 ,
              paddingBottom:screenHeight*0.055,
              fontSize:textSizeSmall,
              textAlign:'right'
              

              }}>
                <Link onClick={setTheHome} style={{textDecoration: 'none', color: '#43454B'}} to={{pathname:`/jobPage/{"id":"${jobData.id}","qr":true}`}} >
                  Done this job? <img style={{width: textSizeSmall*1.5,height: textSizeSmall, verticalAlign: textSizeSmall*-0.19}} src={arrow_right}  alt="arrow" />
                </Link>
              </div>
          </div>
          

        </div>
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
            initial={{ scaleX: -1}}
            animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
            exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
            style={{ originX: home? (isPresent ? 1 : 0 ) : (isPresent ? 0 : 1 )}}
            className="privacy-screen"
          />  
      </motion.div>

    </div>
    );
  }
  

}

export default JobPage