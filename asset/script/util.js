const getFullDayFromDate = (date) => {
  return new Date(date).toLocaleString('en-US', { weekday: 'long' });  // eg "Monday", "Tuesday" ...etch.
}

const organiseWeatherData = (weather_array) => {
  const organised_data = {
    today: [],
  };

  const date_today = new Date().toDateString() // example format: 'Sat Feb 10 2024'

  for (const weather of weather_array) {
    const unknown_date = new Date(weather.dt_txt).toDateString();

    if (date_today === unknown_date) {
      organised_data.today.push(weather);
    } else {
      const that_day = getFullDayFromDate(weather.dt_txt);

      if (organised_data[that_day]) {
        organised_data[that_day].push(weather);
      } else {
        organised_data[that_day] = [weather];
      }
    }
  };

  return organised_data;
};

const parseWeatherObject = (weather_obj) => {
  return {
    wind_speed: weather_obj.wind.speed,
    humidity: weather_obj.main.humidity,
    real_feel: weather_obj.main.feels_like,
    uv_index: weather_obj.main.sea_level,
    pressure: weather_obj.main.pressure,
    change_of_rain: weather_obj.main.grnd_level,
    temperature_high: weather_obj.main.tem_max,
    temperature_low: weather_obj.main.tem_min,
    sunrise: weather_obj.city.sunrise,
    sunset: weather_obj.city.sunset
  }
}

export {
  organiseWeatherData,
  parseWeatherObject,
};
