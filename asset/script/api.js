import { API_KEY } from './constants.js';

// Fetch location's data +=> longitude && latitude
const fetchLocationData = async (cityName) => {
  const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return false;
  }
};

// Fetch location data from OpenWeatherAPI based on latitude and longitude
const fetchWeatherDataByCoordinates = async (latitude, longitude) => {
  const query_str = new URLSearchParams({
    lat: latitude,
    lon: longitude,
    appid: API_KEY,
  }).toString(); // lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}

  const URL = `https://api.openweathermap.org/data/2.5/forecast?` + query_str;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return false;
  }
};

export {
  fetchLocationData,
  fetchWeatherDataByCoordinates,
};
