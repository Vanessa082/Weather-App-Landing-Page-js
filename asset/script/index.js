import { alert_message } from "./util";

// DOM Elements
const closeBtnEl = document.querySelector('.close-btn');
const loaderEl = document.querySelector('.loader-container');
const mainContentEl = document.querySelector('.main-content');
const tomorrowEl = document.querySelector('.tomorrow');
const todayEl = document.querySelector('.today');

const inputEl = document.querySelector('.inputData');
const submitIconEl = document.querySelector('.submitBtn');
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

// API Info
const API_KEY = "z1zrS8DdGEG9inp49wDOtpnyf1xVltzi";
let defaultCity = "Dhaka";

// Alert Message Function
const alertMessage = (message) => {
    closeBtnEl.closest('.alert').querySelector('.alert-body').textContent = message;
    closeBtnEl.closest('.alert').classList.remove('show');
    
    setTimeout(() => {
        closeBtnEl.closest('.alert').classList.add('show');
    }, 3000);
};

// Clear Display if no data fetched
const clearDisplay = (message) => {
    loaderEl.style.display = 'none';
    closeBtnEl.closest('.alert').classList.add('show');
    mainContentEl.innerHTML = `<div class="error"><p>${message}</p></div>`;
};

// Get Location from Search bar and display data
['submit', 'click'].forEach((evt) => {
    submitIconEl.addEventListener(evt, async (e) => {
        e.preventDefault();

        // Active tab
        todayEl.classList.add('active');
        tomorrowEl.classList.remove('active');
        
        const inData = inputEl.value;

        if (inData === '') {
            alertMessage('Field Must Not be empty!');
        } else {
            // Show loader
            loaderEl.style.display = 'flex';

            defaultCity = inData;
            inputEl.value = "";
            
            // Update Display Data
            let check = await displayTodayData(inData);
            if (check) {
                loaderEl.style.display = 'none';
            } else {
                loaderEl.style.display = 'none';
                alertMessage('Location Not found');
            }
        }
    });
});

...
// More code follows here

// Access location and load data
navigator.geolocation.getCurrentPosition(
    async (position) => {
        const { latitude, longitude } = position.coords;
        let check = displayTodayData(await getLocationByCoords(latitude, longitude));

        if (check) {
            loaderEl.style.display = 'none';
            alertMessage('Current Location Loaded');
        } else {
            loaderEl.style.display = 'none';
            alertMessage('Location Not found');
        }
    },
    async (err) => {
        let check = await displayTodayData(defaultCity);
        if (check) {
            loaderEl.style.display = 'none';
            alertMessage('Default Location Loaded');
        } else {
            alertMessage('Location Not found');
        }
    }, 
    {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
    }
);