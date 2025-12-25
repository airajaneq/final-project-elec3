/**
 * Weather Application
 * Fetches current weather and 5-day forecast data using OpenWeatherMap API
 */

const API_CONFIG = {
  KEY: "89ba290eaf1b5d8af079152e85d1e442",
  GEO_URL: "https://api.openweathermap.org/geo/1.0/direct",
  WEATHER_URL: "https://api.openweathermap.org/data/2.5/weather",
  FORECAST_URL: "https://api.openweathermap.org/data/2.5/forecast",
};

/**
 * DOM Elements Manager
 */
class DOMElements {
  static get cityInput() { return document.getElementById("cityInput"); }
  static get searchBtn() { return document.getElementById("searchBtn"); }
  static get statusEl() { return document.getElementById("status"); }
  static get errorBox() { return document.getElementById("errorBox"); }
  static get placeSelect() { return document.getElementById("placeSelect"); }
  static get themeToggle() { return document.getElementById("themeToggle"); }
  static get weatherBox() { return document.getElementById("weatherResult"); }
  static get cityNameEl() { return document.getElementById("cityName"); }
  static get countryEl() { return document.getElementById("country"); }
  static get descriptionEl() { return document.getElementById("description"); }
  static get tempEl() { return document.getElementById("temp"); }
  static get feelsLikeEl() { return document.getElementById("feelsLike"); }
  static get humidityEl() { return document.getElementById("humidity"); }
  static get windEl() { return document.getElementById("wind"); }
  static get pressureEl() { return document.getElementById("pressure"); }
  static get forecastBox() { return document.getElementById("forecastBox"); }
  static get forecastGrid() { return document.getElementById("forecastGrid"); }
}

/**
 * UI State Manager
 */
class UIManager {
  static setLoading(isLoading, message = "") {
    DOMElements.statusEl.textContent = message;
    DOMElements.searchBtn.disabled = isLoading;
    DOMElements.cityInput.disabled = isLoading;
    DOMElements.placeSelect.disabled = isLoading;
  }

  static showError(message) {
    DOMElements.errorBox.textContent = message;
    DOMElements.errorBox.classList.remove("hidden");
  }

  static clearError() {
    DOMElements.errorBox.textContent = "";
    DOMElements.errorBox.classList.add("hidden");
  }

  static hideResults() {
    DOMElements.weatherBox.classList.add("hidden");
    DOMElements.forecastBox.classList.add("hidden");
    DOMElements.forecastGrid.innerHTML = "";
  }

  static hidePlaceSelect() {
    DOMElements.placeSelect.classList.add("hidden");
    DOMElements.placeSelect.innerHTML = "";
  }

  static showPlaceSelect() {
    DOMElements.placeSelect.classList.remove("hidden");
  }

  static showWeatherBox() {
    DOMElements.weatherBox.classList.remove("hidden");
  }

  static showForecastBox() {
    DOMElements.forecastBox.classList.remove("hidden");
  }
}

/**
 * Input Validation
 */
class Validator {
  static validateCityInput(value) {
    const city = value.trim();
    
    if (!city) {
      return { ok: false, message: "Please enter a city name." };
    }
    
    if (city.length < 2) {
      return { ok: false, message: "City name must be at least 2 characters." };
    }

    const allowedPattern = /^[a-zA-ZÀ-ž\s.,'-]+$/;
    if (!allowedPattern.test(city)) {
      return { ok: false, message: "Please use letters and common punctuation only." };
    }

    return { ok: true, city };
  }
}

/**
 * API Service
 */
class WeatherAPI {
  static async fetch(url) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
        try {
          const data = await response.json();
          if (data?.message) errorMessage += ` (${data.message})`;
        } catch {}
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async geocodeCity(city) {
    const url = `${API_CONFIG.GEO_URL}?q=${encodeURIComponent(city)}&limit=5&appid=${API_CONFIG.KEY}`;
    const data = await this.fetch(url);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Location not found. Please check the spelling.");
    }

    return data;
  }

  static async getCurrentWeather(lat, lon) {
    const url = `${API_CONFIG.WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}&units=metric`;
    return this.fetch(url);
  }

  static async getForecast(lat, lon) {
    const url = `${API_CONFIG.FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}&units=metric`;
    return this.fetch(url);
  }
}

/**
 * Data Formatter
 */
class DataFormatter {
  static formatPlace(place) {
    const state = place.state ? `, ${place.state}` : "";
    return `${place.name}${state}, ${place.country}`;
  }

  static getDateLabel(unixSeconds) {
    const date = new Date(unixSeconds * 1000);
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  static selectDailyForecasts(forecastList) {
    const dailyMap = new Map();

    for (const item of forecastList) {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().slice(0, 10);
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.get(dateKey)?.push(item) || dailyMap.set(dateKey, [item]);
      } else {
        dailyMap.get(dateKey).push(item);
      }
    }

    const selected = [];
    Array.from(dailyMap.entries()).slice(0, 5).forEach(([, items]) => {
      let bestItem = items[0];
      let minDistance = Infinity;

      for (const item of items) {
        const itemDate = new Date(item.dt * 1000);
        const distance = Math.abs(itemDate.getUTCHours() - 12);
        
        if (distance < minDistance) {
          minDistance = distance;
          bestItem = item;
        }
      }
      
      selected.push(bestItem);
    });

    return selected;
  }
}

/**
 * Theme Manager
 */
class ThemeManager {
  static initialize() {
    const savedTheme = localStorage.getItem("weather_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  static updateThemeIcon(theme) {
    DOMElements.themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
  }

  static toggle() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("weather_theme", next);
    this.updateThemeIcon(next);
  }
}

/**
 * Weather Display Manager
 */
class WeatherDisplay {
  static showCurrentWeather(weatherData, place) {
    const city = place?.name || weatherData.name || "Unknown";
    const state = place?.state ? `, ${place.state}` : "";
    const country = place?.country || weatherData.sys?.country || "";

    const description = weatherData.weather?.[0]?.description || "N/A";
    const temp = Math.round(weatherData.main?.temp ?? 0);
    const feelsLike = Math.round(weatherData.main?.feels_like ?? 0);
    const humidity = weatherData.main?.humidity ?? 0;
    const wind = (weatherData.wind?.speed ?? 0).toFixed(1);
    const pressure = weatherData.main?.pressure ?? 0;

    DOMElements.cityNameEl.textContent = `${city}${state}`;
    DOMElements.countryEl.textContent = country ? `📍 ${country}` : "";
    DOMElements.descriptionEl.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    DOMElements.tempEl.textContent = temp;
    DOMElements.feelsLikeEl.textContent = feelsLike;
    DOMElements.humidityEl.textContent = humidity;
    DOMElements.windEl.textContent = wind;
    DOMElements.pressureEl.textContent = pressure;

    UIManager.showWeatherBox();
  }

  static showForecast(forecastData) {
    const forecastList = forecastData.list || [];
    if (!forecastList.length) return;

    const dailyItems = DataFormatter.selectDailyForecasts(forecastList);
    DOMElements.forecastGrid.innerHTML = "";

    for (const item of dailyItems) {
      const temp = Math.round(item.main?.temp ?? 0);
      const description = item.weather?.[0]?.main || "N/A";
      const dateLabel = DataFormatter.getDateLabel(item.dt);

      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <p class="forecast-date">${dateLabel}</p>
        <p class="forecast-desc">${description}</p>
        <p class="forecast-temp">${temp}°C</p>
      `;
      DOMElements.forecastGrid.appendChild(card);
    }

    UIManager.showForecastBox();
  }
}

/**
 * Main Weather App Controller
 */
class WeatherApp {
  constructor() {
    this.setupEventListeners();
    ThemeManager.initialize();
  }

  setupEventListeners() {
    DOMElements.searchBtn.addEventListener("click", () => this.performSearch());
    DOMElements.cityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.performSearch();
    });
    DOMElements.placeSelect.addEventListener("change", () => this.fetchSelectedPlace());
    DOMElements.themeToggle.addEventListener("click", () => ThemeManager.toggle());
  }

  async performSearch() {
    UIManager.clearError();
    UIManager.hideResults();
    UIManager.hidePlaceSelect();

    const validation = Validator.validateCityInput(DOMElements.cityInput.value);
    if (!validation.ok) {
      UIManager.showError(validation.message);
      return;
    }

    try {
      UIManager.setLoading(true, "Searching location...");
      const places = await WeatherAPI.geocodeCity(validation.city);
      this.populatePlaceSelect(places);
      UIManager.setLoading(false, "");
      await this.fetchSelectedPlace();
    } catch (error) {
      UIManager.setLoading(false, "");
      UIManager.showError(error.message || "Failed to find location.");
      console.error(error);
    }
  }

  populatePlaceSelect(places) {
    DOMElements.placeSelect.innerHTML = "";
    
    for (const place of places) {
      const option = document.createElement("option");
      option.value = JSON.stringify({
        lat: place.lat,
        lon: place.lon,
        name: place.name,
        state: place.state || "",
        country: place.country || "",
      });
      option.textContent = DataFormatter.formatPlace(place);
      DOMElements.placeSelect.appendChild(option);
    }
    
    UIManager.showPlaceSelect();
  }

  getSelectedPlace() {
    return JSON.parse(DOMElements.placeSelect.value);
  }

  async fetchSelectedPlace() {
    UIManager.hideResults();
    UIManager.clearError();

    const place = this.getSelectedPlace();

    try {
      UIManager.setLoading(true, "Loading weather data...");

      const currentWeather = await WeatherAPI.getCurrentWeather(place.lat, place.lon);
      WeatherDisplay.showCurrentWeather(currentWeather, place);

      const forecast = await WeatherAPI.getForecast(place.lat, place.lon);
      WeatherDisplay.showForecast(forecast);

      UIManager.setLoading(false, "");
    } catch (error) {
      UIManager.setLoading(false, "");
      UIManager.showError(error.message || "Failed to fetch weather data.");
      console.error(error);
    }
  }
}

// Initialize the application
new WeatherApp();

