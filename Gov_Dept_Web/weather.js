document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.getElementById("loadingScreen");
  const mainContent = document.getElementById("mainContent");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const plantStem = document.getElementById("plantStem");

  let progress = 0;

  const updateProgress = () => {
    if (progress >= 100) {
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
          mainContent.style.display = "flex";
        }, 500);
      }, 500);
      return;
    }

    progress += 2;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
    plantStem.style.height = `${Math.min(progress, 100)}px`;

    setTimeout(updateProgress, 50);
  };

  updateProgress();
});

// Replace with your actual API key
const WEATHER_API_KEY = "9c571552169f2a3e3d48de4739dea199";

// Regional coordinates
const regions = {
  central: { lat: 23.6102, lon: 85.2799 }, // Ranchi, Jharkhand
  north: { lat: 28.6139, lon: 77.2090 },   // Delhi
  south: { lat: 12.9716, lon: 77.5946 },   // Bangalore, Karnataka
  east: { lat: 22.5726, lon: 88.3639 },    // Kolkata, West Bengal
  west: { lat: 19.07283000, lon: 72.88261000 },    // Mumbai, Maharashtra
};

// DOM Elements
const loading = document.getElementById("loading");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const rainfall = document.getElementById("rainfall");
const alertsContainer = document.getElementById("alertsContainer");
const forecastContainer = document.getElementById("forecastContainer");
const advisoryList = document.getElementById("advisoryList");
const regionSelect = document.getElementById("regionSelect");

async function fetchWeatherData(region) {
  loading.style.display = "block";

  try {
    const { lat, lon } = regions[region];
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();

    // Update current weather
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    rainfall.textContent = `${data.rain ? data.rain["1h"] || 0 : 0} mm`;

    // Update alerts
    updateAlerts(data.weather[0].main, data.main.temp);

    // Fetch and update forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const forecastData = await forecastResponse.json();
    updateForecast(forecastData.list);

    // Update advisory
    updateAdvisory(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alertsContainer.innerHTML = `
            <div class="alerts">
                <strong>Error:</strong> Failed to fetch weather data. Please try again later.
            </div>
        `;
  } finally {
    loading.style.display = "none";
  }
}

function updateAlerts(condition, temp) {
  const alerts = {
    Rain: "Consider postponing outdoor spraying activities. Monitor soil moisture levels.",
    Clear:
      "Good conditions for harvesting. UV index may be high - plan outdoor work accordingly.",
    Clouds:
      "Ideal conditions for fertilizer application and general fieldwork.",
    Storm:
      "Secure equipment and structures. Avoid outdoor agricultural activities.",
  };

  alertsContainer.innerHTML = `
        <div class="alerts">
            <strong>Weather Advisory:</strong> ${
              alerts[condition] ||
              "Monitor weather conditions for agricultural activities."
            }
        </div>
    `;
}

function updateForecast(forecastData) {
  console.log(forecastData); // Add this line to log the forecast data
  const threeDayForecast = forecastData.filter((entry, index, self) => 
    self.findIndex(e => new Date(e.dt * 1000).getDate() === new Date(entry.dt * 1000).getDate()) === index
  ).slice(0, 3);
  forecastContainer.innerHTML = threeDayForecast
    .map(
      (day) => `
        <div class="forecast-card">
            <h3>${new Date(day.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            })}</h3>
            <div class="weather-value">${Math.round(day.main.temp)}°C</div>
            <div class="weather-label">${day.weather[0].main}</div>
        </div>
    `
    )
    .join("");
}

function updateAdvisory(weatherData) {
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;

  const recommendations = [];

  if (temp > 25) {
    recommendations.push(
      "Increase irrigation frequency. Monitor for heat stress."
    );
  } else if (temp < 10) {
    recommendations.push(
      "Protect sensitive crops from cold. Check greenhouse temperatures."
    );
  }

  if (humidity > 80) {
    recommendations.push(
      "High disease risk. Monitor crops for fungal infections."
    );
  } else if (humidity < 40) {
    recommendations.push("Low humidity - consider additional irrigation.");
  }

  advisoryList.innerHTML = recommendations
    .map(
      (rec) => `
        <li class="advisory-item">
            <i class="fas fa-leaf"></i>
            ${rec}
        </li>
    `
    )
    .join("");
}

// Event Listeners
regionSelect.addEventListener("change", (e) => {
  fetchWeatherData(e.target.value);
});

// Initial fetch
fetchWeatherData("central");

// Refresh every 15 minutes
setInterval(() => {
  fetchWeatherData(regionSelect.value);
}, 900000);
