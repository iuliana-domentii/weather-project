let apiKey = "502dc8f7ae36e57af1974e18d16a86f8";

function setCurrentTime() {
  let now = new Date();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[now.getDay()];
  let hour = now.getHours() < 10 ? `0${now.getHours()}` : `${now.getHours()}`;
  let minutes =
    now.getMinutes() < 10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`;
  let dayTime = `${day} ${hour}:${minutes}`;

  let dayTimeElement = document.getElementById("day-time-id");
  dayTimeElement.innerHTML = dayTime;
}

function addEnterEventOnSearchButton() {
  let input = document.getElementById("search-bar-id");

  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("search-btn-id").click();
    }
  });
}

function setCityWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(setWeather).catch(logError);
}

function initAfterPageLoad() {
  setCurrentTime();
  addEnterEventOnSearchButton();
  setCityWeather("Bern");
}

document.addEventListener("DOMContentLoaded", initAfterPageLoad);

function searchCityHandle(event) {
  event.preventDefault();

  let searchBarVal = event.target.form["search-bar"].value;
  searchBarVal = searchBarVal.trim();
  if (searchBarVal) {
    setCityWeather(searchBarVal);
  }

  event.target.form["search-bar"].value = "";
}

function currentCityHandle(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = Math.round(position.coords.latitude * 100) / 100;
    const lon = Math.round(position.coords.longitude * 100) / 100;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(setWeather).catch(logError);
  });
}

function setWeather(response) {
  let currentCityElement = document.getElementById("current-city-id");
  currentCityElement.innerHTML = response.data.name;

  let tempElement = document.querySelector("#current-city-temp-id");
  tempElement.innerHTML = `${Math.round(response.data.main.temp)} °C`;

  let weatherDescriptionElement = document.querySelector(
    "#weather-description-id"
  );
  weatherDescriptionElement.innerHTML = response.data.weather[0].description;

  let humidityElement = document.querySelector("#humidity-id");
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector("#wind-id");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  setWeatherIcon(response.data.weather[0].icon);
  setCurrentTime();
}

function setWeatherIcon(weatherIcon) {
  const weatherIcons = {
    "01d": "src/img/01d.png",
    "02d": "src/img/01n.png",
    "03d": "src/img/02d.png",
    "04d": "src/img/04d.png",
    "09d": "src/img/09d.png",
    "10d": "src/img/10d.png",
    "11d": "src/img/11d.png",
    "13d": "src/img/13d.png",
    "50d": "src/img/50d.png",
    "01n": "src/img/01n.png",
    "02n": "src/img/02n.png",
    "03n": "src/img/03n.png",
    "04n": "src/img/04n.png",
    "09n": "src/img/09n.png",
    "10n": "src/img/10n.png",
    "11n": "src/img/11n.png",
    "13n": "src/img/13n.png",
    "50n": "src/img/50n.png",
  };

  let weatherIconElement = document.querySelector("#weather-icon-id");

  let weatherIconSrc = weatherIcons[weatherIcon];
  if (weatherIconSrc) {
    weatherIconElement.src = weatherIconSrc;
  } else {
    weatherIconElement.src = "";
  }
}

function logError(error) {
  console.log(error);
}
