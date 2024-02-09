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
const uvEL = document.querySelector('.weather-details .UV');
const uvStatusEl = document.querySelector('.weather-details .UV-text');
const pressureEl = document.querySelector('.weather-details .pressure');
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

//Search City and get LocationKey
const getLocation = async (cityName) => {
  const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;
  try {
    const response = await fetch(URL);
    const [data] = await response.json();

    if (data) {

      return { Location: data.EnglishName, Country: data.Country.LocalizedName, Timezone: data.TimeZone.Name, Key: data.Key };
    } else {
      return false;
    }
  } catch (error) {
    clearDisplay(`---The allowed number of requests has been exceeded.--- <br> As openweather provide only 1,000 calls  per day for 1 API KEY and You have requested more than that. Try Tomorrow. <br> Good Luck!`);
  }
}


//Get city name by Coordinates
const getLocationByCoords = async (Latitude, Longitude) => {
  const URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${Latitude}&lon=${Longitude}&limit={limit}&appid=${API_KEY}`;

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();

    return data.LocalizedName;
  } catch (error) {
    clearDisplay(`---The allowed number of requests has been exceeded.--- <br> As openweather provide only 1,000 calls per day for 1 API KEY and You have requested more than that. Try Tomorrow. <br> Good Luck!`);
  }

}

//Get Current Weather
const getCurrentWeather = async function (cityName) {
  try {
    const { Location, Country, Timezone, Key } = await getLocation(cityName);

    if (!Key) {
      return false;
    }
  
    const URL = `https://api.openweathermap.org/data/3.0/onecall?${Key}&appid=${API_KEY}`;
    const response = await fetch(URL);
    const data = await response.json();
    const [currentWeather] = data;


    return { Location: Location, Country: Country, Timezone: Timezone, currentWeather: currentWeather };
  } catch (error) {
    clearDisplay(`---The allowed number of requests has been exceeded.--- <br> As openweather provide only 1,000 calls per day for 1 API KEY and You have requested more than that. Try Tomorrow. <br> Good Luck!`);
  }
}

//Get 5 Day Forecast
const getFiveDayForecast = async (cityName) => {
  try {
    const { Key } = await getLocation(cityName);
    if (!Key) {
      return false;
    }

    const URL = `https://api.openweathermap.org/data/3.0/onecall?${Key}&appid=${API_KEY}`;

    const response = await fetch(URL);

    const data = await response.json();

    return data;
  } catch (error) {
    clearDisplay(`---The allowed number of requests has been exceeded.--- <br> As openweather provide only 1,000 calls per day for 1 API KEY and You have requested more than that. Try Tomorrow. <br> Good Luck!`);
  }
}

//Get Formatted Time
const getFormatedTime = function (date = '', Timezone) {
  let options = {
    hour: "numeric",
    minute: "numeric",
    timeZone: Timezone,
  };

  let localeTime = new Intl.DateTimeFormat('en-US', options).format(date);
  let hour = localeTime.split(':')[0].padStart(2, 0);
  let minute = localeTime.split(':')[1].split(' ')[0].padStart(2, 0);
  let amPM = localeTime.split(':')[1].split(' ')[1];

  return `${hour}:${minute} ${amPM}`;
}

//Get Formatted Date
const getFormatedDate = function (date = '', Timezone) {
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: Timezone,
  };

  let localDate = new Intl.DateTimeFormat('en-GB', options).format(date);
  return localDate;
}

//Display Current Weather
const displayTodayData = async function (city, tomorrow = false) {

  DEFAULT_CITY = city;

  //Get Current Weather
  try {
    let { Location, Country, Timezone, currentWeather } = await getCurrentWeather(city);

    let fiveDayForecast = await getFiveDayForecast(city);

    let todayForecast = '';
    let tomorrowForecast = '';

    if (!currentWeather && !fiveDayForecast) {
      return false;
    }

    fiveDayForecast.DailyForecasts.forEach(function (element, index) {
      if (getFormatedDate(new Date(element.Date), Timezone) === getFormatedDate(new Date(currentWeather.LocalObservationDateTime), Timezone)) {
        todayForecast = element;
        tomorrowForecast = fiveDayForecast.DailyForecasts[index + 1];
      }
    });

    pressureUnitEl.textContent = 'mbbar';
    humidityUnitEl.textContent = '%';

    if (tomorrow) {
      // IF tomorrow is set then currentWeather and todayData will changed
      pressureUnitEl.textContent = ' ';
      humidityUnitEl.textContent = ' ';
      currentWeather = {
        LocalObservationDateTime: tomorrowForecast.Date,
        IsDayTime: true,
        WeatherIcon: tomorrowForecast.Day.Icon,
        Temperature: {
          Metric: {
            Value: tomorrowForecast.Temperature.Maximum.Value
          }
        },
        WeatherText: tomorrowForecast.Day.IconPhrase,
        Wind: {
          Speed: {
            Metric: {
              Value: tomorrowForecast.Day.Wind.Speed.Value
            }
          },
          Direction: {
            English: tomorrowForecast.Day.Wind.Direction.English
          }
        },
        RelativeHumidity: 'No Info.',
        RealFeelTemperature: {
          Metric: {
            Value: tomorrowForecast.RealFeelTemperature.Maximum.Value
          }
        },
        UVIndex: 'No Info.',
        UVIndexText: '&nbsp;',
        Pressure: {
          Metric: {
            Value: 'No Info.'
          }
        },
        PressureTendency: {
          LocalizedText: '&nbsp;'
        },


      }
      todayForecast = {
        Sun: tomorrowForecast.Sun,
        Moon: tomorrowForecast.Moon,
        Day: {
          RainProbability: tomorrowForecast.Day.RainProbability
        },
        Temperature: tomorrowForecast.Temperature,
      }
    }

    //Get Date Time info
    let date = new Date(currentWeather.LocalObservationDateTime);
    const dateInfo = getFormatedDate(date, Timezone);

    const timeInfo = `${new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: Timezone }).format(date).split(' ').join('')}, ${getFormatedTime(date, Timezone)}`;

    //Get Moon,Sun Rise and Set Time
    const sunRiseInfo = getFormatedTime(new Date(todayForecast.Sun.Rise), Timezone);
    const sunSetInfo = getFormatedTime(new Date(todayForecast.Sun.Set), Timezone);
    const moonRiseInfo = getFormatedTime(new Date(todayForecast.Moon.Rise), Timezone);
    const moonSetInfo = getFormatedTime(new Date(todayForecast.Moon.Set), Timezone);

    //Day Status
    const dayStatus = currentWeather.IsDayTime ? 'Day' : 'Night';


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
    uvEL.textContent = currentWeather.UVIndex;
    uvStatusEl.innerHTML = currentWeather.UVIndexText;
    pressureEl.textContent = (typeof currentWeather.Pressure.Metric.Value === 'string') ? currentWeather.Pressure.Metric.Value : Math.round(currentWeather.Pressure.Metric.Value);
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

    if (todayForecast) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    clearDisplay(`---The allowed number of requests has been exceeded.--- <br> As openweather provide only 1,000 calls per day for 1 API KEY and You have requested more than that. Try Tomorrow. <br> Good Luck!`);
  }
}



//Access location and load data
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;

  let check = displayTodayData(await getLocationByCoords(latitude, longitude));

  if (check) {
    loader_container.style.display = 'none';
    alert_message('Current Location Loaded');
  } else {
    loader_container.style.display = 'none';
    alert_message('Location Not found');
  }

}, async function (err) {
  let check = await displayTodayData(DEFAULT_CITY);
  if (check) {
    loader_container.style.display = 'none';
    alert_message('Default Location Loaded');
  } else {
    alert_message('Location Not found');
  }
},
  {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 5000
  });