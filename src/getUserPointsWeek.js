import baseURL from "./baseURL";
import { getCookie } from "./getCookie";

async function getUserPointsWeek(user) {
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

    let lastSunday = getLastSunday().toISOString().substring(0, 10);

    try {
      const response = await fetch(baseURL + `/items/userjobs?filter[user_created]=${user.id}&limit=9999&offset=0&filter[date_created][_gte]=` + lastSunday, requestOptions);
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

export {getUserPointsWeek};