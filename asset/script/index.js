import { alert_message } from "./util";

const loader_container = document.querySelector('.loader-container')
const search_form = document.querySelector('.search-form')
const search_button = document.querySelector('.search-button');
const weather_synopsis = document.querySelector('.weather-synopsis');
const weather_date = document.querySelector('.weatherdate');
const days = document.getElementById('.days');
const unit = document.getElementById('unit');
const weather_text = document.querySelector('.weathertext');
const weather_details = document.querySelector('.weather-details');
// const loader_container = document.querySelector('loader-container')
// const loader_container = document.querySelector('loader-container')
// const loader_container = document.querySelector('loader-container')
// const loader_container = document.querySelector('loader-container')

let default_city = 'Yaounde';
