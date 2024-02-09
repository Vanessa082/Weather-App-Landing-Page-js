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
const pressureTendEL = document.querySelector('.weather-details .pressureTend');
const changeOfRainEl = document.querySelector('.weather-details .changeOfRain');
const changeOfRainSituationEl = document.querySelector('.weather-details .changeOfRainSituation');
const hiTemEl = document.querySelector('.weather-details .HiTem');
const lowTemEl = document.querySelector('.weather-details .LowTem');
const sunRiseEl = document.querySelector('.weather-details .sunRise');
const sunSetEl = document.querySelector('.weather-details .sunSet');
const moonRiseEl = document.querySelector('.weather-details .moonRise');
const moonSetEl = document.querySelector('.weather-details .moonSet');

let humidityUnitEl = document.querySelector('.weather-details .humidity-unit');
let pressureUnitEl = document.querySelector('.weather-details .pressure-unit');

// API Info
const API_KEY = 'ae67f46811344d82786bd30c94e0cf12';
let DEFAULT_CITY = "Yaounde";


const loader = document.createElement('span');
loader.classList.add('loader');
loader_container.appendChild(loader);


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

// Fetch weather data from OpenWeatherAPI
const fetchWeatherData = async (cityName) => {
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
const fetchLocationByCoords = async (latitude, longitude) => {
  const URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data && data.length > 0) {
      return data[0].name;
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return false;
  }
};

// Display weather data for a given cityName
const displayWeatherData = async (cityName) => {
  try {
    const data = await fetchWeatherData(cityName);

    if (data) {
      // Update the DOM with weather data
      //Update in DOM
      weatherImage.src = `https://www.openweather.com/images/weathericons/${currentWeather.WeatherIcon}.svg`;
      temperature.textContent = Math.round(currentWeather.Temperature.Metric.Value);
      weather_text.textContent = currentWeather.WeatherText;
      weather_date.textContent = dateInfo;
      weather_time.textContent = timeInfo;
      weather_daystatus.textContent = dayStatus;
      weather_location.textContent = `${Location}, ${Country}`;

      Wind.textContent = Math.ceil(currentWeather.Wind.Speed.Metric.Value);
      wind_direction.textContent = currentWeather.Wind.Direction.English;
      Humidity.textContent = (typeof currentWeather.RelativeHumidity === 'string') ? currentWeather.RelativeHumidity : Math.round(currentWeather.RelativeHumidity);
      real_feel.textContent = Math.round(currentWeather.RealFeelTemperature.Metric.Value);
      UV.textContent = currentWeather.uvIndex;
      UV_TEXT.innerHTML = currentWeather.uvIndexText;
      Pressure.textContent = (typeof currentWeather.Pressure.Metric.Value === 'string') ? currentWeather.Pressure.Metric.Value : Math.round(currentWeather.Pressure.Metric.Value);
      pressureTendEL.innerHTML = currentWeather.PressureTendency.LocalizedText;
      if (dayStatus == 'Day') {
        changeOfRainEl.textContent = todayForecast.Day.RainProbability;
      } else {
        changeOfRainEl.textContent = todayForecast.Night.RainProbability;
      }
      changeOfRainSituationEl.textContent = dayStatus;
      hiTemEl.textContent = Math.round(todayForecast.Temperature.Maximum.Value);
      lowTemEl.textContent = Math.round(todayForecast.Temperature.Minimum.Value);
      sunRiseEl.textContent = sunRiseInfo;
      sunSetEl.textContent = sunSetInfo;
      moonRiseEl.textContent = moonRiseInfo;
      moonSetEl.textContent = moonSetInfo;
      // Example: temperatureEl.textContent = data.main.temp;
    } else {
      // Handle error or display message
      console.log('Error fetching weather data');
    }
  } catch (error) {
    console.error('Error displaying weather data:', error);
  }
};

// Get weather data for default cityName
displayWeatherData(DEFAULT_CITY);

// Get user's current location and fetch weather data
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  const location = await fetchLocationByCoords(latitude, longitude);

  if (location) {
    displayWeatherData(location);
  } else {
    console.log('Location not found');
  }
}, (error) => {
  console.error('Error getting user location:', error);
});
