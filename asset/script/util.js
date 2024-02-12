
//util.js
const getFullDayFromDate = (date) => {
  return new Date(date).toLocaleString('en-US', { weekday: 'long' });  // eg "Monday", "Tuesday" ...etch.
}

const getTimeStatus = (time = '') => {
  const hr = +time.split(':').shift();

  if (time.includes('AM')) {
    if (hr <= 5 || hr === 12) return 'Morning';

    return 'Day break';
  } else {
    if (hr === 12) return 'Noon';

    if (hr <= 3) return 'After-noon';

    if (hr <= 7) return 'Evening';

    return 'Night';
  };
}

const parseWeatherObject = (weather_obj, city) => {
  const date = weather_obj?.dt_txt;

  const time = new Date(date).toLocaleString('en-US', { weekday: 'long' }); // eg. 'sunday '
  const location = city.name + ` (${city.country})`;

  return {
    wind_speed: weather_obj?.wind?.speed,
    humidity: weather_obj?.main?.humidity,
    real_feel: weather_obj?.main?.feels_like,
    sea_level: weather_obj?.main?.sea_level,
    pressure: weather_obj?.main?.pressure,
    grnd_level: weather_obj?.main?.grnd_level,
    temperature_high: weather_obj?.main?.temp_max,
    temperature_low: weather_obj?.main?.temp_min,
    sunrise: new Date(city?.sunrise).toLocaleTimeString(),
    sunset: new Date(city?.sunset).toLocaleTimeString(),
    img_icon: weather_obj?.weather[0]?.icon,
    time_status: getTimeStatus(time),
    day: time,
    date,
    location,
    temperature: weather_obj?.main?.temp,
    weathertext: weather_obj?.weather[0]?.description,
  };
}

const organiseWeatherData = (weather_array, city) => {
  const organised_data = {
    Today: [],
  };

  const date_today = new Date().toDateString() // example format: 'Sat Feb 10 2024'

  for (const weather of weather_array) {
    const unknown_date = new Date(weather.dt_txt).toDateString();

    const parsed_weather = parseWeatherObject(weather, city); //converting the object to look like what we want.

    if (date_today === unknown_date) {
      organised_data.Today.push(parsed_weather);
    } else {
      const that_day = getFullDayFromDate(weather.dt_txt);

      if (organised_data[that_day]) {
        organised_data[that_day].push(parsed_weather);
      } else {
        organised_data[that_day] = [parsed_weather];
      }
    }
  };

  return organised_data;
};

const setLoading = (bool) => {
  if (bool) {
    document.querySelector('.loader-container').classList.add('loading');
  } else {
    document.querySelector('.loader-container').classList.remove('loading');
  }
};

export {
  organiseWeatherData,
  setLoading,
  getFullDayFromDate,
};
