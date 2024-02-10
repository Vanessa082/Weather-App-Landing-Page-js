const loader_container = document.querySelector('.loader-container');
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
const UV = document.querySelector('.weather-details .uv');
const UV_TEXT = document.querySelector('.weather-details .uv-text');
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
  parseWeatherObject,
  organiseWeatherData
} from './util.js';

import { DEFAULT_CITY } from './constants.js';


// const loader = document.createElement('span');
// loader.classList.add('loader');
// loader_container.appendChild(loader);

// Alert Message Function

const alert_message = (message) => {
  close_btn.closest('.alert').querySelector('.alert-body').textContent = message;
  close_btn.closest('.alert').classList.remove('show');

  setTimeout(() => {
    close_btn.closest('.alert').classList.add('show');
  }, 3000);
};

//Clear Display if Not fetch any data
const clearDisplay = (message) => {
  loader_container.style.display = 'none';
  close_btn.closest('.alert').classList.add('show');
  page_container.innerHTML = `<div class="error"><p>${message}</p></div>`;
};

['submit', 'click'].forEach((evt) => {
  search_button.addEventListener(evt, async (e) => {
    e.preventDefault();

    // Activate the 'Today' tab and deactivate the 'Tomorrow' tab
    today_heading.classList.add('active');
    tomorrow_heading.classList.remove('active');

    const input_field = input_field.value;

    if (input_field === '') {
      alert_message('Field Must Not be empty!');
    } else {
      // Show the loader
      loader_container.style.display = 'flex';

      // Set the DEFAULT_CITY to the input field
      DEFAULT_CITY = input_field;

      // Clear the input field
      input_field.value = "";

      // Update the display with today's weather data
      try {
        await displayTodayData(input_field);
        loader_container.style.display = 'none';
      } catch (error) {
        loader_container.style.display = 'none';
        alert_message('Location Not found');
      }
    }
  });
});

tomorrow_heading.addEventListener('click', async () => {

  //Loader
  loader_container.style.display = 'flex';

  //Active tab
  this.classList.add('active');
  today_heading.classList.remove('active');

  //Display Data
  let check = await displayTodayData(DEFAULT_CITY, true);

  if (check) {
    loader_container.style.display = 'none';
  } else {
    loader_container.style.display = 'none';
    alert_message('Location Not found');
  }

});

//Display today data when click
today_heading.addEventListener('click', async () => {

  //Loader
  loader_container.style.display = 'flex';

  //Active tab
  this.classList.add('active');
  tomorrow_heading.classList.remove('active');

  //Display Data
  let check = await displayTodayData(DEFAULT_CITY, false);

  if (check) {
    loader_container.style.display = 'none';
  } else {
    loader_container.style.display = 'none';
    alert_message('Location Not found');
  }
});

//Close Alert
close_btn.addEventListener('click', (e) => {
  e.target.closest('.alert').classList.add('show');
});

const displayWeatherData = (array_weather) => {
  if (!array_weather || array_weather.length <= 0) {
    return // TODO +=> tell user no weather data is found at that time.
  };

  //
};

// Get user's current location and fetch weather data
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;
    const weatherData = await fetchWeatherDataByCoordinates(latitude, longitude);

    const array_data = weatherData?.list;

    const organised_data = organiseWeatherData(array_data);

    console.log(organised_data);

    if (array_data) {
      displayWeatherData(organised_data.today);
    } else {
      console.log('Location not found');
    }
  },
  (error) => {
    console.error('Error getting user location:', error);
  }
);
