import baseURL from "./baseURL";
import { getCookie } from "./getCookie";

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

export {getUserPoints};