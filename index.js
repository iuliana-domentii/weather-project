let apiKey = "502dc8f7ae36e57af1974e18d16a86f8";

function showCurrentDayTimeAtPageLoad() {
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

function initAfterPageLoad() {
  showCurrentDayTimeAtPageLoad();
  addEnterEventOnSearchButton();
}

document.addEventListener("DOMContentLoaded", initAfterPageLoad);

function searchCityHandle(event) {
  event.preventDefault();

  let searchBarVal = event.target.form["search-bar"].value;
  searchBarVal = searchBarVal.trim();
  if (searchBarVal) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchBarVal.toLowerCase()}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(setTemp).catch(logError);
  }

  event.target.form["search-bar"].value = "";
}

function currentCityHandle(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = Math.round(position.coords.latitude * 100) / 100;
    const lon = Math.round(position.coords.longitude * 100) / 100;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(setTemp).catch(logError);
  });
}

function setTemp(response) {
  document.getElementById("current-city-id").innerHTML = response.data.name;

  let tempElement = document.querySelector("#current-city-temp-id");
  tempElement.innerHTML = `${Math.round(response.data.main.temp)} °C`;
}

function logError(error) {
  console.log(error);
}
