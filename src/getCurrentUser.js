import baseURL from "./baseURL";
import { getCookie } from "./getCookie";


const getCurrentUser = async () => {
    try {
      const response = await fetch(baseURL + '/users/me', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ getCookie('token')
        }
      });


      if (response.ok) {
        const data = await response.json();
        
        return data;
      } else {
        throw new Error('Failed to get current user');
      }
    } catch (error) {
      console.error(error);
    }
  
  }

export default getCurrentUser;