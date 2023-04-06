//https://example.com/orders?groupby=customer_id&aggregate[order_total]=sum

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion ,useIsPresent} from 'framer-motion';
import '../App.css';
import arrow_right from '../arrow right icon_.svg';
import baseURL from '../baseURL';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { getCookie } from '../getCookie';
import getCurrentUser from '../getCurrentUser';
import { getUserPoints } from '../getUserPoints';
import RecentJobsList from '../RecentJobsList';
import { getUserPointsWeek } from '../getUserPointsWeek';


function LeaderBoard() {

  const [textSizeSmall, setTextSizeSmall] = useState(0);
  const [textSizeMedium, setTextSizeMedium] = useState(0);
  const [textSize, setTextSize] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const isPresent = useIsPresent();
  const [leaderboardData,setLeaderboardData] = useState([]);
  const [weekly5,setWeekly5] = useState([]);
  const [jobUseData,setJobUseData] = useState([]);
  const[currentUser,setCurrentUser]= useState(null);
  const[totalUserPoints,setTotalUserPoints]= useState(null);
  const[weeklyUserPoints,setWeeklyUserPoints]= useState(null);
  const[recentJobs,setRecentJobs]= useState(null);

  
  useEffect(() => {
    const getAllUsersPoints = async () => {
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
      const response = await fetch(baseURL + `/items/userjobs?groupBy[]=user_name&aggregate[sum]=Points`, requestOptions);

      if (response.ok) {
          const pointsData = await response.json();
          // Sort the users based on their points in descending order
          const sortedUsers = pointsData.data.sort((a, b) => b.sum.Points - a.sum.Points);

          // Get the top 3 users
          const topFiveUsers = sortedUsers.slice(0, 5);


          setLeaderboardData(topFiveUsers)
          
          return pointsData.data;
      } else {
          throw new Error('Failed to get total points');
      }
      } catch (error) {
      console.error(error);
      }
    }
    getAllUsersPoints();

    const getPointsSinceSunday = async () => {
      const requestOptions = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
      },
      };

      function getLastSunday() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0);
        return new Date(today.setDate(diff));
      }

      const lastSunday = getLastSunday().toISOString().substring(0, 10);


      try {
      const response = await fetch(baseURL + `/items/userjobs?groupBy[]=user_name&aggregate[sum]=Points&filter[date_created][_gte]=` + lastSunday, requestOptions);

      if (response.ok) {
          let pointsData = await response.json();
          // Sort the users based on their points in descending order
          let sortedWeekPoints = pointsData.data.sort((a, b) => b.sum.Points - a.sum.Points);

          // Get the top 3 users
          let weekPoints = sortedWeekPoints.slice(0, 5);

          setWeekly5(weekPoints)
          
          return pointsData.data;
      } else {
          throw new Error('Failed to get total points');
      }
      } catch (error) {
      console.error(error);
      }
    }
    getPointsSinceSunday();

    const getJobUses = async () => {
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
      const response = await fetch(baseURL + `/items/userjobs?groupBy[]=job_title&aggregate[count]=job_title`, requestOptions);

      if (response.ok) {
          const jobData = await response.json();

          const sortedJobs = jobData.data.sort((a, b) => b.count.job_title - a.count.job_title);
          
          setJobUseData(sortedJobs)
          
          return jobData.data;
      } else {
          throw new Error('Failed to get total points');
      }
      } catch (error) {
      console.error(error);
      }
    }
    getJobUses();

    const getRecentJobs = async () => {
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
      const response = await fetch(baseURL + `/items/userjobs?sort=-date_created&limit=5`, requestOptions);

      if (response.ok) {
          const recentJobsData = await response.json();
          
          setRecentJobs(recentJobsData.data)
          
          return recentJobsData.data;
      } else {
          throw new Error('Failed to get recent jobs');
      }
      } catch (error) {
      console.error(error);
      }
    }
    getRecentJobs();
    
    getCurrentUser().then((result) => {
      setCurrentUser(result);

      getUserPoints(result.data).then((pointsResult) => {
        let total = 0;

        if(pointsResult.length==0){
          setTotalUserPoints("0");
        }else{
          pointsResult.forEach((userJob) => (total += userJob.Points));
          setTotalUserPoints(total);
        }
        

      }).catch((error) => {
        console.error(error);
      });

      getUserPointsWeek(result.data).then((pointsResult) => {
        let total = 0;

        if(pointsResult.length==0){
          setWeeklyUserPoints("0");
        }else{
          pointsResult.forEach((userJob) => (total += userJob.Points));
          setWeeklyUserPoints(total);
        }
        

      }).catch((error) => {
        console.error(error);
      });

    }).catch((error1) => {
      console.error(error1);
    });
  
      
  }, []);

  useEffect(() => {
    const calculateBoxSize = () => {
      setScreenHeight(document.documentElement.clientHeight);
      setScreenWidth(document.documentElement.clientWidth);
      const textSizeSmalll = screenHeight*0.017;
      const textSizeMediumm = screenHeight*0.04;
      const textSize = screenHeight*0.065;

      setTextSizeSmall(textSizeSmalll);
      setTextSizeMedium(textSizeMediumm);
      setTextSize(textSize);
    };

    calculateBoxSize();
    setLeaderboardData(leaderboardData)


    

  }
  ,[[],textSizeSmall]);







    return (
    <div style={{backgroundColor:"#FFF181"}}>
    <motion.div>
      
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
                    <img style={{width: textSizeSmall*1.5,
                        height: textSizeSmall, 
                        verticalAlign: textSizeSmall*-0.1, 
                        transform:'rotate(180deg)'}} src={arrow_right}  alt="arrow" /> 
                        View all jobs
                    </Link>
                </div>
            </div>

            <div style={{
                    paddingTop:screenHeight*0.064,
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize: textSize+'px'
                    }}><div style={{fontFamily:"Extrabold"}}>Your points</div>
                    <div style={{paddingTop:"20px",fontSize:textSizeMedium}}>This week <span style={{fontFamily:"Extrabold"}}>{weeklyUserPoints ? weeklyUserPoints : "Loading..."}</span></div>
                    <div style={{paddingTop:"20px",fontSize:textSizeMedium}}>Overall <span style={{fontFamily:"Extrabold"}}>{totalUserPoints ? totalUserPoints : "Loading..."}</span></div>
                    
                    
            </div>

            
            <div>
            <div style={{
                    paddingTop:screenHeight*0.12,
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize: textSize+'px'
                    }}><div style={{fontFamily:"Extrabold"}}>Top 5</div> this week</div>
            </div>
            <div style={{paddingTop: 20,paddingBottom: 0, width: '105%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: "0px", marginLeft: "-30px"}}>
                <ResponsiveContainer width="90%" height="100%">
                <BarChart width={screenWidth * 0.6} height={200} data={weekly5} layout="vertical" margin={{top: 5, right: 5, left: 45, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="user_name" />
                  <Tooltip />
                  <Bar dataKey="sum.Points" fill="#43454B">
                    <LabelList dataKey="sum.Points" position="insideLeft" fill="#ffffff" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>   

            <div>
            <div style={{
                    paddingTop:screenHeight*0.12,
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize: textSize+'px'
                    }}><div style={{fontFamily:"Extrabold"}}>Top 5</div> all time</div>
            </div>
            <div style={{paddingTop: 20,paddingBottom: 0, width: '105%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: "0px", marginLeft: "-30px"}}>
                <ResponsiveContainer width="90%" height="100%">
                <BarChart width={screenWidth * 0.6} height={200} data={leaderboardData} layout="vertical" margin={{top: 5, right: 5, left: 45, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="user_name" />
                  <Tooltip />
                  <Bar dataKey="sum.Points" fill="#43454B">
                    <LabelList dataKey="sum.Points" position="insideLeft" fill="#ffffff" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>    


            <div>


              <div style={{
                    paddingTop:screenHeight*0.1,
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize: textSize+'px'
                    }}><div style={{fontFamily:"Extrabold"}}>Recently</div> done jobs
              </div>
              <div style={{paddingBottom: 40}}>
                {recentJobs ? <RecentJobsList jobs={recentJobs} /> : "Loading..."}
              </div>    

            <div style={{
                    paddingTop:screenHeight*0.06,
                    color: '#43454B',
                    marginTop:0,
                    marginBottom:0,
                    fontSize: textSize+'px'
                    }}><div style={{fontFamily:"Extrabold"}}>Job</div> frequency</div>
            </div>
              <div style={{paddingTop: 50,paddingBottom: 20, width: '105%', height: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: "0px", marginLeft: "-30px"}}>
                <ResponsiveContainer width="90%" height="100%">
                  <BarChart width={screenWidth * 0.6} height={200} data={jobUseData} layout="vertical" margin={{top: 5, right: 5, left: 45, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="job_title" />
                    <Tooltip />
                    <Bar dataKey="count.job_title" fill="#43454B">
                      <LabelList dataKey="count.job_title" position="insideLeft" fill="#ffffff" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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

export default LeaderBoard;