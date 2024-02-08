// DOM Elements
const loader_container = document.querySelector('.loader-container');
const close_btn = document.querySelector('.close-btn');
const page_container = document.querySelector('.page-container');
const tomorrow_heading = document.querySelector('.tomorrow');
const today_heading = document.querySelector('.today');

const input_field = document.querySelector('.input-field');
const search_button = document.querySelector('.search-button');
const weatherImage = document.querySelector('.weather-img img');
const temperatureEl = document.querySelector('.temperature .value');
const weatherTextEl = document.querySelector('.temperature .weathertext');
const dateEl = document.querySelector('.date-info .date');
const timeEl = document.querySelector('.date-info .time');
const dayStatusEl = document.querySelector('.date-info .daystatus');
const LocationEl = document.querySelector('.location');

const realFeelEl = document.querySelector('.weather-info-box .real-feel');
const humidityEl = document.querySelector('.weather-info-box .humidity');
let humidityUnitEl = document.querySelector('.weather-info-box .humidity-unit');
const windEl = document.querySelector('.weather-info-box .wind');
const windDirEl = document.querySelector('.weather-info-box .wind-direction');
const uvEL = document.querySelector('.weather-info-box .UV');
const uvStatusEl = document.querySelector('.weather-info-box .UV-text');
const pressureEl = document.querySelector('.weather-info-box .pressure');
let pressureUnitEl = document.querySelector('.weather-info-box .pressure-unit');
const pressureTendEL = document.querySelector('.weather-info-box .pressureTend');
const changeOfRainEl = document.querySelector('.weather-info-box .changeOfRain');
const changeOfRainSituationEl = document.querySelector('.weather-info-box .changeOfRainSituation');
const hiTemEl = document.querySelector('.weather-info-box .HiTem');
const lowTemEl = document.querySelector('.weather-info-box .LowTem');
const sunRiseEl = document.querySelector('.weather-info-box .sunRise');
const sunSetEl = document.querySelector('.weather-info-box .sunSet');
const moonRiseEl = document.querySelector('.weather-info-box .moonRise');
const moonSetEl = document.querySelector('.weather-info-box .moonSet');

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

          // Set the defaultCity to the input field
          defaultCity = input_field;

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

tomorrow_heading.addEventListener('click',async () =>{

  //Loader
  loader_container.style.display = 'flex';

  //Active tab
  this.classList.add('active');
  today_heading.classList.remove('active');

  //Display Data
  let check = await displayTodayData(defaultCity,true);

  if(check){
      loader_container.style.display = 'none';
  }else{
      loader_container.style.display = 'none';
      alert_message('Location Not found');
  }

});

