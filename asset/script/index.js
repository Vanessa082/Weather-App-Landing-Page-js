const close_btn = document.querySelector('.close-btn');
const page_container = document.querySelector('.page-container');
const tomorrow_heading = document.querySelector('.tomorrow');
const today_heading = document.querySelector('.today');
const input_field = document.querySelector('.input-field');
const search_button = document.querySelector('.search-button');

const weatherImage = document.querySelector('.weather-img img');
const temperature = document.querySelector('.temperature .value');
const weather_text = document.querySelector('.temperature .weathertext');
const weather_date = document.querySelector('.weatherdate .date');
const weather_time = document.querySelector('.weatherdate .time');
const weather_daystatus = document.querySelector('.weatherdate .daystatus');
const weather_location = document.querySelector('.location');

const Wind = document.querySelector('.weather-details .wind');
const wind_direction = document.querySelector('.weather-details .wind-direction');
const Humidity = document.querySelector('.weather-details .humidity');
const real_feel = document.querySelector('.weather-details .real-feel');
const sea_level = document.querySelector('.weather-details .sea_level');
const sea_level_TEXT = document.querySelector('.weather-details .sea_level-text');
const Pressure = document.querySelector('.weather-details .pressure');
const pressure_text = document.querySelector('.weather-details .pressuretext');
const change_of_rain = document.querySelector('.weather-details .change-of-rain');
const change_of_rain_text = document.querySelector('.weather-details .change-of-rain-text');
const hi_tem = document.querySelector('.weather-details .high-temperature');
const low_tem = document.querySelector('.weather-details .low-temperature');
const sun_rise = document.querySelector('.weather-details .sun-rise');
const sun_set = document.querySelector('.weather-details .sun-set');
const moon_rise = document.querySelector('.weather-details .moon-rise');
const moon_set = document.querySelector('.weather-details .moon-set');

let humidityUnitEl = document.querySelector('.weather-details .humidity-unit');
let pressureUnitEl = document.querySelector('.weather-details .pressure-unit');

import {
  fetchLocationData,
  fetchWeatherDataByCoordinates,
} from './api.js';

import {
  getFullDayFromDate,
  organiseWeatherData,
  setLoading,
} from './util.js';

import { DEFAULT_CITY } from './constants.js';

const alert_message = (message) => {
  close_btn.closest('.alert').querySelector('.alert-body').textContent = message;
  close_btn.closest('.alert').classList.remove('show');

  setTimeout(() => {
    close_btn.closest('.alert').classList.add('show');
  }, 3000);
};

//Clear Display if Not fetch any data
const clearDisplay = (message) => {
  setLoading(false);
  close_btn.closest('.alert').classList.add('show');
  page_container.innerHTML = `<div class="error"><p>${message}</p></div>`;
};

//Close Alert
close_btn.addEventListener('click', (e) => {
  e.target.closest('.alert').classList.add('show');
});

const displayWeatherData = (array_weather) => {
  if (!array_weather || array_weather.length <= 0) {
    return // TODO +=> tell user no weather data is found at that time.
  };

  const current_weather = array_weather[0];

  if (!current_weather) return;

  console.log(current_weather);
  // update DOM.
  Wind.innerHTML = current_weather.wind_speed;
  Humidity.innerHTML = current_weather.humidity;
  real_feel.innerHTML = current_weather.real_feel;
  Pressure.innerHTML = current_weather.pressure;
  sea_level.innerHTML = current_weather.sea_level;
  hi_tem.innerHTML = current_weather.temperature_high;
  low_tem.innerHTML = current_weather.temperature_low;
  sun_rise.innerHTML = current_weather.sunrise
  sun_set.innerHTML = current_weather.sunset


  setLoading(false);
};

// Get user's current location and fetch weather data
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;
    const weatherData = await fetchWeatherDataByCoordinates(latitude, longitude);

    const array_data = weatherData?.list;

    if (array_data) {
      const organised_data = organiseWeatherData(array_data, weatherData.city);

      console.log(organised_data, weatherData.city);

      displayWeatherData(organised_data.Today);

      today_heading.addEventListener('click', () => {
        displayWeatherData(organised_data.Today);
      });

      tomorrow_heading.addEventListener('click', () => {
        const today = new Date();

        const tomorrow = new Date(today.setDate(today.getDate() + 1)); // eg Mon Feb 12 2024 00:57:41 GMT+0100 (West Africa Standard Time);

        const day_tomorrow = getFullDayFromDate(tomorrow); // eg Monday;

        displayWeatherData(organised_data[day_tomorrow]);
      });
    } else {
      console.log('Location not found');
    }
  },
  (error) => {
    console.error('Error getting user location:', error);
  }
);
