const cityInput = document.getElementById("cityInput");

cityInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌍";
}

function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown weather";
}

async function getWeather() {
  const city = cityInput.value.trim();
  const result = document.getElementById("weatherResult");

  if (!city) {
    result.innerHTML = "Please enter a city.";
    return;
  }

  result.innerHTML = "Loading weather...";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      result.innerHTML = "City not found.";
      return;
    }

    const location = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;
    const icon = getWeatherIcon(current.weathercode);
    const description = getWeatherDescription(current.weathercode);

    result.innerHTML = `
      <div class="weather-icon">${icon}</div>
      <h2>${location.name}, ${location.country}</h2>
      <div class="temperature">${current.temperature}°C</div>
      <p>${description}</p>
      <div class="weather-details">
        <p>Wind Speed: ${current.windspeed} km/h</p>
        <p>Wind Direction: ${current.winddirection}°</p>
      </div>
    `;
  } catch (error) {
    result.innerHTML = "Something went wrong. Please try again.";
  }
}