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
  getForecast(response.data.coord.lat, response.data.coord.lon);
}

const weatherIcons = {
  "01d": "src/img/01d.png",
  "02d": "src/img/02d.png",
  "03d": "src/img/03d.png",
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

function setWeatherIcon(weatherIcon) {
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

function getForecast(latitude, longitude) {
  //const lat = Math.round(latitude * 100) / 100;
  //const lon = Math.round(longitude * 100) / 100;
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showForecast).catch(logError);
}

function getDayFromTimestamp(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecastData = response.data.daily.slice(1, 7);

  let forecastHTML = `<div class="row">`;
  forecastData.forEach(function (dayData) {
    forecastHTML =
      forecastHTML +
      `
        <div class="col-2">
          <div class="daily-weather-forecast">${getDayFromTimestamp(
            dayData.dt
          )}</div>
          <img
            src=${weatherIcons[dayData.weather[0].icon]}
            alt=""
            width="42"
          />
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max"> ${Math.round(
              dayData.temp.max
            )}° </span>
            <span class="weather-forecast-temperature-min"> ${Math.round(
              dayData.temp.min
            )}° </span>
          </div>
        </div>
      `;
  });
  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function initAfterPageLoad() {
  setCurrentTime();
  addEnterEventOnSearchButton();
  setCityWeather("Bern");
}

initAfterPageLoad();
