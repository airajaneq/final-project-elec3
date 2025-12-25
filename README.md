# Final Project: Web Mini-Apps Collection

## Project Type
Solo project

## Description
This project is a collection of four interactive web mini-apps: a Calculator, Foodish Gallery, Stopwatch, and Weather App. Each app is built using HTML, CSS, and JavaScript, providing a simple and engaging user experience. The Foodish Gallery and Weather App utilize public APIs to fetch real-time data.

---

## Project Overview
- **Calculator**: Perform basic arithmetic operations with a clean UI.
- **Foodish Gallery**: Browse random food images by category using the Foodish API.
- **Stopwatch**: Track elapsed time with start, stop, and reset features.
- **Weather App**: Get current weather information for any city using a weather API.

---

## Main Features
- Responsive and modern UI for all apps
- Real-time data fetching for Foodish and Weather apps
- Category search and suggestions in Foodish Gallery
- Persistent theme toggle (light/dark mode)
- Error handling and user feedback

---

## APIs Used
### Foodish API
- **Name**: Foodish API
- **Base URL**: `https://foodish-api.com`
- **Endpoints**:
  - `GET /api/` — Get a random food image
  - `GET /api/images/<category>` — Get a random image from a specific category
- **Parameters**: `category` (string, optional)
- **Authentication**: None required

### Weather API
- **Name**: OpenWeatherMap API (example)
- **Base URL**: `https://api.openweathermap.org/data/2.5/`
- **Endpoints**:
  - `GET /weather?q={city name}&appid={API key}` — Get current weather by city
- **Parameters**: `q` (city name), `appid` (API key)
- **Authentication**: API key required

---

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)

---

## Getting Started
### 1. Clone or Download the Repository
```sh
git clone <repository-url>
# or download the ZIP and extract it
```

### 2. Run the Project Locally
1. Open the `final-project-elec3` folder.
2. Open any subfolder (e.g., `calculator`, `foodish`, `stopwatch`, `weather-api`).
3. Open the `index.html` file in your web browser.

---

## Credits & API Attribution
- **Foodish API**: [https://foodish-api.com/](https://foodish-api.com/)
- **OpenWeatherMap API**: [https://openweathermap.org/api](https://openweathermap.org/api)

---

## Author
- Solo Project by [Aira Jane Queroda]
