async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("weatherResult");

  if (!city) {
    result.innerHTML = "Please enter a city.";
    return;
  }

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

    result.innerHTML = `
      <h2>${location.name}, ${location.country}</h2>
      <p>Temperature: ${weatherData.current_weather.temperature}°C</p>
      <p>Wind Speed: ${weatherData.current_weather.windspeed} km/h</p>
      <p>Weather Code: ${weatherData.current_weather.weathercode}</p>
    `;
  } catch (error) {
    result.innerHTML = "Something went wrong. Please try again.";
  }
}